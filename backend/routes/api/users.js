const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// @route GET api/users/test
// @desc Test users route
// @access Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Users route works' });
});

// @route POST api/users/register
// @desc Register a new user
// @access Public
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  // Check if the email already exists
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      } else {
        // Create new user
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        // Save the new user
        newUser
          .save()
          .then((user) => res.json(user))
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
