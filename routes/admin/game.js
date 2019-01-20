var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/game' });

var Game = require('../../models/game');
var Category = require('../../models/category');
var Seri = require('../../models/seri');

/* GET Game Page. */
router.get('/', function (req, res, next) {
  Category.find({}, function (err, category) {

    if (err) {
      console.log(err);
    }

    Seri.find({}, function (err, seri) {
      if (err) {
        console.log(err);
      }
      res.render('admin/game/index', { category: category, seri: seri });
    });

  });
});

// Add game

router.post('/', upload.single('avatar'), function (req, res, next) {
  var name = req.body.name;
  var category = req.body.category;
  var postedDate = new Date();
  var views = 0;
  var downloads = 0;
  var downloadLink = req.body.downloadLink;
  var uploadBy = '';
  var systemRequirements = req.body.systemRequirements;
  var description = req.body.description;
  var seri = req.body.seri;

  if (req.file) {
    var avatar = req.file.filename;
  } else {
    var avatar = 'noimage.jpg';
  }

  // Form Validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('downloadLink', 'Download Link field is required').notEmpty();

  // Check Errors
  var errors = req.validationErrors();

  if (errors) {
    res.send({ errors: errors });
  } else {
    var newGame = new Game({
      name: name,
      category: category,
      postedDate: postedDate,
      views: views,
      downloads: downloads,
      downloadLink: downloadLink,
      uploadBy: uploadBy,
      systemRequirements: systemRequirements,
      description: description,
      seri: seri,
      avatar: avatar
    });

    Game.createGame(newGame, function (err, game) {
      if (err) res.send({ errors: err });
      res.send({ success_msg: 'Create Game success' });
    });
  }
});

// Edit game
router.put('/', upload.single('avatar'), function (req, res, next) {
  // Form Validator
  req.checkBody('id', 'id field is required').notEmpty();
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('downloadLink', 'Download Link field is required').notEmpty();

  // Check Errors
  var errors = req.validationErrors();

  if (errors) {
    res.send({ errors: errors });
  } else {
    var id = req.body.id;
    var name = req.body.name;
    var category = req.body.category;
    var downloadLink = req.body.downloadLink;
    var systemRequirements = req.body.systemRequirements;
    var description = req.body.description;
    var seri = req.body.seri;

    Game.getGameById(id, function (err, game) {
      if (err) res.send({ errors: err });
      game.name = name;
      game.category = [];
      game.downloadLink = downloadLink;
      game.systemRequirements = systemRequirements;
      game.description = description;
      game.seri = seri;
      if (typeof (category) != 'object') {
        game.category.push(JSON.parse(category));
      } else {
        category.forEach(element => {
          game.category.push(JSON.parse(element));
        });
      }
      if (req.file) {
        game.avatar = req.file.filename;
      }
      Game.updateGame(id, game, (err, g) => {
        if (err) res.send({ errors: err });
        res.send({ success_msg: 'Edit success' });
      });
    });
  }
});

// Delete game

router.delete('/', function (req, res, next) {
  var id = req.body.id;
  Game.findByIdAndDelete(id, (err, a) => {
    if (err) res.send({ errors: err });
    res.send({ success_msg: 'Deleted : ' + a.name });
  });
});

// Get Category

router.get('/category', function (req, res, next) {
  Category.find({}, ['-_id', 'name', 'group', 'ename'], function (err, category) {
    if (err) {
      console.log(err);
    }
    res.send(category);
  });
});

// Add Category

router.post('/category', (req, res) => {
  var name = req.body.categoryName;
  var eName = req.body.categoryEname
  var group = req.body.categoryGroup;

  Category.find({ name: name })
    .count()
    .exec((err, count) => {
      if (err) res.send({ errors: err });
      if (count > 0) {
        res.send({ success_msg: 'Category đã tồn tại !!! ' });
      } else {
        var cate = new Category({
          name: name,
          eName: eName,
          group: group
        });
        cate.save((err, cate) => {
          if (err) res.send({ errors: err });
          res.send({ success_msg: 'Add Category success !!! ' });
        });
      }
    });
});

module.exports = router;
