const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Expected format:
    // Authorization: Bearer <JWT_TOKEN>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the logged-in user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: 'User no longer exists',
      });
    }

    // Make user available to the next controller
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};

module.exports = protect;