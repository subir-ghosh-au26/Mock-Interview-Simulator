const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

/**
 * GET /api/sessions
 * List all completed sessions
 */
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find({ status: 'completed' })
            .select('sessionId role difficulty interviewType duration overallScore percentageScore completedAt')
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
 * Get full session details
 */
router.get('/:id', async (req, res) => {
    try {
        const session = await Session.findOne({ sessionId: req.params.id });
        if (!session) return res.status(404).json({ error: 'Session not found' });

        res.json(session);
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

module.exports = router;
