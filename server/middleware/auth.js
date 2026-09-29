const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// Verify Bearer JWT token
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    if (decoded.role === 'admin' || decoded.role === 'superadmin') {
      const { rows } = await query('SELECT id, name, email, role, created_at FROM admins WHERE id = $1', [decoded.id]);
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Admin account not found or deactivated.' });
      }
      req.user = { ...rows[0], _id: rows[0].id };
      req.role = rows[0].role;
    } else {
      const { rows } = await query('SELECT id, name, email, phone, college, role, is_verified, created_at FROM users WHERE id = $1', [decoded.id]);
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'User account not found.' });
      }
      req.user = { ...rows[0], _id: rows[0].id };
      req.role = 'user';
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.role !== 'admin' && req.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (req.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Access denied: Super Admin privileges required.' });
  }
  next();
};

module.exports = { protect, requireAdmin, requireSuperAdmin };
