const router = require('express').Router();

const postController = require('../controllers/post.controller');

router.get('/', postController.findAllPost);
router.post('/create', postController.createPost);
router.put('/:post_id', postController.updatePost);
router.delete('/:post_id', postController.deletePost);
router.get('/:post_id', postController.findOnePost);
router.get('/vote/:post_id', postController.getPostVote);

router.post('/:post_id/:vote_type', postController.createPostVote);
router.delete('/:post_id/:vote_type', postController.deletePostVote);

module.exports = router;
