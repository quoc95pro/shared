var mongoose = require('mongoose');

// Category Schema
var CategorySchema = mongoose.Schema({
	egroup: { type: String },
	name: { type: String },
	eName: { type: String },
	group: { type: String }
});

var Category = module.exports = mongoose.model('Category', CategorySchema);

module.exports.getCategoryById = function (id, callback) {
	Category.findById(id, callback);
}

module.exports.createCategory = function (newCategory, callback) {
	newCategory.save(callback);
}