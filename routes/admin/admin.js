var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');

var User = require('../../models/user');
var Statistic = require('../../models/statistic');
var Cash = require('../../models/cash');
var Game = require('../../models/game');

/* GET admin page */
router.get('/', async (req, res) => {
  if (req.isAuthenticated()) {
    let lastCash = await Cash.find({}).limit(1).sort({ date: -1 }).exec();
    let views = await Statistic.aggregate([{
      $match: {
        date: {
          '$gte': new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    },
    {
      $group: {
        _id: {
          ip: '$ip',
          convertedDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date"
            }
          },
          country: '$country',
          timezone: '$timezone',
          city: '$city'
        }
      }
    },
    {
      $count: "count"
    }]).exec();

    let countGame = await Game.count({});

    let traffic = await Statistic.aggregate([{ $group: { _id: { convertedDate: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } }, myCount: { $sum: 1 } } }])
      .sort({ '_id.convertedDate': -1 })
      .limit(10);

    res.render('admin/index', { lastCash: lastCash, views: views, countGame: countGame, traffic: traffic });
  } else {
    res.redirect('admin/login');
  }
});

router.get('/login', function (req, res, next) {
  res.render('admin/login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: 'Invalid username or password' }), function (req, res) {
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


router.get('/statistic', async (req, res, next) => {
  let today = new Date();

  let arrDate = [];

  for (let index = 6; index >= 0; index--) {
    arrDate.push({
      _id: moment(new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate() - index).setHours(0, 0, 0, 0))).format('DD-MM-YYYY'),
      count: 0
    });
  }

  let stt = await Statistic.aggregate([{
    $match: {
      date: {
        '$gte': new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).setHours(0, 0, 0, 0))
      }
    }
  }, {
    $group: {
      _id: {
        ip: '$ip',
        convertedDate: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$date"
          }
        }
      },
      count: { $sum: 1 }
    }
  }, {
    $group: {
      _id: "$_id.convertedDate",
      count: { $sum: 1 },
    }
  },
  ])
    .sort({ '_id': -1 }).exec();

  for (let i = 0; i < arrDate.length; i++) {
    for (let j = 0; j < stt.length; j++) {
      if (arrDate[i]._id == stt[j]._id) {
        arrDate[i] = stt[j];
      }
    }
  }

  res.send(arrDate);
});

router.get('/today', async (req, res) => {
  let today = new Date();
    // Mảng 7 ngày gần nhất
  let arrStatistic = [];

  for (let index = 6; index >= 0; index--) {
    arrStatistic.push({
      _id: moment(new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate() - index).setHours(0, 0, 0, 0))).format('DD-MM-YYYY'),
      count: 0,
      views: 0,
      earned: 0
    });
  }
    // Thu nhập 7 ngày gần nhất
  let cash = await Cash.aggregate([{ $match: { date: { '$gte': new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).setHours(0, 0, 0, 0)) } } }, {
    $group: { _id: { date: { $dateToString: { format: "%d-%m-%Y", date: "$date" } }, count: { $sum: 0 }, views: '$views', earned: '$earned' } }
  }])
    .sort({ '_id.date': -1 }).exec();
    
  let cashByDay = await cash.map(function (key, index) {
    if (index < cash.length - 1) {
      key._id.views = key._id.views - cash[index + 1]._id.views;
      key._id.earned = key._id.earned - cash[index + 1]._id.earned;
    }
    return key;
  });

  await cashByDay.reverse();
    // visitor 7 ngày gần nhất
  let countVisitor = await Statistic.aggregate([{ $match: { date: { '$gte': new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).setHours(0, 0, 0, 0)) } } }, {
    $group: { _id: { ip: '$ip', convertedDate: { $dateToString: { format: "%d-%m-%Y", date: "$date" } } }, count: { $sum: 1 } }
  }, {
    $group: { _id: "$_id.convertedDate", count: { $sum: 1 } }
  }])
    .sort({ '_id': -1 }).exec();
    // chuyển thu nhập, visitor 7 ngày vào mảng
  for (let i = 0; i < arrStatistic.length; i++) {
    for (let j = 0; j < countVisitor.length; j++) {
      if (arrStatistic[i]._id == countVisitor[j]._id) {
        arrStatistic[i].count = countVisitor[j].count;
      }
    }
    for (let j = 0; j < cashByDay.length; j++) {
      if (arrStatistic[i]._id == cashByDay[j]._id.date) {
        arrStatistic[i].views = cashByDay[j]._id.views;
        arrStatistic[i].earned = cashByDay[j]._id.earned;
      }
    }
  }

  res.send(arrStatistic);
});

// Logout User
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success_msg', 'You are now logged out');
  res.redirect('/admin/login');
});

module.exports = router;
