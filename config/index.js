var configValues = require("./config");

module.exports = {
    getDBConnectionString: function(){
          //return `mongodb://${configValues.username}:${configValues.password}@ds153093.mlab.com:53093/shared`;
         // `mongodb://${configValues.username}:${configValues.password}@localhost:27017/shared?authSource=admin`;
         return `mongodb://${configValues.username}:${configValues.password}@45.124.65.56:27017/shared?authSource=admin`;
    }
}