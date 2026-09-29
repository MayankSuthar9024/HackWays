const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public / User routes
router.get('/', eventController.getAllEvents);
router.get('/user/my-events', protect, eventController.getMyEvents);
// Optional auth check on single event detail to attach user registration/submission state
router.get('/:id', (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, eventController.getEventById);

router.post('/:id/register', protect, eventController.registerForEvent);

// Admin-only event routes
router.post('/', protect, requireAdmin, upload.single('banner'), eventController.createEvent);
router.put('/:id', protect, requireAdmin, upload.single('banner'), eventController.updateEvent);
router.delete('/:id', protect, requireAdmin, eventController.deleteEvent);
router.put('/:id/schedule', protect, requireAdmin, eventController.updateSchedule);

module.exports = router;
