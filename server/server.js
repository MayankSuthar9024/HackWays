require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { initDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const psRoutes = require('./routes/psRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Initialize PostgreSQL Schema
initDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(u => u.trim()) : true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', psRoutes);
app.use('/api', submissionRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Database seed endpoint for environments without terminal/shell access (e.g., Render Free tier)
app.get('/api/seed', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== (process.env.SEED_SECRET || 'Admin@Org2026!')) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. Please provide ?secret=Admin@Org2026!',
    });
  }

  try {
    const { seedData } = require('./scripts/seed');
    const result = await seedData();
    res.json({
      success: true,
      message: 'PostgreSQL Database successfully seeded with admin and sample events!',
      admin: result.adminEmail,
      note: 'You can now log in at /admin/login',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend build in production mode
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Hackways API Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
  console.log(`📧 SMTP Service: ${process.env.SMTP_USER ? 'Configured (' + process.env.SMTP_USER + ')' : 'Dev Console Mode'}`);
});
