var path            = require('path'),
    bookGenrePlugin = require(path.resolve(__dirname, '../plugins/booksPlugin')),
    baseRepo        = require(path.join(__dirname, './RepoBase')),
    Extend          = require(path.resolve(__dirname, '../utils/Extend.js'));

 
var booksModel = function(mongoose) {
    var nameMatch = function(val){
        if(!val.trim())
            return false;
        return true;
    };

    var bookSchema = new mongoose.Schema({
        name      : { type: String, required: true, validate: nameMatch },
        author    : { type: String, required: true},
        published : { type: Date, default: Date.now },
        genre     : { type: String, default: 'Unknown' },
        picture   : { type: String, default: 'http://i.istockimg.com/file_thumbview_approve/50018186/3/stock-illustration-50018186-open-book-vector-icon.jpg' }
    });
    
    // Validation ruled after schema defenition
    bookSchema.path('author').validate( function(author){
        if(!author || author.trim().length < 2) 
            return false;
        return true;
    });
    
    // Creating a Plugin to add 'genre' fiels to bookShema
    bookSchema.plugin(bookGenrePlugin);
    var Book = mongoose.model('Book', bookSchema);
    
    return Book;
}


var booksRepository = (function(_baseRepo) {
    
    Extend(booksRepository, _baseRepo);
    
    function booksRepository(model) {
            _baseRepo.call(this, model);
    }

    booksRepository.prototype.getByGenre = function(genre, cb) {
        this.model.find( {genre: genre}, ' -__v', function(err, items) {
            if(err) 
                return cb(err, null);
            return cb(null, items);
        })
    };
    
    return booksRepository;
}(baseRepo));

module.exports.booksModel = booksModel;
module.exports.booksRepository = booksRepository;