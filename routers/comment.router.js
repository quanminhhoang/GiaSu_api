const router = require('express').Router();

const commentController = require('../controllers/comment.controller');

router.post('/', commentController.createComment);
router.get('/', commentController.findAllComment);
router.delete('/:comment_id', commentController.deleteComment);
router.put('/:comment_id', commentController.updateComment);

router.post('/:comment_id/:vote_type', commentController.createCommentVote);
router.delete('/:comment_id/:vote_type', commentController.deleteCommentVote);

module.exports = router;
