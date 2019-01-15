var express = require('express');
var router = express.Router();
var Game = require('../models/game');
var moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
  Game.find({})
      .limit(8)
      .sort({views: -1})
      .exec((err, game) => {
    if (err) {
      console.log(err);
    }
    res.render('public/index', { title: 'Index', game: game, moment: moment });
  });
});
// Data test
router.get('/data', function (req, res, next) {
  Game.find({}, (error, data) => {
    if (error) {
      console.log(error);
    }
    res.send(data);
  });
});

router.get('/detail/:id', function (req, res) {
  Game.findById(req.params.id, function (err, game) {
    if (err) {
      console.log(err);
    }
    res.render('public/detail', { game: game, moment: moment });
  })
});

router.get('/countViews/:id', function (req, res) {
  var id = req.params.id;
  Game.getGameById(id, function (err, game) {
    if (err) res.send({ errors: err });
    game.views = game.views + 1;
    Game.updateGame(id, game, (err, g) => {
      if (err) res.send({ errors: err });
      res.send({ success_msg: 'Edit success' });
    });
  });
});

router.get('/category/:cate', function (req, res) {
  Game.getGameByCategory(req.params.cate, function (err, game) {
    if (err) {
      console.log(err);
    }
    res.render('public/category', { game: game, cate: req.params.cate });
  })
});

router.get('/search/:name', function (req, res) {
  Game.find({ name: { $regex: '.*' + req.params.name + '.*', $options: "i" } })
    .limit(10)
    .exec(function (err, game) {
      if (err) {
        console.log(err);
      }
      res.send(game);
    });
});

module.exports = router;
