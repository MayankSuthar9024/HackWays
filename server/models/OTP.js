const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['login', 'signup', 'admin_login'],
      default: 'login',
    },
    tempUserData: {
      name: String,
      phone: String,
      college: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // MongoDB automatically removes document after 300s (5 min)
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('OTP', OTPSchema);
