import userSchema from '../models/userModel.js';

const validate = (req, res, next) => {
  // Validate the request body against userSchema
  const { error } = userSchema.validate(req.body, {
    allowUnknown: true, // Allow unknown fields (such as username for guests)
    stripUnknown: true,  // Remove unknown fields from req.body
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

export default validate;
