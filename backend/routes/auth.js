const express = require('express');
const { passport, generateToken, verifyToken } = require('../config/auth');

const router = express.Router();

// Authentication Routes
router.get('/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    const token = generateToken(req.user);
    const redirectUrl = `${process.env.FRONTEND_URL}/auth-success?token=${token}`;
    res.redirect(redirectUrl);
  }
);

// Get current user info
router.get('/me', verifyToken, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

module.exports = router;
