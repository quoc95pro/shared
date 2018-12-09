var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shared');

var db = mongoose.connection;

// Seri Schema
var SeriSchema = mongoose.Schema({
	name: {
		type: String
	}
});

var Seri = module.exports = mongoose.model('Seri', SeriSchema);

module.exports.getSeriById = function(id, callback){
	Seri.findById(id, callback);
}

module.exports.createSeri = function(newSeri, callback){
   			newSeri.save(callback);
}