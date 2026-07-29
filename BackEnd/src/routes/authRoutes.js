const express = require('express');
const {
  register,
  login
} = require('../controllers/authController');

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login existing user
router.post('/login', login);

module.exports = router;