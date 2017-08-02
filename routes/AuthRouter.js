'use strict';

var express = require('express'),
  path = require('path'),
  router = express.Router(),

  authController = require(path.resolve(__dirname, '..', 'Controllers/AuthController.js'));

router.route('/login')
  .get(function(req, resp) {
    resp.status(301).redirect('/auth/login/local');
  });

router.route('/logout')
  .get(authController.logout);

router.route('/login/local')
  .get(authController.login)
  .post(authController.authenticate);

router.route('/signup')
  .get(authController.signup)
  .post(authController.passportSignup);

router.route('/login/facebook')
  .get(authController.fbLogin);

module.exports = router;
