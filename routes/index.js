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
// Data test
router.get('/data', function(req, res, next) {
  var data = [
    {
        "id": 0,
        "name": "Item 0",
        "price": "$0",
        "amount": 3
    },
    {
        "id": 1,
        "name": "Item 1",
        "price": "$1",
        "amount": 4
    },
    {
        "id": 2,
        "name": "Item 2",
        "price": "$2",
        "amount": 8
    },
    {
        "id": 3,
        "name": "Item 3",
        "price": "$3",
        "amount": 2
    },
    {
        "id": 4,
        "name": "Item 4",
        "price": "$4",
        "amount": 90
    },
    {
        "id": 5,
        "name": "Item 5",
        "price": "$5",
        "amount": 2
    },
    {
        "id": 6,
        "name": "Item 6",
        "price": "$6",
        "amount": 3
    },
    {
        "id": 7,
        "name": "Item 7",
        "price": "$7",
        "amount": 7
    },
    {
        "id": 8,
        "name": "Item 8",
        "price": "$8",
        "amount": 39
    },
    {
        "id": 9,
        "name": "Item 9",
        "price": "$9",
        "amount": 78
    },
    {
        "id": 10,
        "name": "Item 10",
        "price": "$10",
        "amount": 30
    },
    {
        "id": 11,
        "name": "Item 11",
        "price": "$11",
        "amount": 32
    },
    {
        "id": 12,
        "name": "Item 12",
        "price": "$12",
        "amount": 12
    },
    {
        "id": 13,
        "name": "Item 13",
        "price": "$13",
        "amount": 76
    },
    {
        "id": 14,
        "name": "Item 14",
        "price": "$14",
        "amount": 10
    },
    {
        "id": 15,
        "name": "Item 15",
        "price": "$15",
        "amount": 9
    },
    {
        "id": 16,
        "name": "Item 16",
        "price": "$16",
        "amount": 8
    },
    {
        "id": 17,
        "name": "Item 17",
        "price": "$17",
        "amount": 1
    },
    {
        "id": 18,
        "name": "Item 18",
        "price": "$18",
        "amount": 99
    },
    {
        "id": 19,
        "name": "Item 19",
        "price": "$19",
        "amount": 100
    },
    {
        "id": 20,
        "name": "Item 20",
        "price": "$20",
        "amount": 109
    }
]

  res.send(data);
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
