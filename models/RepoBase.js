module.exports = exports = (function() {
    function baseRepository(model) {
        this.model = model;
    }
    baseRepository.prototype.getById = function(id, cb) {
        this.model.findById(id, '-__v', function(err, item) {
            if (err) return cb(err, null);
            return cb(null, item);
        });
    }
    baseRepository.prototype.getAll = function(cb) {
        this.model.find({}, '-__v', function(err, items) {
            if (err) return cb(err, null);
            return cb(null, items);
        })
    }
    baseRepository.prototype.saveOrInsert = function(entity, cb) {
        var newItem = new this.model(entity);
        newItem.save(function(err) {
            if (err) return cb(err, null);
            return cb(null, entity);
        });
    }
    baseRepository.prototype.remove = function(entity, cb) {
        this.model.remove({_id: entity['_id']}, function(err) {
            if (err) return cb(err);
            return cb(null);
        })
    }
    return baseRepository;
}());
