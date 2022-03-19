var Comment = require('../models/comments')
var Post = require('../models/posts')
var User = require('../models/user')
var async = require('async')

const { body, validationResult } = require("express-validator");

exports.post_create_get = function (req, res, next) {
    res.render('post_form', { title: 'Create Post', user: req.user });
};

exports.post_create_post = [

  // Validate and sanitize fields.
  body('title').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.'),
  body('content').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.'),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    
    // Create Post object with escaped and trimmed data
    var post = new Post(
      {
        title: req.body.title,
        name: req.user.name.toString(),
        author: req.user.id,
        content: req.body.content,
        timestamp: new Date().toISOString(),
        published: false
      }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('post_form', { title: 'Create Post', post: post, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid.

      // Save post.
      post.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to new author record.
        res.redirect(post.url);
      });
    }
  }
];

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
  body('content').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.'),
    
  (req, res, next) => { 

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render('post_form', { title: 'Update Author', post: Post.findById(req.params.id), errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid. Update the record.
      Post.findByIdAndUpdate(req.params.id, {'title': req.body.title, 'content': req.body.text}, function (err, thepost) {
        if (err) { return next(err); }
        // Successful - redirect to genre detail page.
        res.redirect(thepost.url);
      });
    }

  }

];

exports.post_delete_get = function (req, res, next) {

  Post.findById(req.params.id).exec(function (err, result) {
    if (err) { return next(err); }
    if (result == null) { // No results.
      res.redirect('/posts');
    }
    // Successful, so render.
    res.render('post_delete', { title: 'Delete Post', post: result});
    })

};

exports.post_delete_post = function (req, res, next) {

  Post.findById(req.params.id).exec(function (err, result) {
    if (err) { return next(err); }
    // Success.
    Post.findByIdAndRemove(req.body.postid, function deletePost(err) {
      if (err) { return next(err); }
      // Success - go to posts list.
      res.redirect('/posts')
    })
  })

};

exports.comment_delete_get = function (req, res, next) {

  Comment.findById(req.params.id).exec(function (err, result) {
    if (err) { return next(err); }
    if (result == null) { // No results.
      res.redirect('/posts/' + req.params.id);
    }
    // Successful, so render.
    res.render('comment_delete', { title: 'Delete Comment', comment: result});
    })

};

exports.comment_delete_post = function (req, res, next) {

  Comment.findById(req.params.id).exec(function (err, result) {
    if (err) { return next(err); }
    // Success.
    Comment.findByIdAndRemove(req.body.commentid, function deleteComment(err) {
      if (err) { return next(err); }
      // Success - go to posts list.
      res.redirect('/posts/' + req.params.id)
    })
  })

};

exports.comment_update_get = function (req, res, next) {

  Comment.findById(req.params.id, function (err, comment) {
    if (err) { return next(err); }
    if (comment == null) { // No results.
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
    }
    // Success.
    res.render('comment_form', { title: 'Update Comment', comment: comment });
  });

};

exports.comment_update_post = [
  body('name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.'),
  body('text').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.'),
    
  (req, res, next) => { 

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render('post_form', { title: 'Update Comment', comment: Comment.findById(req.params.id), errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid. Update the record.
      Comment.findByIdAndUpdate(req.params.id, {'text': req.body.text, 'name': req.body.name}, function (err, thecomment) {
        if (err) { return next(err); }
        // Successful - redirect to genre detail page.
        res.redirect(thecomment.url);
      });
    }

  }

];

