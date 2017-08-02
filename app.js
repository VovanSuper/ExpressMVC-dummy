'use strict';

var as = require('async'),
  express = require('express'),
  bodyparser = require('body-parser'),
  conf = require(path.join(__dirname, 'config', 'config.js')),
  newLine = require('os').EOL,
  cors = require('cors'),
  path = require('path'),
  mongoose = require('mongoose'),
  cookieparser = require('cookie-parser'),
  session = require('express-session'),
  redis = require('redis'),
  redisStore = require('connect-redis')(session),
  redisClient = redis.createClient(conf.redis),
  flash = require('connect-flash'),
  toastr = require('express-toastr'),
  passport = require(path.join(__dirname, 'config', 'passport.conf.js')),
  logger = require(path.join(__dirname, 'utils/Logger')),
  reqLogger = require(path.join(__dirname, 'middlewares/baseRequestLogger'))(logger),
  toastrWare = require('./middlewares/toastr'),
  errorWare = require('./middlewares/error'),
  expressValidator = require(path.join(__dirname, 'middlewares', 'expressValidator.js'));

var Book = require(path.join(__dirname, 'models/Books')).booksModel(mongoose),
  User = require(path.join(__dirname, 'models/Users')).usersModel(mongoose),
  BooksRepository = require(path.join(__dirname, 'models/Books')).booksRepository,
  UsersRepository = require(path.join(__dirname, 'models/Users')).usersRepository,
  MongooseConnectionInit = require(path.join(__dirname, 'utils/dbStarter')),
  booksRouter = require(path.join(__dirname, 'routes/BooksRouter'))(BooksRepository, logger, Book),
  mainRouter = require(path.join(__dirname, 'routes/MainRouter'))(logger),
  usersRouter = require(path.join(__dirname, 'routes/UsersRouter'))(UsersRepository, logger, User),
  authRouter = require(path.join(__dirname, 'routes/AuthRouter'))(UsersRepository, logger, User);

redisClient.on('connect', function(con) {
    console.log('Conneted to redisClient on ' + redisClient.connection_id);
  })
  .on('ready', function() {
    console.log('RedisClient is ready...');
  })
  .on('error', function(err) {
    return console.error(err);
  })
  .on('end', function() {
    console.log('Redis client is closed');
  });

mongoose.Promise = require('bluebird');
mongoose.connect(conf.db.connectionString)
  .then(function() {
    console.log(`Conneting to database...`);
  });

var sessionStore;

var getSessionStore = function() {
  if (!sessionStore) {
    sessionStore = new redisStore(Object.assign({}, {
      client: redisClient
    }, conf.redis));
  }
  return sessionStore;
};

if (process.env.ENV === 'test') {
  mongoose.connect('mongodb://localhost:27017/test')
}
else {
  MongooseConnectionInit(mongoose, logger)
}



var app = express();
app.set('port', process.env.PORT || 8080)
  .use(require('serve-favicon')(path.join(__dirname, 'public/favicon.ico')))
  .use(cookieparser())
  .use(bodyparser.json())
  .use(bodyparser.urlencoded({
    extended: false
  }))
  .use(session({
    saveUninitialized: false,
    resave: false,
    secret: conf.sessions.secret,
    key: conf.redis.prefix
      // , cookie: {
      //   httpOnly: true,
      //   expires: 24 * 60 * 1000
      // }
      ,
    store: getSessionStore()
  }))
  .use(cors())
  .use(reqLogger)
  .use(expressValidator)
  .use(passport.initialize())
  .use(passport.session())
  .use(flash())
  .use(toastr())
  .use(toastrWare)
  .use('/api/books', booksRouter)
  .use('/api/users', usersRouter)
  .use('/', mainRouter)
  .use('/auth', authRouter)
  .get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/users',
    failureRedirect: '/auth/login'
  }))
  .use(errorWare);


app.listen(app.get('port'), function() {
  logger.info('Listening on port ', app.get('port'));
});

process.on('SIGINT', function() {
  as.parallel([
    function() {
      redisClient.flushdb(function(err, success) {
          if (err) throw err;
          console.log('Flushing Redis session db...');
          redisClient.quit();
        })
        .on('error', function(err) {
          console.error(err);
        });
    },
    function() {
      if (sessionStore) {
        sessionStore.ids(function(err, keys) {
          if (err) console.error(err);
          keys.forEach(function(id) {
            sessionStore.destroy(id, function() {
              console.log('Detroyed key ' + id + ' in RedisStore');
            });
          });
        });
      }
    },
    function() {
      mongoose.connection.close(function() {
        console.log('Closed mongoose connection');
      });
    }
  ], function(err, res) {
    if (err) {
      console.log('Errors appeared while closing app ', err);
      process.exit(255);
    }
    console.log(res);
    process.exit(0);
  });
});


module.exports = exports = app;
