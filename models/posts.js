var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: { type: String, required: true },
    author: { type: Schema.ObjectId, ref: 'Author', required: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date },
    published: { type: Boolean, default: false }
});

// Virtual for this book instance URL.
postSchema
.virtual('url')
.get(function () {
  return '/posts/'+this._id;
});

// Export model.
module.exports = mongoose.model('Post', postSchema);