import Joi from 'joi';

// New User Schema
const newUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().alphanum().min(6).max(30).required(),
  email: Joi.string().email().required(),
  userId: Joi.string().guid({ version: 'uuidv4' }).optional()
});

// Existing User Schema
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().alphanum().min(6).max(30).required(),
  email: Joi.string().email(),
  userId: Joi.string().guid({ version: 'uuidv4' }).optional()
});

export { newUserSchema, userSchema };