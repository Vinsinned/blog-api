var express = require('express');
var router = express.Router();

var controller = require('../controllers/accessController.js'); 
var editcontroller = require('../controllers/editController.js'); 

/* GET posts listing. */
router.get('/', controller.posts_list);

router.get('/create', editcontroller.post_create_get);

router.post('/create', editcontroller.post_create_post);

/* GET comment details. */
router.get('/:id/comments', function(req, res, next) {
  res.send('See all comments');
});

/* GET comment form. */
router.get('/:id/comments/create', controller.comment_create_get);

/* POST comment form. */
router.post('/:id/comments/create', controller.comment_create_post);

/* GET post detail. */
router.get('/:id', controller.post_detail);

module.exports = router;