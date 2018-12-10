var express = require('express');
var router = express.Router();
var Game = require('../models/game');

/* GET home page. */
router.get('/', function(req, res, next) {
  Game.find({}, (err, game) => {
    if(err){
      console.log(err);
    }
    res.render('public/index', { title: 'Index',game: game });
  });
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
Game.getGameByCategory(req.params.cate, function(err, game){
  if(err){
    console.log(err);
  }
  console.log(game);
  
  res.render('public/category', {game: game});
})
});

module.exports = router;
