'use strict';

var
  conf = require('./config.js'),
  path = require('path'),
  passport = require('passport'),
  localStrategy = require('passport-local').Strategy,
  passportJwt = require('passport-jwt'),
  jwtStrategy = passportJwt.Strategy,
  extractJwt = passportJwt.ExtractJwt,
  facebookStrategy = require('passport-facebook').Strategy,
  Users = require(path.join(__dirname, '..', 'models', 'Users.js'));

var localOpts = {
  usernameField: 'email',
  passReqToCallback: true
};
var fbOpts = {
  clientID: conf.facebook.FACEBOOK_APP_ID,
  clientSecret: conf.facebook.FACEBOOK_APP_SECRET,
  callbackURL: conf.facebook.callbackUrl,
  profileFields: ['id', 'email', 'name', 'public_profile'],
  passReqToCallback: true
};
var jwtOpts = {
  secretOrKey: conf.jwtSecret,
  jwtFromRequest: extractJwt.fromAuthHeader()
};

var localAuth = new localStrategy(localOpts, function(req, email, password, done) {
  if (req.user)
    return done(null, req.user, {
      message: 'User already logged in'
    });

  if (!email.trim() || !password.trim())
    return done(null, false, {
      message: 'Both non empty username and password are required !'
    });

  process.nextTick(function() {

    Users.findOne({
      'local.email': email
    }, function(err, user) {
      if (err || !user)
        return done(err || null, false, {
          message: 'Error matching username / no such user in database'
        });

      user.verifyPassword(password, function(err, isMatch) {
        if (err || !isMatch)
          return done(err || null, false, {
            message: 'Error matching password for user ' + user['_id']
          });

        return done(null, user);
      });
    });

  });
});

var localSignup = new localStrategy(localOpts, function(req, email, password, done) {

  if (!email.trim() || !password.trim())
    return done(null, false, {
      message: 'Both non empty username and password are required !'
    });

  process.nextTick(function() {
    if (!req.user) {
      Users.findOne({
        'local:email': email
      }, function(err, user) {
        if (err)
          return done(err, null);

        if (user) {
          return done(null, user, {
            message: 'User with such email already exists'
          });
        }
        else {
          var newUser = {};
          newUser['facebook'] = {};
          newUser['local'] = {
            name: req.body.name,
            email: req.body.email,
            registered: req.body.registered,
            password: req.body.password
          };
          Users.create(newUser, function(err, user) {
            if (err || !user)
              return done(err || null, null, {
                message: 'Problem while trying to create new user: ' + err.message || err
              });

            return done(null, user);
          });
        }
      });
    }
    else {
      // we gotta connect to existing fb account, as this method (fb-login) were used for login?..
      var user = req.user;
      user.local = {
        name: req.body.name,
        email: req.body.email,
        registered: req.body.registered,
        password: req.body.password
      };
      user.save(function(err) {
        if (err)
          return done(err);

        return done(null, user);
      });
    }
  });
});

var facebookAuth = new facebookStrategy(fbOpts, function(req, accessToken, refreshToken, profile, cb) {
  process.nextTick(function() {

    if (!req.user) {
      Users.findOne({
        'facebook.id': profile.id
      }, function(err, user) {
        if (err)
          return cb(err, false, {
            message: 'Eror proceeding with Facebook authentication process!'
          });

        if (!user) {
          var newFbUser = {};
          newFbUser['local'] = {};
          newFbUser['facebook'] = {
            'id': profile.id,
            'name': profile.name.givenName + ' ' + profile.name.familyName,
            'email': (profile.emails[0].value || '').toLowerCase(),
            'token': accessToken
          };
          Users.create(newFbUser, function(err, user) {
            if (err)
              return cb(err, false, {
                message: 'Error registering new FB user'
              });

            return cb(null, user);
          });
        }
        else {
          user.facebook.id = profile.id;
          user.facebook.token = accessToken;
          user.facebook.name = profile.name;
          user.email = (profile.emails[0].value || '').toLowerCase();
          user.save(function(err) {
            if (err) return cb(err, null);

            return cb(null, user);
          });
        }
      });

    }
    else {
      // user already exists and is logged in, we have to link accounts
      var user = req.user; // pull the user out of the session

      user.facebook.id = profile.id;
      user.facebook.accessToken = accessToken;
      user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
      user.facebook.email = profile.emails[0].value.toLowerCase() || '';

      user.save(function(err) {
        if (err)
          return cb(err);

        return cb(null, user);
      });
    }

  });
});

var jwtAuth = new jwtStrategy(jwtOpts, function(payload, done) {
  process.nextTick(function() {
    Users.findById(payload.id).then(function(err, user) {
      if (err)
        return done(err, false, {
          message: 'No such user with payload id ' + payload.id
        });
      return done(null, {
        id: user.id,
        name: user.local.name,
        email: user.local.email
      })
    });
  });
});

passport.use('local-login', localAuth);
passport.use('local-signup', localSignup);
passport.use(facebookAuth);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Users.findById(id, function(err, user) {
    if (err) return done(err, null);
    done(null, user);
  });
});

module.exports = exports = passport;
