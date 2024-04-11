const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/profiles
// @desc    Create or update user profile
// @access  Private
router.post('/', auth.verifyToken, async (req, res) => {
  try {
    // Check if user already has profile
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      return res.status(400).json({ msg: 'Profile already exists' });
    }

    const { company, website, location, status, skills, bio, githubusername } =
      req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;

    const newProfile = new Profile(profileFields);
    await newProfile.save();

    res.status(200).json({ msg: 'Profile created!', profile: newProfile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth.verifyToken, (req, res) => {
  // Logic to fetch and return the user's profile
  res.status(200).json({ 'req.user': req.user });
});

module.exports = router;
