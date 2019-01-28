var express = require('express');
var router = express.Router();
var Game = require('../models/game');
var Category = require('../models/category');
var moment = require('moment');
var request = require('request');
var async = require("async");

/* GET home page. */
router.get('/', function (req, res, next) {
  Game.find({})
    .limit(8)
    .sort({ views: -1 })
    .exec((err, topViewGame) => {
      if (err) {
        console.log(err);
      }
      Game.find({})
        .limit(8)
        .sort({ downloads: -1 })
        .exec((err, topDownloadGame) => {
          if (err) {
            console.log(err);
          }
          Game.find({})
            .limit(8)
            .sort({ postedDate: -1 })
            .exec((err, newestGame) => {
              if (err) {
                console.log(err);
              }
              res.render('public/index', {
                title: 'Index',
                topViewGame: topViewGame,
                topDownloadGame: topDownloadGame,
                newestGame: newestGame,
                moment: moment,
                title:'Shared.Com | Free Games '
              });
            });
        });
    });
});
// Data test
router.get('/data', function (req, res, next) {
  Game.find({}, ['-avatar._id', '-downloadLink._id'], (error, data) => {
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

    async.forEachOf(game.downloadLink, (value, key, callback) => {

      request('https://123link.co/api?api=56fe0dae1ba5b43b8514b1565c9e97412ff3c21e&url=' + value.link, function (error, response, body) {

        if (error) console.log(error);
        game.downloadLink[key].link = JSON.parse(body).shortenedUrl;
        callback();
      });
    }, err => {
      if (err) console.error(err.message);
      Category.find({})
        .exec((err, cateAll) => {
          res.render('public/detail', { game: game, moment: moment, cateAll: cateAll, title: game.name + " | Shared.com" });
        });
    });
  });
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

router.get('/countDownloads/:id', function (req, res) {
  var id = req.params.id;
  Game.getGameById(id, function (err, game) {
    if (err) res.send({ errors: err });
    game.downloads = game.downloads + 1;
    Game.updateGame(id, game, (err, g) => {
      if (err) res.send({ errors: err });
      res.send({ success_msg: 'Edit success' });
    });
  });
});

router.get('/category/:cate/:page', function (req, res) {
  Game.find({ 'category.name': req.params.cate })
    .limit(14)
    .skip(req.params.page * 14 - 14)
    .exec((err, game) => {
      if (err) {
        console.log(err);
      }
      Game.find({ 'category.name': req.params.cate })
        .count((err, countRow) => {
          if (err) {
            console.log(err);
          }
          var maxPage = Math.floor(countRow / 14);
          if (countRow % 14 >= 1) {
            maxPage += 1;
          }

          Category.find({})
            .exec((err, cateAll) => {
              res.render('public/category', {
                game: game,
                type: 'category',
                cate: req.params.cate,
                currentPage: req.params.page,
                cateAll: cateAll,
                maxPage: maxPage,
                title: req.params.cate + " | Shared.com"
              });
            });

        })
    })
});

router.get('/group/:group/:page', function (req, res) {
  Game.find({ 'category.group': req.params.group })
    .limit(14)
    .skip(req.params.page * 14 - 14)
    .exec((err, game) => {
      if (err) {
        console.log(err);
      }
      Game.find({ 'category.group': req.params.group })
        .count((err, countRow) => {
          if (err) {
            console.log(err);
          }
          var maxPage = Math.floor(countRow / 14);
          if (countRow % 14 >= 1) {
            maxPage += 1;
          }

          Category.find({})
            .exec((err, cateAll) => {
              res.render('public/category', {
                game: game,
                type: 'group',
                cate: req.params.group,
                currentPage: req.params.page,
                cateAll: cateAll,
                maxPage: maxPage
              });
            });
        })
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

router.get('/cateGroup', function (req, res) {
  Category.distinct('group')
    .exec(function (err, cate) {
      if (err) {
        console.log(err);
      }
      res.send(cate);
    });
});

module.exports = router;
