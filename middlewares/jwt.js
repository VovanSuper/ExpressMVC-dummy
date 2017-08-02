var path = require('path'),
  jwt = require(path.join(__dirname, '..', 'utils/JwtMaker'));


module.exports = exports = function(req, resp, next) {
  return function(user) {
    var token = req.body.token || req.param['token'] || req.get('x-access-token');
    if (token) {
      jwt.decodeJwt(token, function(err, decoded) {
        if (err) return resp.status(403).send({
          successg: false,
          message: 'Bad jwt token',
          authenticate: req.protocol + '://' + req.hostname + 'authenticate'
        });
        req.jwtToken = decoded;
      });
    }
    else {
      resp.status(403).send({
        success: false,
        message: 'Unauthoriszed request. No jwt token',
        authenticate: req.protocol + '://' + req.hostname + '/authenticate'
      });
    }
  }
}
