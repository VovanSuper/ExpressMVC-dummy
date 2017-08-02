'use strict';

var path    = require('path'),
    express = require('express');
    

module.exports = function(logger) {
        var mainRouter = express.Router(),
        errorHandler = require(path.resolve(__dirname, '../utils/errorHandler')),
        mainController = require(path.resolve(__dirname, '../Controllers/MainController'))(errorHandler, logger);
        
    mainRouter.route('/')
        .get(mainController.get);
        
    // mainRouter.route('/authenticate')
    //     .get(authenticateController.get)
    //     .post(authenticateController.post);
    
    return mainRouter;
}