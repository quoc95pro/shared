var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images/game'});

var Game = require('../models/game');
var Category = require('../models/category');
var Seri = require('../models/seri');

/* GET Game listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/addGame', function(req, res, next) {
  Category.find({}, function(err, category){

    if(err){
      console.log(err);
    }

    Seri.find({}, function(err, seri){
      if(err){
        console.log(err);
      }
      console.log(seri);
      
      res.render('admin/addGame', {category: category, seri: seri});
    });

  }); 
});

router.post('/addGame', upload.single('avatar') ,function(req, res, next) {
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
  	console.log('Uploading File...');
  	var avatar = req.file.filename;
  } else {
  	console.log('No File Uploaded...');
  	var avatar = 'noimage.jpg';
  }

  // Form Validator
  req.checkBody('name','Name field is required').notEmpty();

  // Check Errors
  var errors = req.validationErrors();

  if(errors){
  	res.render('admin/addGame', {
  		errors: errors
  	});
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
      if(err) throw err;
      console.log(game);
    });

    req.flash('success_msg', 'Create Game success');

    res.location('/');
    res.redirect('/');
  }
});


router.get('/detail/:id', function(req, res){
    Game.findById(req.params.id, function(err, game){
      if(err){
        console.log(err);
      }

      res.render('public/detail', {game: game});
    })
});

router.get('/category/:cate', function(req, res){
  Game.getGameByCategory(req.params.id, function(err, game){
    if(err){
      console.log(err);
    }
    console.log(game);
    
    res.render('public/category', {game: game});
  })
});

module.exports = router;
