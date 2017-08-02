var UsersController = function(repo, errorHandler) {

  var getId = function(req, resp) {
    return resp.status(200).json(req.item);
  }

  var get = function(req, resp) {
    repo.getAll(function(err, items) {
      if (err) {
        return errorHandler.Handle(resp, {
          err: err,
          status: 500,
          message: 'No users present; error: ' + err
        })
      }
      return resp.status(200).json(items.map(function(i) {
        return {
          _id: i._id,
          name: i.name
        }
      }));
    });
  };

  var post = function(req, resp) {
    var content = req.body;
    if (!content) return resp.status(400).send('No user provided');

    var newUser = {
      name: content.name,
      password: content.password
    }
    repo.saveOrInsert(newUser, function(err, item) {
      if (err) {
        return errorHandler.Handle(resp, {
          err: err,
          status: 500,
          message: 'Error while trying to save new User : '
        });
      }
      return resp.status(201).json(newUser);
    });
  };

  var put = function(req, resp) {

  };

  var patch = function(req, resp) {

  };

  var del = function(req, resp) {

  };

  var getMany = function(req, resp) {
    var userIds = req.params;
    var users = [];
    for (var id in userIds) {
      repo.getById(userIds[id], function(err, item) {
        if (err) {
          return errorHandler.Handle(resp, {
            err: err,
            status: 500,
            message: 'Error is ' + err
          });
        }
        users.push(item);
      });
    }
    return resp.status(200).json(users);
  }

  return {
    getMany: getMany,
    getId: getId,
    get: get,
    post: post,
    put: put,
    patch: patch,
    delete: del
  };
};

module.exports = exports = UsersController;
