var express = require('express');
var router = express.Router();

var editcontroller = require('../controllers/editController.js');

router.get('/create', editcontroller.post_create_get);

router.post('/create', editcontroller.post_create_post);

router.get('/:id/delete', editcontroller.post_delete_get);

router.post('/:id/delete', editcontroller.post_delete_post);

router.get('/:id/update', editcontroller.post_update_get);

router.post('/:id/update', editcontroller.post_update_post);

router.get('/:id/delete/:commentid', editcontroller.comment_delete_get);

router.post('/:id/delete/:commentid', editcontroller.comment_delete_post);

router.get('/:id/update/:commentid', editcontroller.comment_update_get);

router.post('/:id/update/:commentid', editcontroller.comment_update_post);

module.exports = router;
