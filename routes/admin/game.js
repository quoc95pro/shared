var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images/game'});

var Game = require('../../models/game');
var Category = require('../../models/category');
var Seri = require('../../models/seri');

/* GET Game Page. */
router.get('/', function(req, res, next) {
  Category.find({}, function(err, category){

    if(err){
      console.log(err);
    }

    Seri.find({}, function(err, seri){
      if(err){
        console.log(err);
      }
      res.render('admin/game/index', {category: category, seri: seri});
    });

  }); 
});

router.get('/category', function(req, res, next) {
  Category.find({}, function(err, category){
    if(err){
      console.log(err);
    }
      res.send(category);
  }); 
});

// Add game

router.post('/', upload.single('avatar') ,function(req, res, next) {
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
  
  if(req.file){
  	var avatar = req.file.filename;
  } else {
  	var avatar = 'noimage.jpg';
  }

  // Form Validator
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('downloadLink','Download Link field is required').notEmpty();

  // Check Errors
  var errors = req.validationErrors();

  if(errors){
  	res.send({errors: errors});
  } else{
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

    Game.createGame(newGame, function(err, game){
      if(err) res.send({errors: err});
      res.send({success_msg: 'Create Game success'});
    });
  }
});

// Edit game
router.put('/', upload.single('avatar') ,function(req, res, next) {
  // Form Validator
  req.checkBody('id','id field is required').notEmpty();
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('downloadLink','Download Link field is required').notEmpty();

  // Check Errors
  var errors = req.validationErrors();

  if(errors){
  	res.send({errors: errors});
  } else{
    var id = req.body.id;
    var name = req.body.name;
    var category = req.body.category;
    var downloadLink = req.body.downloadLink;
    var systemRequirements = req.body.systemRequirements;
    var description = req.body.description;
    var seri = req.body.seri;
    
    Game.getGameById(id, function(err, game){
        if(err) res.send({errors: err});
        game.name = name;
        game.category = category;
        game.downloadLink = downloadLink;
        game.systemRequirements = systemRequirements;
        game.description = description;
        game.seri = seri;
        if(req.file){
          game.avatar = req.file.filename;
        }
        Game.updateGame(id, game, (err, g) => {
          if(err) res.send({errors: err});
          res.send({success_msg: 'Edit success'});
        });
    });
  }
});

// Delete game

router.delete('/', function(req, res,) {
  var id = req.body.id;
  Game.findByIdAndDelete(id, (err, a) =>{
    if(err) res.send({errors: err});
    res.send({success_msg: 'Deleted : '+ a.name});
  });
});


module.exports = router;
