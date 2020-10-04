const { verifySignUp } = require('../middlewares');
const authController = require('../controllers/Auth');
const { signUpRules, validate } = require('../validator.js');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post(
    '/api/auth/signup', signUpRules(), validate, verifySignUp.checkDuplicateEmail, authController.signup
  );

  app.post('/api/auth/signin', authController.signin);

  // app.post('/confirmation', authController.confirmationPost);
  // app.post('/resend', authController.resendTokenPost);
};
