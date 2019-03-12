var express = require('express');
var router = express.Router();
var Game = require('../models/game');
var Category = require('../models/category');
var moment = require('moment');
var request = require('request');
var async = require("async");

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let topViewGame = await Game.find({}).limit(8).sort({ views: -1 }).exec();
    let topDownloadGame = await Game.find({}).limit(8).sort({ downloads: -1 }).exec();
    let newestGame = await Game.find({}).limit(8).sort({ postedDate: -1 }).exec();

    res.render('public/index', {
      topViewGame: topViewGame,
      topDownloadGame: topDownloadGame,
      newestGame: newestGame,
      moment: moment,
      title: 'taigamekhung.com - Free Games '
    });
  } catch (error) {
    res.render('public/error');
    console.log(error);
  }
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

router.get('/detail/:ename', async (req, res) => {
  Game.findOne({ ename: req.params.ename }, function (err, game) {
    if (err) {
      console.log(err);
    }

    async.forEachOf(game.downloadLink, (value, key, callback) => {

      request('https://123link.co/api?api=56fe0dae1ba5b43b8514b1565c9e97412ff3c21e&url=' + value.link.replace('&', '%26'), function (error, response, body) {

        if (error) console.log(error);
        game.downloadLink[key].link = JSON.parse(body).shortenedUrl;
        callback();
      });
    }, err => {
      if (err) console.error(err.message);
      Category.find({})
        .exec((err, cateAll) => {
          res.render('public/detail', { game: game, moment: moment, cateAll: cateAll, title: game.name + " - taigamekhung.com" });
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

router.get('/category/:cate/:page', async (req, res) => {
  try {
    let game = await Game.find({ 'category.eName': req.params.cate }).limit(14).skip(req.params.page * 14 - 14).exec();
    let countRow = await Game.find({ 'category.eName': req.params.cate }).count();
    let cateAll = await Category.find({}).exec();

    var maxPage = Math.floor(countRow / 14);
    if (countRow % 14 >= 1) {
      maxPage += 1;
    }

    res.render('public/category', {
      game: game,
      type: 'category',
      cate: req.params.cate,
      currentPage: req.params.page,
      cateAll: cateAll,
      maxPage: maxPage,
      title: req.params.cate + " - taigamekhung.com"
    });

  } catch (error) {
    res.render('public/error');
    console.log(error);
  }
});

router.get('/group/:group/:page', async (req, res) => {
  try {
    let game = await Game.find({ 'category.egroup': req.params.group }).limit(14).skip(req.params.page * 14 - 14).exec();
    let countRow = await Game.find({ 'category.egroup': req.params.group }).count();
    let cateAll = await Category.find({}).exec();

    var maxPage = Math.floor(countRow / 14);
    if (countRow % 14 >= 1) {
      maxPage += 1;
    }

    res.render('public/category', {
      game: game,
      type: 'group',
      cate: req.params.group,
      currentPage: req.params.page,
      cateAll: cateAll,
      maxPage: maxPage,
      title: req.params.group + " - taigamekhung.com"
    });

  } catch (error) {
    res.render('public/error');
    console.log(error);
  }
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
  Category.aggregate([{ $group: { _id: { egroup: "$egroup", group: "$group" } } }])
    .exec(function (err, cate) {
      if (err) {
        console.log(err);
      }
      res.send(cate);
    });
});

module.exports = router;
