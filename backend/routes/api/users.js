const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @route GET api/users
// @desc Get all users
// @access Admin
router.get('/', (req, res, next) => {
  console.log('Getting all users...');
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => next(err));
});

// @route POST api/users/register
// @desc Register a new user
// @access Public
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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    console.log(req.body);
    // Check if the email already exists
    User.findOne({ email })
      .then((user) => {
        if (user) {
          return res.status(400).json({ email: 'Email already exists' });
        } else {
          // Create new user
          const newUser = new User({ name, email, password });

          // Hash the password
          bcrypt
            .hash(newUser.password, 10)
            .then((hash) => {
              newUser.password = hash;
              // Save the new user
              newUser
                .save()
                .then((user) => {
                  const token = auth.generateToken(user._id);
                  return res.json({ user: user, token: token });
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
);

// @route POST api/users/login
// @desc Login user
// @access Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(req.body);
    // Check if the email exists
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res
            .status(400)
            .json({ email: 'There is no user with the provided email' });
        } else {
          // Check is password matches
          bcrypt
            .compare(password, user.password)
            .then((result) => {
              res.status(200).json({ msg: 'logged in' });
            })
            .catch((err) => {
              return res
                .status(400)
                .json({ password: 'Password is incorrect' });
            });
        }
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
