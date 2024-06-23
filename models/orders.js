import Joi from 'joi';

const orderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      quantity: Joi.number().required()
    })
  ).required(),
  userId: Joi.string().optional(),
  status: Joi.string().valid('pending', 'completed', 'cancelled').default('pending'),
  address: Joi.string().required(),
  email: Joi.string().email().required()
});

export { orderSchema };