const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Optional, if you want to fetch user details later

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded typically has: { id, email, iat, exp }
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
