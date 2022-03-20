var express = require('express');
var router = express.Router();

var controller = require('../controllers/accessController.js'); 

/* GET posts listing. */
router.get('/', controller.posts_list);

/* GET comment details. */
router.get('/:id/detail/:commentid', controller.comment_detail);

/* GET comment form. */
router.get('/:id/comments/create', controller.comment_create_get);

/* POST comment form. */
router.post('/:id/comments/create', controller.comment_create_post);

/* GET post detail. */
router.get('/:id', controller.post_detail);

module.exports = router;