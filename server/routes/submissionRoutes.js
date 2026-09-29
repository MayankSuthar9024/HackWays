const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// User stage 1: Idea proposal submission
router.post(
  '/events/:eventId/submissions/idea',
  protect,
  upload.single('supportingFile'),
  submissionController.submitIdea
);

// User stage 2: Prototype submission
router.post(
  '/events/:eventId/submissions/prototype',
  protect,
  upload.single('prototypeFile'),
  submissionController.submitPrototype
);

// User's own submissions for an event
router.get('/events/:eventId/submissions/mine', protect, submissionController.getMySubmissions);

module.exports = router;
