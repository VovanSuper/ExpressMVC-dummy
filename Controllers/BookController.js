var bookController = function(repo, errorHandler) {

  var getId = function(req, resp) {
    return resp.status(200).json(req.item);
  };

  var get = function(req, resp) {
    if (req.query && req.query.genre) {
      repo.getByGenre(req.query.genre, function(err, itemsByGenre) {
        if (err) {
          return errorHandler.Handle(resp, {
            err: err,
            status: 404,
            message: 'No books found in the Database of genre provided '
          });
        }
        return resp.status(200).json(itemsByGenre); 
      }); 
    }
    else {
      repo.getAll(function(err, items) {
        if (err) {
          return errorHandler.Handle(resp, {
            err: err,
            status: 404,
            message: 'No books found in the Database '
          });
        }
        return resp.status(200).json(items);
      });
    }
  };

  var post = function(req, resp) {
    var content = req.body;
    if (!content)
      return resp.status(400).send('No document provided');

    var newBook = {
      name: content.name,
      author: content.author,
      published: content.date,
      genre: content.genre
    };
    repo.saveOrInsert(newBook, function(err, newBook) {
      if (err) {
        return errorHandler.Handle(resp, {
          err: err,
          status: 500,
          message: 'Error while trying to save new Book : '
        });
      }

      return resp.status(201).json(newBook);
      //resp.redirect('/api/books')
    });
  };

  var put = function(req, resp) {
    var item = req.item;
    item.name = req.body.name;
    item.author = req.body.author;
    item.genre = req.body.genre;
    item.date = req.body.date;
    item.picture = req.body.picture;
    repo.saveOrInsert(item, function(err, editedBook) {
      if (err) {
        errorHandler.Handle(resp, {
          err: err,
          status: 500,
          message: 'Error while PUTing item'
        });
      }
      return resp.status(201).json(editedBook);
      //resp.redirect('/api/books')
    });
  };

  var del = function(req, resp) {
    repo.remove(req.item, function(err) {
      if (err) {
        errorHandler.Handle(resp, {
          err: err,
          status: 500,
          message: 'Error deletion the item'
        });
      }
      resp.status(204).send('Books has been Deleted');
    });
  };

  var patch = function(req, resp) {
    var item = req.item;
    if (req.body._id)
      delete req.body._id;
    for (var key in req.body) {
      item[key] = req.body[key]
    }

    repo.saveOrInsert(item, function(err, editedBook) {
      if (err)
        return errorHandler.Handle(resp, {
          err: err,
          status: 500,
          message: 'Error while PATCHing item '
        });
      resp.status(201).json(editedBook);
    })
  };

  return {
    getId: getId,
    get: get,
    post: post,
    put: put,
    patch: patch,
    delete: del
  }
};

module.exports = exports = bookController;
