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
  var a = '';
    var b = '';
  if(res.locals.cate !=''){
    var a = 'category';
    var b = res.locals.cate;
  }
  Game.findById(req.params.id, function(err, game){
    if(err){
      console.log(err);
    }

    res.render('public/detail', {game: game, moment: moment,breadcrumbs : a, link : b });
  })
});

router.get('/category/:cate', function(req, res){
  req.flash('cate', req.params.cate);
Game.getGameByCategory(req.params.cate, function(err, game){
  if(err){
    console.log(err);
  }  
  res.render('public/category', {game: game, cate:req.params.cate});
})
});

module.exports = router;
