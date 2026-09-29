const mongoose = require('mongoose');

const PrototypeSubmissionSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemStatement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProblemStatement',
      required: true,
    },
    ideaSubmission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IdeaSubmission',
    },
    prototypeTitle: {
      type: String,
      required: [true, 'Prototype title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Prototype summary/instructions are required'],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      default: '',
    },
    driveUrl: {
      type: String,
      default: '',
    },
    uploadedFileUrl: {
      type: String,
      default: '',
    },
    uploadedFileName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Shortlisted', 'Rejected'],
      default: 'Submitted',
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One prototype submission per user per event
PrototypeSubmissionSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('PrototypeSubmission', PrototypeSubmissionSchema);
