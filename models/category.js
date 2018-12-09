var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shared');

var db = mongoose.connection;

// Category Schema
var CategorySchema = mongoose.Schema({
	name: {
		type: String
	}
});

var Category = module.exports = mongoose.model('Category', CategorySchema);

module.exports.getCategoryById = function(id, callback){
	Category.findById(id, callback);
}

module.exports.createCategory = function(newCategory, callback){
   			newCategory.save(callback);
}