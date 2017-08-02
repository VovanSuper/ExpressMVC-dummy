var jwt = require('jsonwebtoken'),
  path = require('path'),
  superSecret = require(path.resolve(__dirname, '..', 'config/config.js')).jwtSecret;

var encodeJwt = function(user, cb) {
  return jwt.sign({
      id: user.id,
      name: user.name,
      username: user.password
    },
    superSecret, {
      expiresInMinutes: 1440 * 14 // expires in 24 hours
    }, cb);
}

var decodeJwt = function(token, cb) {
  return jwt.verify(token, superSecret, cb);
}

module.exports = {
  encodeJwt: encodeJwt,
  decodeJwt: decodeJwt,
  superSecret: superSecret
}
