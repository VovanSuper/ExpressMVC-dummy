'use strict';

var path = require('path'),
  express = require('express');

module.exports = exports = function(bookRepo, logger, Book) {
  var booksRouter = express.Router(),
    repo = new bookRepo(Book),
    bookIdHandler = require(path.resolve(__dirname, '../middlewares/entityByIdHandler')),
    errorHandler = require(path.resolve(__dirname, '../utils/errorHandler')),
    bookController = require(path.resolve(__dirname, '../Controllers/BookController'))(repo, errorHandler);

   booksRouter.route('/')
    .get(bookController.get)
    .post(bookController.post);

  booksRouter
    .param("bookId", bookIdHandler(repo, errorHandler))
    .route('/:bookId')
    .get(bookController.getId)
    .delete(bookController.delete)
    .put(bookController.put)
    .patch(bookController.patch);

  return booksRouter;
}
