const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route GET api/profile/me
// @desc Get current user's profile
// @access Private
router.get('/me', auth.verifyToken, (req, res) => {
  // Logic to fetch and return the user's profile
  res.status(200).json({ 'req.user': req.user });
});

module.exports = router;
