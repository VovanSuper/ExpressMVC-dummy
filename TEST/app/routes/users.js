var express = require('express');
var router = express.Router();
var Users = require('../models/Users');

router.param('id', function(id, req, resp, next) {
  Users.findOne({where: {id: id}})
    .then(function(user) {
      resp.locals.user = user;
    })
    .catch(function(err){
      next(err);
    });
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
