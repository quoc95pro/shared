var configValues = require("./config");

module.exports = {
    getDBConnectionString: function(){
        //  return `mongodb://${configValues.username}:${configValues.password}@ds153093.mlab.com:53093/shared`;
         return `mongodb://${configValues.username}:${configValues.password}@localhost:27017/shared?authSource=admin`;
    }
}