var path = require('path'),
  util = require('util'),
  bcrypt = require('bcrypt'),
  baseRepo = require(path.join(__dirname, './RepoBase')),
  Extend = require(path.resolve(__dirname, '../utils/Extend.js'));

var usersModel = function(mongoose) {
  var userSchema = new mongoose.Schema({
    local: {
      name: { type: String, required: true },
      email: { type: String, unique: true },
      password: { type: String, required: true },
      registered: { type: Date, default: Date.now }
    },
    facebook: {
      id: String,
      token: String,
      name: String,
      email: String
   }
});

  // Validation ruled after schema defenition
  userSchema.path('name').validate(function(name) {
    if (!name || name.trim().length === 0)
      return false;
    return true;
  });

  userSchema.path('password').validate(function(password) {
    if (!password || password.trim().length === 0)
      return false;
    return true;
  });

  userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  });

  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };


  var User = mongoose.model('User', userSchema);

  return User;
};


var usersRepository = (function(_baseRepo) {

  Extend(usersRepository, _baseRepo);

  function usersRepository(model) {
    _baseRepo.call(this, model);
  }

  return usersRepository;
}(baseRepo));

module.exports.usersModel = usersModel;
module.exports.usersRepository = usersRepository;
