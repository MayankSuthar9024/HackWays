const nodemailer = require('nodemailer');

const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  // If using Gmail or host is smtp.gmail.com
  if (process.env.SMTP_SERVICE === 'gmail' || (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail'))) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: pass.replace(/\s+/g, ''), // Strip spaces from Google App Passwords
      },
    });
  }

  // Custom SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
};

const sendOTPEmail = async (email, otp, name = 'User') => {
  const transporter = createTransporter();
  const subject = `Your Verification Code: ${otp} - Organization Portal`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #F9D5BA; border-radius: 12px; background-color: #F8EBE1;">
      <div style="background-color: #1F4D3A; color: #ffffff; padding: 16px; border-radius: 8px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">Organization Portal</h2>
      </div>
      <div style="padding: 24px 8px; color: #221610;">
        <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 14px; color: #5A463B;">Use the verification code below to log in or complete your registration. This code will expire in <strong>5 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 6px; padding: 12px 24px; background-color: #ffffff; border: 2px dashed #1F4D3A; border-radius: 8px; color: #1F4D3A;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 13px; color: #653220;">If you did not request this verification code, please ignore this email.</p>
      </div>
      <div style="border-top: 1px solid #D9C4B5; padding-top: 12px; text-align: center; font-size: 12px; color: #7A6559;">
        &copy; ${new Date().getFullYear()} Organization. All rights reserved.
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Organization Team" <no-reply@organization.org>',
        to: email,
        subject,
        html,
      });
      console.log(`[Email Sent]: OTP sent to ${email}`);
      return true;
    } catch (err) {
      console.error(`[Email Send Error]: ${err.message}`);
      console.log(`\n========================================\n[DEV OTP FALLBACK] OTP for ${email}: ${otp}\n========================================\n`);
      return false;
    }
  } else {
    // In dev / unconfigured mode, display formatted OTP in console
    console.log(`\n======================================================`);
    console.log(`📧 [EMAIL SIMULATOR - DEV MODE]`);
    console.log(`Recipient: ${email}`);
    console.log(`Verification OTP: >>> ${otp} <<< (Valid for 5 minutes)`);
    console.log(`======================================================\n`);
    return true;
  }
};

module.exports = { sendOTPEmail };
