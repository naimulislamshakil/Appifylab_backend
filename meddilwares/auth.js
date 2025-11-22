import { catchAsyncError } from './catchAsyncError.js';
import jwt from 'jsonwebtoken';
import ErrorHandler from './errorHendler.js';
import { User } from '../models/userModels.js';

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
	const { token } = req.cookies;
	if (!token) {
		return next(new ErrorHandler('User is not authenticated', 400));
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	req.user = await User.findById(decoded.id).populate('post');

	next();
});
