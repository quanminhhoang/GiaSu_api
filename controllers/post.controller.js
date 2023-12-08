const db = require('../models/index');
const { QueryTypes } = require('sequelize');


const createPost = async (req, res) => {
	const { post_title, post_content, user_id } = req.body;

	try {
		const post = await db.Post.create({
			post_title: post_title,
			post_content: post_content,
			user_id: user_id,
		});
		return res.status(201).json(post);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};

const updatePost = async (req, res) => {
	const { post_content } = req.body;
	const { post_id } = req.params;

	try {
		await db.Post.findOne({
			where: {
				post_id,
			},
			attributes: ['post_content'],
		}).then((post) => {
			if (post) {
				db.Post.update({ post_content: post_content }, { where: { post_id } });
				res.status(200).json({
					post: post.post_content,
					updatedPost: post_content,
				});
			} else {
				res.status(404).json({ message: 'No post found with this id' });
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};

const deletePost = async (req, res) => {
	const { post_id } = req.params;

	try {
		await db.Post.findOne({
			where: {
				post_id,
			},

			attributes: ['post_title', 'post_content', 'user_id'],
		}).then((post) => {
			if (post) {
				db.Post.destroy({
					where: { post_id },
				});

				res.status(200).json({
					deletedPost: post,
				});
			} else {
				res.status(404).json({ message: 'No post found with this id' });
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};

const findAllPost = async (req, res) => {
	try {
		const postData = await db.Post.findAll({
			attributes: ['post_id', 'post_title', 'post_content', 'createdAt', 'updatedAt'],
			include: [
				{
					model: db.User,
					attributes: ['name', 'id'],
				},
			],
			order: [['createdAt', 'DESC']],
		});

		if (postData) {
			res.status(200).json(postData);
		} else {
			res.status(404).json({ message: 'No post found' });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const findOnePost = async (req, res) => {
	console.log('findOnePost function executed')
	try {
		const { post_id } = req.params;

		const postData = await db.sequelize.query(
			`SELECT 
			posts.*, 
			users.id AS user_id, 
			users.name, 
			COALESCE(likeTable.likeCount, 0) AS likeCount, 
			COALESCE(dislikeTable.dislikeCount, 0) AS dislikeCount
		  FROM 
			posts
		  JOIN 
			users ON posts.user_id = users.id
		  LEFT JOIN (
			  SELECT 
				post_id, 
				COUNT(*) as likeCount
			  FROM 
				votes
			  WHERE 
				post_id = ${post_id} AND vote_type = 'like'
			  GROUP BY 
				post_id
		  ) AS likeTable ON likeTable.post_id = posts.post_id
		  LEFT JOIN (
			  SELECT 
				post_id, 
				COUNT(*) as dislikeCount
			  FROM 
				votes
			  WHERE 
				post_id = ${post_id} AND vote_type = 'dislike'
			  GROUP BY 
				post_id
		  ) AS dislikeTable ON dislikeTable.post_id = posts.post_id
		  WHERE posts.post_id = ${post_id};`,
			{type: QueryTypes.SELECT}
		)

		// const postData = await db.Post.findOne({
		// 	where: { post_id },
		// 	attributes: ['post_title', 'post_content', 'createdAt'],
		// 	include: [
		// 		{
		// 			model: db.User,
		// 			attributes: ['name', 'id'],
		// 		},
		// 		{
		// 			model: db.Vote,
		// 			attributes: [
		// 				[
		// 					db.sequelize.fn(
		// 						'COUNT',
		// 						db.sequelize.literal(
		// 							'CASE WHEN Votes.vote_type = "like" THEN 1 END'
		// 						)
		// 					),
		// 					'likeCount',
		// 				],
		// 				// [
		// 				// 	db.sequelize.fn(
		// 				// 		'COUNT',
		// 				// 		db.sequelize.literal(
		// 				// 				'CASE WHEN Votes.vote_type = "dislike" THEN 1 END'
		// 				// 			)
		// 				// 		),
		// 				// 	'dislikeCount',
		// 				// ],
		// 			],
					
		// 		},
		// 	],
		// 	group: ['Post.post_id']
		// });

		if (!postData) {
			return res.status(404).json({ message: 'No post found with this id' });
		}

		const commentData = await db.sequelize.query(
			`SELECT comments.*, COALESCE(likeCounts.likeCount, 0) AS likeCount
			FROM comments
			LEFT JOIN (
				SELECT comments.comment_id, COUNT(*) AS likeCount
				FROM comments
				LEFT JOIN votes ON votes.comment_id = comments.comment_id
				WHERE votes.vote_type = 'like'
				GROUP BY comments.comment_id
			) AS likeCounts ON comments.comment_id = likeCounts.comment_id
			WHERE comments.post_id = ${post_id};`,
			{type: QueryTypes.SELECT}
		)

		// const commentData = await db.Comment.findAll({
		// 	where: { post_id },
		// 	group: ['comment_id'],
		// 	order: [['createdAt', 'DESC']],
		// 	attributes: ['comment_content', 'createdAt', 'comment_id'],
		// 	include: [
		// 		{
		// 			model: db.User,
		// 			attributes: ['name', 'id'],
		// 		},
		// 		{
		// 			model: db.Vote,
		// 			group: ['vote_type'],
		// 			attributes: [
		// 				[
		// 					db.sequelize.fn(
		// 						'count',
		// 						db.sequelize.literal(
		// 							'CASE WHEN Votes.vote_type = "like" THEN 1 END'
		// 						)
		// 					),
		// 					'likeCount',
		// 				],
		// 				[
		// 					db.sequelize.fn(
		// 						'count',
		// 						db.sequelize.literal(
		// 							'CASE WHEN Votes.vote_type = "dislike" THEN 1 END'
		// 						)
		// 					),
		// 					'dislikeCount',
		// 				],
		// 			],
		// 		},
		// 	],
		// });

		res.status(200).json({
			postData: postData,
			commentData: commentData,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

/**
 * Dang lam do
 * Trending Score = TotalVoteCount( like and dislike ) * DecayFactor
 * DecayFactor ( Sau mot khoang thoi gian post het trend ) =  e^( -λ * DaysOld )
 * Cho λ = ln(1 - day decay rate) , day dacay rate = ? 2% => TrendingScore = TotalVoteCount * 0.9403
 */
const getTrendingPosts = async (req, res) => {
	try {
		const postData = await db.Post.findAll({
			where: {},
			attributes: ['post_title', 'post_content', 'createdAt'],
			include: [
				{
					model: db.User,
					attributes: ['name', 'id'],
				},
				{
					model: db.Vote,
					attributes: [
						[
							db.sequelize.fn(
								'COUNT',
								db.sequelize.literal(
									'CASE WHEN Votes.vote_type = "like" THEN 1 END'
								)
							),
							'likeCount',
						],
						[
							db.sequelize.fn(
								'COUNT',
								db.sequelize.literal(
									'CASE WHEN Votes.vote_type = "dislike" THEN 1 END'
								)
							),
							'dislikeCount',
						],
					],
				},
			],
		});

		if (!postData) {
			return res.status(404).json({ message: 'No post found with this id' });
		}
	} catch (error) {
		console.log(error);
	}
};

const createPostVote = async (req, res) => {
	try {
		const { post_id, vote_type } = req.params;
		const { user_id } = req.body;
		const comment_id = null;

		const Vote = await db.Vote.findOne({
			where: {
				post_id,
				user_id,
			},

			attributes: ['vote_type'],
		});

		if (Vote) {
			if (Vote.vote_type == vote_type) {
				await db.Vote.destroy({ where: { post_id } });

				res.status(200).json({
					message: 'deleted',
					post_id: post_id,
					vote: Vote.vote_type
				});
			} else {
				await db.Vote.update({ vote_type: vote_type }, { where: { post_id } });

				res.status(200).json({
					originalVote: Vote.vote_type,
					updatedVote: vote_type,
					message: 'updated'
				});
			}
		} else {
			await db.Vote.create({
				vote_type: vote_type,
				post_id: post_id,
				user_id: user_id,
				comment_id: comment_id,
			});

			res.status(200).json({
				vote: vote_type,
				post_id: post_id,
				message: 'created'
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

const getPostVote = async (req, res) => {
	try {
		const { post_id } = req.params;
		console.log(post_id)

		await db.Vote.findAndCountAll({
			where: {
				post_id,
			},
			attributes: ['vote_type', 'count'],

			group: ['vote_type'],
		}).then((vote) => {
			if (vote) {
				res.status(200).json(vote.count);
			} else {
				res.status(404).json({ message: 'No vote found with this post' });
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

const deletePostVote = async (req, res) => {
	try {
		const { post_id, user_id } = req.body;

		const Vote = await db.Vote.findOne({
			where: {
				user_id,
				post_id,
			},
			attributes: ['vote_id'],
		});

		if (Vote) {
			await db.Vote.destroy({
				where: { vote_id: Vote.vote_id },
			});

			res.status(200).json({
				message: 'Vote deleted',
				vote_id: Vote.vote_id,
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
	createPost,
	updatePost,
	deletePost,
	findAllPost,
	findOnePost,
	getPostVote,
	deletePostVote,
	createPostVote,
	getTrendingPosts,
};
