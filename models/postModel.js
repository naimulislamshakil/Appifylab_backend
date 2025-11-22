import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
	{
		text: String,
		postStatus: Boolean,
		image: String,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		like: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		comment: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				comment: String,
			},
		],
	},
	{
		timestamps: true,
	}
);

export const Post = mongoose.model('Post', postSchema);
