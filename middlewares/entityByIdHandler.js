module.exports = exports = function(repo, errorHandler) {
  return function(req, resp, next, id) {
    repo.getById(id, function(err, item) {
      if (err || !item) {
        return errorHandler.Handle(resp, {
          err: err || 'No item found by id ' + id,
          status: 500,
          message: 'No item with id ' + id
        });
      }
      req.item = item;
      console.log('Item is : ' + item);
      next();
    });
  }
}