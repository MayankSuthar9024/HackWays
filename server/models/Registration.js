const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    teamName: {
      type: String,
      trim: true,
      default: '',
    },
    collegeOrOrg: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Registered', 'Attended', 'Cancelled'],
      default: 'Registered',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate user registrations for the same event
RegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
