const jwt = require('jsonwebtoken');
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

module.exports = {
  generateToken,
  verifyToken
};
