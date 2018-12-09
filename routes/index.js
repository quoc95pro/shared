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

module.exports = router;
