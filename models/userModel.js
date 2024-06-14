import Joi from 'joi';

const userSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	password: Joi.string().alphanum().min(6).max(30).required(),
	email: Joi.string().email()
});

export default userSchema;