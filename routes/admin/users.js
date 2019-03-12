var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');

/* GET users listing. */
router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('admin/users/index', { title: 'Login' });
  }
});


router.post('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    var name = req.body.name;
    var mail = req.body.mail;
    var username = req.body.username;
    var pass = req.body.pass;
    var level = req.body.level;
    var avatar = req.body.avatar;

    // Form Validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('mail', 'Email field is required').notEmpty();
    req.checkBody('mail', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('pass', 'Password field is required').notEmpty();
    req.checkBody('pass2', 'Passwords do not match').equals(pass);

    // Check Errors
    var errors = req.validationErrors();

    if (errors) {
      res.send({ errors: errors });
    } else {
      var newUser = new User({
        name: name,
        email: mail,
        username: username,
        password: pass,
        profileimage: avatar,
        userType: level
      });

      User.createUser(newUser, function (err, user) {
        if (err) {
          res.send({ errors: err });
        } else {
          res.send({ success_msg: 'Create User success' });
        }
      });
    }
  }
});

router.get('/data', function (req, res, next) {
  User.find({}, ['-password'], (error, data) => {
    if (error) {
      console.log(error);
    }
    res.send(data);
  });
});

// Logout User
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success_msg', 'You are now logged out');
  res.redirect('/users/login');
});



module.exports = router;
