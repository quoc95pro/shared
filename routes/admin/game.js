var express = require('express');
var router = express.Router();

var Game = require('../../models/game');
var Category = require('../../models/category');
var Seri = require('../../models/seri');

/* GET Game Page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    Category.find({}, ['-_id', 'name', 'group', 'ename'], function (err, category) {
      
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
  } else {
    res.redirect('admin/login');
  }
});

// Add game

router.post('/', function (req, res, next) {

  if (req.isAuthenticated()) {
    var name = req.body.name;
    var category = req.body.category;
    var postedDate = new Date();
    var views = 0;
    var downloads = 0;
    var downloadLink = JSON.parse(req.body.downloadLink);
    var avatar = JSON.parse(req.body.avatar);
    var uploadBy = '';
    var systemRequirements = req.body.systemRequirements;
    var description = req.body.description;
    var seri = req.body.seri;

    // Form Validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('downloadLink', 'Download Link field is required').notEmpty();

    // Check Errors
    var errors = req.validationErrors();

    if (errors) {
      res.send({ errors: errors });
    } else {
      var objCategory = [];
      if (typeof (category) != 'object') {
        objCategory.push(JSON.parse(category));
      } else {
        category.forEach(element => {
          objCategory.push(JSON.parse(element));
          console.log(element);

        });
      }

      var newGame = new Game({
        name: name,
        category: objCategory,
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
        if (err) {
          res.send({ errors: err });
        } else {
          res.send({ success_msg: 'Create Game success' });
        }

      });
    }
  } else {
    res.redirect('admin/login');
  }
});

// Edit game
router.put('/', function (req, res, next) {

  if (req.isAuthenticated()) {
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
      var downloadLink = JSON.parse(req.body.downloadLink);
      var systemRequirements = req.body.systemRequirements;
      var description = req.body.description;
      var avatar = JSON.parse(req.body.avatar);
      var seri = req.body.seri;

      Game.getGameById(id, function (err, game) {
        if (err) res.send({ errors: err });
        game.name = name;
        game.category = [];
        game.downloadLink = downloadLink;
        game.systemRequirements = systemRequirements;
        game.description = description;
        game.avatar = avatar;
        game.seri = seri;
        if (typeof (category) != 'object') {
          game.category.push(JSON.parse(category));
        } else {
          category.forEach(element => {
            game.category.push(JSON.parse(element));
          });
        }
        Game.updateGame(id, game, (err, g) => {
          if (err) res.send({ errors: err });
          res.send({ success_msg: 'Edit success' });
        });
      });
    }
  } else {
    res.redirect('admin/login');
  }
});

// Delete game

router.delete('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    var id = req.body.id;
    Game.findByIdAndDelete(id, (err, a) => {
      if (err) res.send({ errors: err });
      res.send({ success_msg: 'Deleted : ' + a.name });
    });
  } else {
    res.redirect('admin/login');
  }
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

  if (req.isAuthenticated()) {
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
  } else {
    res.redirect('admin/login');
  }
});

module.exports = router;
