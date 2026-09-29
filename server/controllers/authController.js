const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { sendOTPEmail } = require('../config/mail');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const generate6DigitOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
  try {
    const { email, purpose, name, phone, college } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (purpose === 'signup') {
      if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Name and 10-digit phone number are required for sign up.' });
      }
      if (!/^[0-9]{10}$/.test(phone.trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number.' });
      }
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists. Please choose Login.' });
      }
    } else if (purpose === 'login') {
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (existingUser.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No registered user found with this email. Please Sign Up.' });
      }
    }

    // Delete prior OTPs for this email
    await query('DELETE FROM otps WHERE email = $1', [normalizedEmail]);

    const otp = generate6DigitOTP();
    const tempUserData = purpose === 'signup' ? { name: name.trim(), phone: phone.trim(), college: (college || '').trim() } : {};

    await query(
      `INSERT INTO otps (email, otp, purpose, temp_user_data, expires_at)
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '5 minutes')`,
      [normalizedEmail, otp, purpose || 'login', JSON.stringify(tempUserData)]
    );

    const recipientName = name || 'User';
    await sendOTPEmail(normalizedEmail, otp, recipientName);

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}. Valid for 5 minutes.`,
      email: normalizedEmail,
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Server error generating OTP. Please try again.' });
  }
};

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { rows: otpRows } = await query(
      'SELECT * FROM otps WHERE email = $1 AND otp = $2 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [normalizedEmail, otp.trim()]
    );

    if (otpRows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
    }

    const otpRecord = otpRows[0];
    let user;

    if (otpRecord.purpose === 'signup') {
      const temp = otpRecord.temp_user_data || {};
      const { rows: newUsers } = await query(
        `INSERT INTO users (name, email, phone, college, is_verified)
         VALUES ($1, $2, $3, $4, true)
         RETURNING id, name, email, phone, college, role`,
        [temp.name || 'Participant', normalizedEmail, temp.phone || '0000000000', temp.college || '']
      );
      user = newUsers[0];
    } else {
      const { rows: existingUsers } = await query(
        'SELECT id, name, email, phone, college, role FROM users WHERE email = $1',
        [normalizedEmail]
      );
      if (existingUsers.length === 0) {
        return res.status(404).json({ success: false, message: 'User account not found.' });
      }
      user = existingUsers[0];
    }

    // Clean up OTPs
    await query('DELETE FROM otps WHERE email = $1', [normalizedEmail]);

    const token = generateToken(user.id, 'user');

    return res.status(200).json({
      success: true,
      message: 'Successfully authenticated.',
      token,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during verification.' });
  }
};

// POST /api/auth/admin-login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Admin email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { rows } = await query('SELECT * FROM admins WHERE email = $1', [normalizedEmail]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const token = generateToken(admin.id, admin.role);

    return res.status(200).json({
      success: true,
      message: 'Admin access granted.',
      token,
      user: {
        id: admin.id,
        _id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin authentication.' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
      role: req.role,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving profile.' });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, college } = req.body;
    const { rows } = await query(
      `UPDATE users
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           college = COALESCE($3, college),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, phone, college, role`,
      [name, phone, college, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: { ...rows[0], _id: rows[0].id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
};
