import mongoose from 'mongoose';

export const dbConnect = () => {
	mongoose
		.connect(process.env.MONGOOSE_DB_URL, {
			dbName: 'AppifyLab',
		})
		.then(() => {
			console.log('Connected to database.');
		})
		.catch((err) => {
			console.log(err);
		});
};
