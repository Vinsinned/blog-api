var Comment = require('../models/comments')
var Post = require('../models/posts')
var async = require('async')

const { body, validationResult } = require("express-validator");

// Display post update form on GET.
exports.post_update_get = function (req, res, next) {

  Post.findById(req.params.id, function (err, post) {
    if (err) { return next(err); }
    if (post == null) { // No results.
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
    }
    // Success.
    res.render('post_form', { title: 'Update Post', post: post });
  });

};

// Handle Post update on POST.
exports.post_update_post = [
  body('title').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.'),
  body('text').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.'),
    
  (req, res, next) => { 

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render('post_form', { title: 'Update Author', post: Post.findById(req.params.id), errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid. Update the record.
      Post.findByIdAndUpdate(req.params.id, {'title': req.body.title, 'text': req.body.text}, function (err, thepost) {
        if (err) { return next(err); }
        // Successful - redirect to genre detail page.
        res.redirect(thepost.url);
      });
    }

  }

];
