import ErrorHandler from '../meddilwares/errorHendler.js';
import { catchAsyncError } from '../meddilwares/catchAsyncError.js';
import { User } from '../models/userModels.js';

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
