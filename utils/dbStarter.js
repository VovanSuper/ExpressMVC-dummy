var path = require('path'),
  connConfig = require(path.resolve(__dirname, '../config/config.js')).db.connectionString;

var conn = null;

module.exports = exports = function(mongoose, logger) {
  if (!conn) {
    mongoose.connect(connConfig.host, connConfig.creds);
    conn = mongoose.connection;
    conn.on('open', function() {
        logger.info('Opened connection to ' + conn.host);
      })
      .on('connected', function() {
        logger.info('Connected to mlab');
      })
      .on('disconnected', function() {
        logger.error('Disconnected from mlab');
      })
      .on('error', function(err) {
        logger.error('Error connection ', err);
      });
  }
  
  process.on('SIGINT', function() {
    conn.close(function() {
      logger.error('Mongoose default --> app terminating');
      process.exit(0);
    });
  });
}