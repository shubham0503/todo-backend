const authConfig = require("../config/auth.config");
const mailConfig = require("../config/mail.config");
const db = require("../models");
const User = db.user;
const Token = db.token;
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const { email, name, password } = req.body

  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ status:500, message: err });
      return;
    }

    // Commented This code Because I had to use my personal mail id
    // let token = new Token({ id: user._id, token: crypto.randomBytes(16).toString('hex') });
    // token.save((err, user) => {
    //   if (err) {
    //     res.status(500).send({ message: err });
    //     return;
    //   }
    //   // Send the email
    //   let transporter = nodemailer.createTransport({ service: 'gmail', host: 'smtp.gmail.com', auth: { user: mailConfig.USERNAME, pass: mailConfig.PASSWORD } });

    //   let mailOptions = { from: mailConfig.USERNAME, to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };

    //   transporter.sendMail(mailOptions, function (err) {
    //       if (err) { res.status(500).send({ msg: err.message }); return; }
    //       res.status(200).send('A verification email has been sent to ' + user.email + '.');
    //   });
    // });
    
    res.status(200).send({ status: 200, message: "User was registered successfully!" });
  });
};

exports.confirmationPost = function (req, res, next) {
  // Find a matching token
  Token.findOne({ token: req.body.token }, function (err, token) {
      if (!token) return res.status(400).send({ status: 400, type: 'not-verified', message: 'We were unable to find a valid token. Your token may have expired.' });

      // If we found a token, find a matching user
      User.findOne({ _id: token.id, email: req.body.email }, function (err, user) {
          if (!user) return res.status(400).send({ status: 400, msg: 'We were unable to find a user for this token.' });
          if (user.isVerified) return res.status(400).send({ status: 400, type: 'already-verified', msg: 'This user has already been verified.' });

          // Verify and save the user
          user.isVerified = true;
          user.save(function (err) {
              if (err) { return res.status(500).send({ status: 400, msg: err.message }); }
              res.status(200).send({status: 400, message: "The account has been verified. Please log in."});
          });
      });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ status: 200, message: err });
        return;
      }

      if (!user) {
        return res.status(401).send({ status: 401, message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          status: 401,
          accessToken: null,
          message: "Invalid email or password!"
        });
      }
      
      if (!user.isVerified) {
        return res.status(410).send({ 
          status: 410,
          type: 'not-verified',
          message: 'Your account has not been verified.'
        });
      }

      let token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        status: 200,
        id: user._id,
        name: user.name,
        email: user.email,
        accessToken: token
      });
    });
};
