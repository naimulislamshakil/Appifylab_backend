import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
	{
		firstName: String,
		lastName: String,
		email: String,
		password: String,
		post: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
