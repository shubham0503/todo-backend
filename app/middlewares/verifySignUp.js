const db = require("../models");
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  // Email
  User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ status: 500, message: err });
      return;
    }

    if (user) {
      res.status(400).send({ status: 400, message: "The email address you have entered is already associated with another account." });
      return;
    }

    next();
  });
};

const verifySignUp = {
  checkDuplicateEmail
};

module.exports = verifySignUp;
