const mongoose = require('mongoose');

const IdeaSubmissionSchema = new mongoose.Schema(
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
    ideaTitle: {
      type: String,
      required: [true, 'Idea title is required'],
      trim: true,
    },
    ideaDescription: {
      type: String,
      required: [true, 'Idea description is required'],
    },
    techStack: [String],
    supportingFileUrl: {
      type: String,
      default: '',
    },
    supportingFileName: {
      type: String,
      default: '',
    },
    externalLinks: {
      github: String,
      demo: String,
      drive: String,
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

// One idea submission per user per event
IdeaSubmissionSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('IdeaSubmission', IdeaSubmissionSchema);
