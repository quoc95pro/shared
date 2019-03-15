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
    req.checkBody('pass', 'Password field is min 5 character').isLength({ min: 5 });

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
  } else {
    res.redirect('admin/login');
  }
});

// Edit user
router.put('/', function (req, res, next) {

  if (req.isAuthenticated()) {
    // Form Validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('mail', 'Email field is required').notEmpty();
    req.checkBody('mail', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('pass', 'Password field is required').notEmpty();
    req.checkBody('pass2', 'Passwords do not match').equals(req.body.pass);
    req.checkBody('pass', 'Password field is min 5 character').isLength({ min: 5 });
    // Check Errors
    var errors = req.validationErrors();

    if (errors) {
      res.send({ errors: errors });
    } else {
      let id = req.body.id;
      let name = req.body.name;
      let mail = req.body.mail;
      let username = req.body.username;
      let pass = req.body.pass;
      let level = req.body.level;
      let avatar = req.body.avatar;

      User.getUserById(id, function (err, user) {
        if (err) res.send({ errors: err });
        user.name = name;
        user.email = mail;
        user.username = username;
        user.password = pass;
        user.userType = level;
        user.profileimage = avatar;
        User.findByIdAndUpdate(id, user, () => {
          if (err) res.send({ errors: err });
          res.send({ success_msg: 'Edit success' });
        });
      });
    }
  } else {
    res.redirect('admin/login');
  }
});

// Delete user

router.delete('/', (req, res) => {
  if (req.isAuthenticated()) {
    var id = req.body.id;
    User.findByIdAndDelete(id, (err, a) => {
      if (err) res.send({ errors: err });
      res.send({ success_msg: 'Deleted : ' + a.name });
    });
  } else {
    res.redirect('admin/login');
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

module.exports = router;
