'use strict';

var path = require('path'),
  express = require('express');

module.exports = exports = function(userRepo, logger, User) {
  var usersRouter = express.Router(),
    repo = new userRepo(User),
    userIdHandler = require(path.resolve(__dirname, '../middlewares/entityByIdHandler')),
    errorHandler = require(path.resolve(__dirname, '../utils/errorHandler')),
    userController = require(path.resolve(__dirname, '../Controllers/UsersController'))(repo, errorHandler);

  usersRouter.route('/')
    .get(userController.get)
    .all(function(req, resp, next) {
      return resp.status(401).send('UNAUTHORIZED');
    })
    .post(userController.post);

  usersRouter
    .param('itemId', userIdHandler(repo, errorHandler))
    .route('/:itemId')
    .get(userController.getId)
    .delete(userController.delete)
    .put(userController.put)
    .patch(userController.patch);
    
  return usersRouter;
}
