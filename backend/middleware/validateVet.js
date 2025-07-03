// Example: attach decoded user to req.user
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  if (req.user.role !== 'vet') {
    return res.status(403).json({ error: 'Only veterinarians can perform this action' });
  }
  next();
};
