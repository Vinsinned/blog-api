var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    name: {type: String, required: true},
    text: {type: String, required: true},
    timestamp: { type: Date },
    post: { type: Schema.ObjectId, ref: 'Post', required: true }
});

// Virtual for this book instance URL.
commentSchema
.virtual('url')
.get(function () {
  return '/'+this._id;
});

// Export model.
module.exports = mongoose.model('Comment', commentSchema);