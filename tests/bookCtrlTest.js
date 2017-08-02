var path = require('path'),
    should = require('should'),
    sinon = require('sinon')

var bookCtrl = require(path.resolve(__dirname, '../Controllers/BookController'));

describe('Book Controller: ', function() {
    
    it('should exist', function() {
        bookCtrl.should.exist;
        bookCtrl.should.be.a.Function();
    });
    
    it('should return object /of revealing module pattern/ {post, get, put, delete}', function() {
        var repo, errorHandler, Book
        bookCtrl(repo, errorHandler, Book).should.be.type('object')
        bookCtrl(repo, errorHandler, Book).should.have.keys(['get', 'post', 'put', 'patch', 'delete'])
    })
    
    // describe('POST method: ', function() {
    //     it('should not allow empty name of book', function() {
            
    //         var Book = function(book) { this.save = function() {}  };
    //         var req = {
    //             body: {
    //                 author: "Vovan test writer"
    //             }
    //         };
    //         var resp = {
    //             status : sinon.spy(),
    //             send   : sinon.spy()
    //         };
            
            
    //     })
    // })

})
