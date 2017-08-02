var supertest    = require('supertest'),
  should         = require('should'),
  app            = require('../app.js'),
  agent          = supertest.agent(app)
  , mongoose       = require('mongoose'),
  Book           = mongoose.model('Book'),
  bookController = require('../Controllers/BookController.js');


describe('BookCtrl : ', function() {
  it('should create new book and return 201', function(done) {

    var bookPost = {
      name: 'Test book using supertest',
      author: 'SuperTest agent',
      genre: 'Test genre'
    };
    
    var repository = function(model) {
      this.model = model;
      var self = this;
      return {
        getById: function(id, cb) {
          return cb(Object.assign({}, self.model));
        }
      }
    };
    
    agent.post('/api/books')
      .send(repository(bookPost).getById(1, function(book) {
        return JSON.stringify(book);
      }))
      .expect(201)
      .end(function(err, results) {
        if (err) return console.error(err);
        results.body.should.have.property('_id');
        results.body.should.have.property('name', 'Test book using supertest');
        results.body.should.have.property('genre', 'Test genre');
        done();
      });
  });

  afterEach(function(done) {
    Book.remove({}).exec();
    done();
  });
});
