const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * GET /api/admin/users
 * List all users with their interview stats
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        // Get interview stats for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const sessions = await Session.find({
                    userId: user._id,
                    status: 'completed'
                }).select('sessionId role difficulty percentageScore completedAt').sort({ completedAt: -1 });

                const avgScore = sessions.length > 0
                    ? Math.round(sessions.reduce((sum, s) => sum + (s.percentageScore || 0), 0) / sessions.length)
                    : 0;

                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    totalInterviews: sessions.length,
                    averageScore: avgScore,
                    recentSessions: sessions.slice(0, 5)
                };
            })
        );

        res.json(usersWithStats);
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

/**
 * GET /api/admin/users/:userId/sessions
 * Get all completed sessions for a specific user
 */
router.get('/users/:userId/sessions', async (req, res) => {
    try {
        const sessions = await Session.find({
            userId: req.params.userId,
            status: 'completed'
        })
            .select('sessionId role difficulty interviewType duration percentageScore overallScore completedAt')
            .sort({ completedAt: -1 });

        res.json(sessions);
    } catch (error) {
        console.error('Admin user sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch user sessions' });
    }
});

module.exports = router;
