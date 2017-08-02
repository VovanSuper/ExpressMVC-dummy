module.exports = function bookGenrePlugin(schema, options) {
    schema.pre('save', function (next) {
    //this.genre = 'Unknown';
    next();
  });
  
  if (options && options.index) {
    schema.path('genre', String).default('Unknown').index(options.index);
  }
};