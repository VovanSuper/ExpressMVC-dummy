var bunyan = require('bunyan'),
    chalk  = require('chalk');

module.exports = function() {
    return bunyan.createLogger({
        name: 'Rest API',
        streams: [{
            level: 'info', // level : 30 shoulde be?
            stream: process.stdout
        }, {
            level: 'error',
            stream: process.stdout
        }]
    });
}();