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
	const post = await Post.find();

	res.status(200).json({
		status: true,
		post,
	});
});
