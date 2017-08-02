module.exports = exports = function(logger) {
    var reqLogger = function(req, resp, next) {
        logger.info(req.method + ' --> ' + req.protocol + '://' + req.hostname + req.url);
        if (req.method === 'POST') {
            logger.info('Resource was posted : ' + JSON.stringify(req.body));
        }
        next();
    }
    return reqLogger
}