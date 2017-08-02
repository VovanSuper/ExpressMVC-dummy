var passport = require('passport');

var authenticationController = function(repo, errorHandler, logger, Model) {

  var get = function(req, resp) {
    resp.send('Stub for authentication View!!!');
  };

  var post = function(req, resp) {
    var user = req.body.user,
      password = req.body.password;
    if (user && password) {

    }
    else {
      resp.status(404).send('No User data provided');
    }
  };

  var logout = function(req, resp) {
    req.logout();
    if (req.session) {
      req.session.destroy(function() {
        console.log('Destroying the session');
      });
    }
    if (resp.cookie('connect.sid')) resp.clearCookie('connect.sid');
    // if (resp.cookie('connect.app_sess_id')) resp.clearCookie('connect.app_sess_id');
    return resp.redirect('/auth/login/local');
  };

  var login = function(req, resp) {
    resp.render('login', {
      title: 'Login page',
      user: resp.locals.user,
      toastr: resp.locals.toastr
    });
  };

  var signup = function(req, resp) {
    resp.render('register', {
      title: 'Register page'
    });
  };

  var authenticate = passport.authenticate('local-login', {
    successRedirect: '/users',
    failureRedirect: '/auth/login/local'
  });

  var passportSignup = passport.authenticate('local-signup', {
    successRedirect: '/users',
    failureRedirect: '/signup'
  });

  var fbLogin = passport.authenticate('facebook', {
    scope: ['id', 'email', 'name', 'public_profile']
  });

  return {
    get: get,
    post: post,
    logout: logout,
    login: login,
    authenticate: authenticate,
    singup: signup,
    passportSignup: passportSignup,
    fbLogin: fbLogin
  }
}

module.exports = authenticationController;
