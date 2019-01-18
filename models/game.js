var mongoose = require('mongoose');

var db = mongoose.connection;

// Game Schema
var GameSchema = mongoose.Schema({
	name: {
		type: String
	},
	category: [{
		name: String,
		ename: String,
		group: String
	}],
	postedDate: {
		type: Date
	},
	views: {
		type: Number
	},
	downloads: {
		type: Number
	},
	downloadLink: {
		type: String
	},
	uploadBy: {
		type: String
	},
	systemRequirements: {
		type: String
	},
	description: {
		type: String
	},
	seri: {
		type: String
	},
	avatar: {
		type: String
	}
});

var Game = module.exports = mongoose.model('Game', GameSchema);

module.exports.getGameById = function (id, callback) {
	Game.findById(id, callback);
}

module.exports.getGameByName = function (name, callback) {
	var query = { name: name };
	Game.findOne(query, callback);
}

module.exports.getGameByCategory = function (category, callback) {
	var query = { category: category };
	Game.find(query, callback);
}

module.exports.updateGame = function(id, game, callback) {
	Game.findByIdAndUpdate(id, game, callback);
}

module.exports.createGame = function (newGame, callback) {
	newGame.save(callback);
}