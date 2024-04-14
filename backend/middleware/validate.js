const { check, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    return next();
  };
};

const register = () => {
  return [
    check('name', 'Name is required').not().isEmpty().escape(),
    check('email', 'Please include a valid email').isEmail().escape(),
    check('password', 'Please enter a password with 6 or more characters')
      .isLength({ min: 6 })
      .escape()
  ];
};

const login = () => {
  return [
    check('email', 'Please include a valid email').isEmail().escape(),
    check('password', 'Password is required').isLength({ min: 6 }).escape()
  ];
};

module.exports = {
  validate,
  register,
  login
};
