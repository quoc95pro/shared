var mongoose = require('mongoose');

// Seri Schema
var StatisticSchema = mongoose.Schema({
	ip: { type: String },
    url: { type: String },
    date: {type: Date},
    browser: { type: String },
    language: { type: String },
    country: { type: String },
    region: { type: String },
    timezone: { type: String },
    city: { type: String },
    ll: {
        long: String,
        lat: String
    }
});

var Statistic = module.exports = mongoose.model('Statistic', StatisticSchema);

// module.exports.getSeriById = function(id, callback){
// 	Seri.findById(id, callback);
// }

// module.exports.createSeri = function(newSeri, callback){
//    			newSeri.save(callback);
// }