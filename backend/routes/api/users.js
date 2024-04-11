const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET api/users
// @desc    Get all users
// @access  Admin
router.get('/', (req, res, next) => {
  console.log('Getting all users...');
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => next(err));
});

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if the email already exists
      const user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      } else {
        // Create new user
        const newUser = new User({ name, email, password });

        // Hash the password
        const hash = await bcrypt.hash(newUser.password, 10);
        newUser.password = hash;

        // Save the new user
        const savedUser = await newUser.save();
        const token = auth.generateToken(savedUser._id);
        return res.json({
          msg: 'Successfully registered!',
          user: savedUser,
          token
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
