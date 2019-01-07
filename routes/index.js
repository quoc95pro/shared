var express = require('express');
var router = express.Router();
var Game = require('../models/game');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  Game.find({}, (err, game) => {
    if(err){
      console.log(err);
    }
    res.render('public/index', { title: 'Index',game: game, moment: moment });
  });
});
// Data test
router.get('/data', function(req, res, next) {
    Game.find({}, (error, data)=>{
        if(error){
            console.log(error);
        }
        res.send(data);
    });
});

router.get('/detail/:id', function(req, res){
  Game.findById(req.params.id, function(err, game){
    if(err){
      console.log(err);
    }

    res.render('public/detail', {game: game, moment: moment});
  })
});

router.get('/category/:cate', function(req, res){
Game.getGameByCategory(req.params.cate, function(err, game){
  if(err){
    console.log(err);
  }
  
  res.render('public/category', {game: game});
})
});

module.exports = router;
