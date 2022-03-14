var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
});

// Virtual for this book instance URL.
UserSchema
.virtual('url')
.get(function () {
  return '/posts/'+this._id;
});

// Export model.
module.exports = mongoose.model('User', UserSchema);