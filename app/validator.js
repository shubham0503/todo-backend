const { check, body, validationResult } = require('express-validator');

// Sign Up Rules
const signUpRules = () => {
    return [
      body('email').isEmail(),
      check('name').notEmpty(),
      body('password').isLength({ min: 5 })
    ]
}

// Sign In Rules
const signInRules = () => {
    return [
      body('email').isEmail()
    ]
}

// Todo rules
const todoValidationRules = () => {
    return [
      body('email').isEmail(),
      body('password').isLength({ min: 5 }),
    ]
}

// Validator Function
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
    signUpRules,
    signInRules,
    validate
}
