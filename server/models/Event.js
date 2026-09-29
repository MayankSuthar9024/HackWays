const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short summary is required'],
      maxlength: 300,
    },
    description: {
      type: String,
      required: [true, 'Full description is required'],
    },
    bannerImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Hackathon',
    },
    venue: {
      type: String,
      default: 'Virtual / Main Auditorium',
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline', 'Hybrid'],
      default: 'Online',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      default: '10:00 AM - 05:00 PM',
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
    },
    maxTeamSize: {
      type: Number,
      default: 4,
    },
    rules: [String],
    prizes: [
      {
        position: String,
        amount: String,
        perks: String,
      },
    ],
    // Precise schedule timings for releases and submission locks
    schedule: {
      psReleaseTime: {
        type: Date,
      },
      psReleasedManual: {
        type: Boolean,
        default: false,
      },
      prototypeOpenTime: {
        type: Date,
      },
      prototypeCloseTime: {
        type: Date,
      },
      prototypeManualOverride: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', EventSchema);
