const cors = require('cors');
const session = require('express-session');
const { passport } = require('../config/auth');

// CORS middleware
const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
});

// Session middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
});

// Passport middleware
const passportMiddleware = passport.initialize();
const passportSessionMiddleware = passport.session();

module.exports = {
  corsMiddleware,
  sessionMiddleware,
  passportMiddleware,
  passportSessionMiddleware
};
