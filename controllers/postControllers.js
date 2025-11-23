import ErrorHandler from '../meddilwares/errorHendler.js';
import { catchAsyncError } from '../meddilwares/catchAsyncError.js';
import { User } from '../models/userModels.js';
import { Post } from '../models/postModel.js';

export const addPost = catchAsyncError(async (req, res, next) => {
	try {
		const { text, postStatus, image } = req.body;
		const { _id } = req.user;

		if (!text || !postStatus || !image) {
			return next(new ErrorHandler('All field is required.', 400));
		}

		const post = await Post.create({ text, postStatus, image });
		const updatePost = await Post.findByIdAndUpdate(post._id, {
			$push: {
				user: _id,
			},
		});
		const user = await User.findByIdAndUpdate(_id, {
			$push: {
				post: post._id,
			},
		});

		res.status(200).json({
			success: true,
			message: 'Post create successfully.',
		});
	} catch (error) {
		next(new ErrorHandler('Post not Create', 400));
	}
});

export const getAllPost = catchAsyncError(async (req, res, next) => {
	const post = await Post.find()
		.populate('user')
		.populate('like')
		.populate('comment.user', 'firstName lastName')
		.sort({ createdAt: -1 });

	res.status(200).json({
		status: true,
		post,
	});
});

export const addLoveOrUnlike = catchAsyncError(async (req, res, next) => {
	try {
		const { id } = req.body;
		const userId = req.user._id;

		if (!id) return next(new ErrorHandler('Select a post.', 400));

		const post = await Post.findById(id);
		if (!post) return next(new ErrorHandler('Post not found.', 404));

		const hasLiked = post.like.some(
			(likeId) => likeId.toString() === userId.toString()
		);

		if (!hasLiked) {
			post.like.push(userId);
			await post.save();

			return res.status(200).json({
				success: true,
				message: 'You loved this post.',
				liked: true,
				likeCount: post.like.length ? post.like.length : 0,
			});
		} else {
			post.like = post.like.filter(
				(likeId) => likeId.toString() !== userId.toString()
			);
			await post.save();

			return res.status(200).json({
				success: true,
				message: 'You unliked this post.',
				liked: false,
				likeCount: post.like.length ? post.like.length : 0,
			});
		}
	} catch (error) {
		next(error);
	}
});

export const addComment = catchAsyncError(async (req, res, next) => {
	try {
		const { postId, comment } = req.body;
		const userId = req.user._id;

		if (!postId || !comment) {
			return next(new ErrorHandler('Select a post.', 400));
		}

		const post = await Post.findById(postId);
		if (!post) {
			return next(new ErrorHandler('Post not found', 400));
		}

		post.comment.push({ user: userId, comment });

		await post.save();

		return res.status(200).json({
			success: true,
			message: 'Comment added successfully',
		});
	} catch (error) {
		next(error);
	}
});
