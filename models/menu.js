import Joi from 'joi';

const menuItemSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required(),
  desc: Joi.string().required(),
  price: Joi.number().required()
});

const menuSchema = Joi.array().items(menuItemSchema);

const newMenuItemSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required(),
  desc: Joi.string().required(),
  price: Joi.number().min(0).required(),
});

const modifyMenuItemSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required(),
  desc: Joi.string().required(),
  price: Joi.number().min(0).required(),
});

export { menuItemSchema, menuSchema,newMenuItemSchema, modifyMenuItemSchema };