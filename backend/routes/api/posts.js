const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth.verifyToken, (req, res) => {
  // Logic to create a post
});

module.exports = router;
