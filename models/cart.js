// Not in usage atm

import Joi from 'joi';

// Cart Schema for Users
const cartItemSchema = Joi.object({
  id: Joi.number().required(),
  quantity: Joi.number().required(),
});

// Cart Schema for Guests
const cartSchema = Joi.object({
  items: Joi.array().items(cartItemSchema).required(),
  userId: Joi.string().guid({ version: 'uuidv4' }).optional(),
  sessionId: Joi.string().optional(),  // To handle guest sessions
});

export { cartItemSchema, cartSchema };