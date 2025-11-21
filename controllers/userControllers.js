import ErrorHandler from '../meddilwares/errorHendler.js';
import { catchAsyncError } from '../meddilwares/catchAsyncError.js';
import { User } from '../models/userModels.js';
import { sendToken } from '../utils/sendToken.js';

export const register = catchAsyncError(async (req, res, next) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		if (!email || !firstName || !lastName || !password) {
			return next(new ErrorHandler('All fields are required.', 400));
		}

		const userExisting = await User.findOne({ email });

		if (userExisting) {
			return next(
				new ErrorHandler('User already register. Please login.', 400)
			);
		}

		const registerationAttemptsByUser = await User.find({ email });

		if (registerationAttemptsByUser.length > 3) {
			return next(
				new ErrorHandler(
					'You have exceeded the maximum number of attempts (3). Please try again after an hour.',
					400
				)
			);
		}

		const userData = { firstName, lastName, email, password };

		const user = await User.create(userData);
		res.status(200).json({
			success: true,
			message: 'User register successfully.',
		});
	} catch (error) {
		next(error);
	}
});

export const login = catchAsyncError(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorHandler('All fields are required.'));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorHandler('Invalid email or password', 400));
	}

	const isPasswordMatch = await user.comparePassword(password);

	if (!isPasswordMatch) {
		return next(new ErrorHandler('Invalid email or password', 400));
	}

	sendToken(user, 200, 'User logged in successfully,', res);
});

export const getUser = catchAsyncError(async (req, res, next) => {
	const user = req.user;
	res.status(200).json({
		success: true,
		user,
	});
});

export const logout = catchAsyncError(async (req, res, next) => {
	res
		.status(200)
		.cookie('token', '', {
			expires: new Date(Date.now()),
			httpOnly: true,
		})
		.json({
			success: true,
			message: 'Logged out successfully.',
		});
});
