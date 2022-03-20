var Comment = require('../models/comments')
var Post = require('../models/posts')
var async = require('async')

const { body, validationResult } = require("express-validator");

// Display list of all posts.
exports.posts_list = function (req, res, next) { 

  Post.find()
	.sort([['timestamp', 'descending']])
	.exec(function (err, list_posts) {
			if (err) { return next(err); }
			// Successful, so render.
			res.render('post_list', { title: 'All Blogs', post_list: list_posts });
	})  

}

// Display detail page for a specific post.
exports.post_detail = function (req, res, next) { 

	async.parallel({
		post: function (callback) {
				Post.findById(req.params.id)
				.exec(callback)
		},
		comments: function (callback) {
				Comment.find({ 'post': req.params.id })
				.exec(callback)
		},
	}, function (err, results) {
		if (err) { return next(err); } // Error in API usage.
		if (results.post == null) { // No results.
				var err = new Error('Post not found');
				err.status = 404;
				return next(err);
		}
		// Successful, so render.
		res.render('post_detail', { title: results.post.title, post: results.post, comments: results.comments, user: req.user });
	});

}

// Display comment create form on GET.
exports.comment_create_get = function (req, res, next) {
    res.render('comment_form', { title: 'Create Comment' });
};

// Handle comment create on POST.
exports.comment_create_post = [ 
	body('name').trim().isLength({ min: 1 }).escape().withMessage('Name must be specified.'),
	body('text').trim().isLength({ min: 1 }).escape().withMessage('Text must be specified.'),

	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		var comment = new Comment(
			{
				name: req.body.name,
				text: req.body.text,
				timestamp: new Date().toISOString(),
				post: req.params.id
			}
		);
		
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render('comment_form', { title: 'Create Comment', comment: comment, errors: errors.array() });
			return;
		}
		else {
			// Data from form is valid.

			// Save author.
			comment.save(function (err) {
				if (err) { return next(err); }
				res.redirect('/posts/' + req.params.id);
			});
		}
	}
]

exports.comment_detail = function (req, res, next) { 

	Comment.findById(req.params.commentid)
	.exec(function (err, result) {
		if (err) { return next(err); } // Error in API usage.
		if (result == null) { // No results.
			var err = new Error('Comment not found');
			err.status = 404;
			return next(err);
		}
		// Successful, so render.
		res.render('comment_detail', { title: result.name, comment: result, user: req.user });
	})

}