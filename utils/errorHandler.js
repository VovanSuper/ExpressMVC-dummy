var path    = require('path'),
    newLine = require('os').EOL,
    chalk   = require('chalk'),
    logger  = require('./Logger');
    
module.exports.Handle = function (resp, errObj) {                // {errObj.err, errObj.status, errObj.message 
  logger.error(errObj.err + newLine);
  return resp.status(errObj.status).send(errObj.message);                     // TODO: Realize the error type to set resp.status
                                                                              // Make more advanced Handler for DEV/PROD ENV
}