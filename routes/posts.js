var express = require('express');
var router = express.Router();

/* GET posts listing. */
router.get('/', function(req, res, next) {
  res.send('See all posts');
});

/* GET comment details. */
router.get('/:id/comments', function(req, res, next) {
  res.send('See all comments');
});

/* GET comment form. */
router.get('/:id/comments/create', function(req, res, next) {
  res.send('See comment form');
});

/* POST comment form. */
router.post('/:id/comments/create', function(req, res, next) {
  res.send('See comment form');
});

/* GET post detail. */
router.get('/:id', function(req, res, next) {
  res.send('See post details');
});

module.exports = router;