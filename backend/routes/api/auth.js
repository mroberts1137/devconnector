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
router.post('/', validate(login()), async (req, res) => {
  const { email, password } = req.body;

  try {
    //Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
    }

    //Check if password is valid
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    } else if (passwordMatch) {
      // User is authenticated. Generate JWT and send it as response
      const token = auth.generateToken(user._id);
      return res
        .status(200)
        .json({ msg: 'Successfully logged in!', user: user, token: token });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
