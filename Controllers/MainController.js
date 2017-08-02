var mainController = function(errorHandler, logger) {
    
    var get = function(req, resp) {
        resp.send('<h2> Hello, the following is link to our books api: <a href="//' + req.hostname + '/api/books" >Books</a> </h2> ' );
    }
    return {
        get : get
    }
}

module.exports = mainController;