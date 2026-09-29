const express = require('express');
const router = express.Router();
const psController = require('../controllers/psController');
const { protect, requireAdmin } = require('../middleware/auth');

// Problem statements for an event (requires login/registration or admin)
router.get('/events/:eventId/problem-statements', protect, psController.getEventProblemStatements);

// Admin-only PS management
router.post('/events/:eventId/problem-statements', protect, requireAdmin, psController.createProblemStatement);
router.put('/problem-statements/:id', protect, requireAdmin, psController.updateProblemStatement);
router.delete('/problem-statements/:id', protect, requireAdmin, psController.deleteProblemStatement);

module.exports = router;
