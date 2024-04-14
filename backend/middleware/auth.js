const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

const generateToken = (userId) => {
  const payload = {
    user: {
      id: userId
    }
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (req, res, next) => {
  console.log('Verifying Token...');

  // Get token from request header
  const token = req.header('x-auth-token');
  console.log('x-auth-token: ', token);

  // If no token, return error
  if (!token) {
    return res.status(401).json({ msg: 'No token. Authorization denied' });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const authenticate = async (req, res, next) => {
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
      // User is authenticated. Add user field to req.
      req.user = {
        id: user._id
      };
      return next();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate
};
