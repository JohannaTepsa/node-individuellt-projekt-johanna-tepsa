import Joi from 'joi';

// Define the schema for a new admin
const newAdminSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required()
});

// Define the schema for admin login
const adminSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export { newAdminSchema, adminSchema };