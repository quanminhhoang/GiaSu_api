const db = require('../models/index');

const createComment = async (req, res) => {
	try {
		const { post_id, comment_content, user_id } = req.body;
		const comment = await db.Comment.create({
			post_id: post_id,
			comment_content: comment_content,
			user_id: user_id,
		});
		return res.status(201).json(comment);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};

const findAllComment = async (req, res) => {
	try {
		const commentData = await db.Comment.findAll({
			attributes: ['comment_content', 'comment_id', 'post_id'],
			include: [
				{
					model: db.User,
					attributes: ['name', 'id'],
				},
			],
		});
		res.json(commentData);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

const updateComment = async (req, res) => {
	try {
		const { comment_content } = req.body;
		const { comment_id } = req.params;

		await db.Comment.findOne({
			where: {
				comment_id,
			},

			attributes: ['comment_content'],
		}).then((comment) => {
			if (comment) {
				db.Comment.update(
					{
						comment_content: comment_content,
					},

					{
						where: { comment_id },
					}
				);
				res.status(200).json({
					originalComment: comment.comment_content,
					updatedComment: comment_content,
				});
			} else {
				res.status(404).json({ message: 'No comment found with this id' });
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};

const deleteComment = async (req, res) => {
	try {
		const { comment_id } = req.params;
		await db.Comment.findOne({
			where: {
				comment_id,
			},
			attributes: ['comment_content', 'user_id'],
		}).then((comment) => {
			if (comment) {
				db.Comment.destroy({
					where: { comment_id },
				});
				res.status(200).json({
					deletedComment: comment,
				});
			} else {
				res.status(404).json({ message: 'No comment found with this id' });
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};

const createCommentVote = async (req, res) => {
	try {
		const { comment_id, vote_type } = req.params;
		const { user_id } = req.body;
		const post_id = null;

		const Vote = await db.Vote.findOne({
			where: { comment_id, user_id },
			attributes: ['vote_type'],
		});

		if (Vote) {
			if (Vote.vote_type == vote_type) {
				await db.Vote.destroy({ where: { comment_id } });

				res.status(200).json({
					message: 'Vote deleted',
					vote_type: vote_type,
					comment_id: comment_id,
				});
			} else {
				await db.Vote.update(
					{ vote_type: vote_type },
					{ where: { comment_id } }
				);

				res.status(200).json({
					originalVote: Vote.vote_type,
					updatedVote: vote_type,
				});
			}
		} else {
			await db.Vote.create({
				vote_type: vote_type,
				comment_id: comment_id,
				user_id: user_id,
				post_id: post_id,
			});

			res.status(200).json({
				vote_type: vote_type,
				comment_id: comment_id,
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

const deleteCommentVote = async (req, res) => {
	try {
		const { comment_id, user_id } = req.body;

		const Vote = await db.Vote.findOne({
			where: {
				comment_id,
				user_id,
			},
		});

		if (Vote) {
			await db.Vote.destroy({
				where: { vote_id: Vote.vote_id },
			});
		} else {
			res.status(404).json({ message: 'No vote found' });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

module.exports = {
	createComment,
	createCommentVote,
	deleteComment,
	deleteCommentVote,
	findAllComment,
	updateComment,
};
