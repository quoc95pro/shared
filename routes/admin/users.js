var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/users/index', { title: 'Login' });
});


router.get('/login', function (req, res, next) {
  res.render('admin/login', { title: 'Login' });
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: 'Invalid username or password' }),
  function (req, res) {
    req.flash('success_msg', 'You are now logged in');
    res.redirect('/admin');
  });

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    if (err) throw err;
    if (!user) {
      return done(null, false, { message: 'Unknown User' });
    }
    
    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) return done(err);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid Password' });
      }
    });
  });
}));

router.post('/register', function (req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var userType = 1;
  var status = 'inactive';
  var profileimage = 'noimage.jpg';

  // Form Validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Check Errors
  var errors = req.validationErrors();

  if (errors) {
    res.render('public/register', {
      errors: errors
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage,
      userType: userType,
      status: status
    });

    User.createUser(newUser, function (err, user) {
      if (err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'You are now registered and can login');
    res.redirect('/');
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
