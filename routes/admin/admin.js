var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../../models/user');
var Statistic = require('../../models/statistic');

/* GET admin page */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render('admin/index');
  } else {
    res.redirect('admin/login');
  }
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
  done(null, user.id);
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


router.get('/statistic', function (req, res, next) {
  Statistic.find({}, ['-_id', 'ip', 'country', 'timezone', 'city'], function (err, statistic) {
    if (err) {
      console.log(err);
    }
    res.send(statistic);
  });
});

// Logout User
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success_msg', 'You are now logged out');
  res.redirect('/admin/login');
});

module.exports = router;
