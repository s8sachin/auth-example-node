const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

const { JWT_SECRET } = process.env;
const UsersController = {};

UsersController.getProfile = async (req, res) => {
	const { user: { _id } } = req;
	try {
		const user = await User.findOne({ _id });
		res.json({
			email: user.email,
			_id,
			name: user.name,
			createdAt: user.createdAt,
			country: user.country,
		});
	} catch (er) {
		next(er);
	}
};

UsersController.signUp = async (req, res, next) => {
	const userObj = req.body;
	try {
		const user = await User.findOne({ email: userObj.email });
		if (!user) {
			await User.create({ ...userObj });
			res.status(201).json({ message: 'Signup Successful' });
		} else {
			res.status(400).json({
				key: 'userPresent',
				message: 'This email is already in use. Try another or continue to Sign In',
			});
		}
	} catch (e) {
		next(e);
	}
};

UsersController.login = (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {
		try {
			if (err) {
				const error = new Error('An Error occured');
				return next(error);
			}
			req.login(user, { session: false }, async (error) => {
				if (info.status !== 200) {
					return res.status(info.status || 400).json(info);
				}
				//We don't want to store the sensitive information such as the
				//user password in the token so we pick only the email and id
				const body = { _id: user._id, email: user.email };
				//Sign the JWT token and populate the payload with the user email and id
				const token = jwt.sign({ user: body }, JWT_SECRET);
				//Send back the token to the user
				res.status(200).json({
					token,
					user: {
						email: user.email,
						name: user.name,
						_id: user._id,
						createdAt: user.createdAt,
					},
					...info,
				});
			});
		} catch (error) {
			// res.json({ token, user: { email: user.email, name: user.name } });
			return next(error);
		}
	})(req, res, next);
};

module.exports = UsersController;