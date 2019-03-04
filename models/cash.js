var mongoose = require('mongoose');

// Category Schema
var CashSchema = mongoose.Schema({
	views: { type: Number },
    earned: { type: Number },
    date: {type: Date}
});

var Cash = module.exports = mongoose.model('Cash', CashSchema);
