const mongoose = require('mongoose');

const ProblemStatementSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    psCode: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Problem statement title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Problem statement description is required'],
    },
    category: {
      type: String,
      required: true,
      default: 'General / Software',
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProblemStatement', ProblemStatementSchema);
