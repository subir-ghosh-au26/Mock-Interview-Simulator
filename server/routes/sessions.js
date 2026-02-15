const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { authMiddleware } = require('../middleware/auth');

// All session routes require authentication
router.use(authMiddleware);

/**
 * GET /api/sessions
 * Users see their own sessions; admins see all sessions
 */
router.get('/', async (req, res) => {
    try {
        const filter = { status: 'completed' };

        // Non-admin users only see their own sessions
        if (req.user.role !== 'admin') {
            filter.userId = req.user._id;
        }

        const sessions = await Session.find(filter)
            .select('sessionId userId role difficulty interviewType duration overallScore percentageScore completedAt')
            .populate('userId', 'name email')
            .sort({ completedAt: -1 })
            .limit(50);

        res.json(sessions);
    } catch (error) {
        console.error('List sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

/**
 * GET /api/sessions/:id
 * Users can only view their own session; admins can view any
 */
router.get('/:id', async (req, res) => {
    try {
        const session = await Session.findOne({ sessionId: req.params.id })
            .populate('userId', 'name email');
        if (!session) return res.status(404).json({ error: 'Session not found' });

        // Non-admin users can only view their own sessions
        if (req.user.role !== 'admin' && session.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You do not have access to this session.' });
        }

        res.json(session);
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

module.exports = router;
