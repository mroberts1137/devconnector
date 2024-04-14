const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { validate, login } = require('../../middleware/validate');
require('dotenv').config();

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', validate(login()), auth.authenticate, (req, res) => {
  // User is authenticated. Generate JWT and send it as response
  const token = auth.generateToken(req.user.id);
  return res
    .status(200)
    .json({ msg: 'Successfully logged in!', user: req.user, token: token });
});

module.exports = router;
