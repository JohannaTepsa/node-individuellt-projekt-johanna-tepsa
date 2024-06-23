import Joi from 'joi';

// Schema for campaign items
const campaignItemSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required()
});

// Campaign Schema
const campaignSchema = Joi.object({
  name: Joi.string().required(),
  items: Joi.array().items(campaignItemSchema).required(),
  promotionalPrice: Joi.number().min(0).required()
});

export { campaignSchema };