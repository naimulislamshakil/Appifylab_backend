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
	const post = await Post.find().populate('user').sort({ createdAt: -1 });

	res.status(200).json({
		status: true,
		post,
	});
});

export const addLoveOrUnlike = catchAsyncError(async (req, res, next) => {
	try {
		const { id } = req.body;
		const { _id } = req.user;
		if (!id) return next(new ErrorHandler('Select a post.', 400));

		const post = await Post.findById(id);

		const like = post.like.some((id) => id.toString() === _id.toString());

		if (like === false) {
			const updatePost = await Post.findByIdAndUpdate(id, {
				$push: {
					like: _id,
				},
			});

			return res.status(200).json({
				success: true,
				message: 'You love this post.',
			});
		}

		if (like === true) {
			const updatePost = await Post.findByIdAndUpdate(
				id,
				{
					$pull: {
						like: _id,
					},
				},
				{
					new: true,
				}
			);

			return res.status(200).json({
				success: true,
				message: 'You unlike this post.',
			});
		}
	} catch (error) {}
});
