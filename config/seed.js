'use strict';

let mongoose = require('mongoose');
let Users = mongoose.model('Users');

module.exports = {
  create: function() {
    Users.findOne({
      'local.name': 'Vovan_Super'
    }).then(function(user) {
      return console.log('User ' + user.local.name + ' already exists');
    }).catch(function(err) {
      if (err) console.log('Creating new user...');
      Users.create({
        'local.name': 'Vovan_Super',
        'local.email': 'vovansuper@mail.ru',
        'local.password': 'ova354'
      }).then(function(user) {
        return console.log('Created a new test user in mongoDb ', user['_id']);
      });
    });
  },
  destroy: function() {
    Users.findOneAndRemove({
      '.local.email': 'vovansuper@mail.ru'
    }).then(function(user) {
      return console.log('Removed ' + user.local.name);
    }).catch(function(err) {
      return console.log('Error removing user ' + err)
    });
  }
};
