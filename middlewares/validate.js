import { findCart, createCart } from '../services/cart.js';
import { getMenuItemById, getMenuItemByIdAndTitle, menuDb } from '../services/menu.js';
import { newAdminSchema, adminSchema } from '../models/admins.js';
import { newMenuItemSchema, modifyMenuItemSchema } from '../models/menu.js';
import { campaignSchema } from '../models/campaigns.js';

const validateNewUser = (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  next();
};

const validateUser = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  next();
};

const validateCartItem = async (req, res, next) => {
  const { items } = req.body;

  try {
    for (const item of items) {
      const menuItem = await getMenuItemById(item.id);
      if (!menuItem) {
        return res.status(400).json({ error: `Item with ID ${item.id} is not on the menu` });
      }
    }

    next();
  } catch (error) {
    console.error('Error validating cart item:', error);
    res.status(500).json({ error: 'Failed to validate cart item' });
  }
};

const validateCartOperation = async (req, res, next) => {
  const userId = global.use ? global.use.userId : null;
  const sessionId = req.sessionID;

  try {
    let cart = await findCart(userId, sessionId);

    if (!cart) {
      cart = await createCart(userId, sessionId);
    }

    req.cart = cart;
    next();
		
  } catch (error) {
    console.error('Error validating cart operation:', error);
    res.status(500).json({ error: 'Failed to validate cart operation' });
  }
};

const validateOrder = (req, res, next) => {
  const { address, email } = req.body;

  if (!address || !email) {
    return res.status(400).json({ error: '"address" and "email" are required' });
  }

  const loggedInUser = global.use;
  if (loggedInUser) {
    if (email && loggedInUser.email !== email) {
      return res.status(403).json({ error: 'Email does not match logged-in user' });
    }
  }

  next();
};

const validateNewAdmin = (req, res, next) => {
  const { username, password, email } = req.body;
  const { error } = newAdminSchema.validate({ username, password, email });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const validateAdmin = (req, res, next) => {
  const { username, password } = req.body;
  const { error } = adminSchema.validate({ username, password });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const validateAdminSession = (req, res, next) => {
  const loggedInAdmin = global.admin;

  if (!loggedInAdmin) {
    return res.status(403).json({ error: 'Unauthorized access: Admin session required' });
  }

  next();
};

const validateNewMenuItem = async (req, res, next) => {
  const { id, title, desc, price } = req.body;

  // Validate the request body against Joi schema
  const { error } = newMenuItemSchema.validate({ id, title, desc, price });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check if an admin is logged in
  const loggedInAdmin = global.admin;
  if (!loggedInAdmin) {
    return res.status(403).json({ error: 'Unauthorized access: Admin session required' });
  }

  try {
    // Check if a menu item with the same ID exists
    const existingMenuItem = await menuDb.findOne({ id });
    if (existingMenuItem) {
      return res.status(400).json({ error: 'A menu item with the same ID and Title already exists' });
    }

    // Add the new menu item with createdAt timestamp
    const createdAt = new Date().toISOString();
    await menuDb.insert({ id, title, desc, price, createdAt });

    res.status(201).json({ id, title, desc, price, createdAt });
  } catch (error) {
    console.error('Error validating new menu item:', error);
    res.status(500).json({ error: 'Failed to validate new menu item' });
  }
};

const validateModifyMenuItem = async (req, res, next) => {
  const { id, title, desc, price } = req.body;

  // Validate the request body against Joi schema
  const { error } = modifyMenuItemSchema.validate({ id, title, desc, price });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check if an admin is logged in
  const loggedInAdmin = global.admin;
  if (!loggedInAdmin) {
    return res.status(403).json({ error: 'Unauthorized access: Admin session required' });
  }

  try {
    // Check if the menu item with the given ID exists
    const existingMenuItem = await getMenuItemById(id);
    if (!existingMenuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Update the menu item with modifiedAt timestamp
    const modifiedAt = new Date().toISOString();
    await menuDb.update({ id }, { $set: { title, desc, price, modifiedAt } });

    res.status(200).json({ title, desc, price, modifiedAt });
  } catch (error) {
    console.error('Error modifying menu item:', error);
    res.status(500).json({ error: 'Failed to modify menu item' });
  }
};

const validateDeleteMenuItem = async (req, res, next) => {
  const { id } = req.params;
  console.log('Deleting menu item with ID:', id);

  // Validate ID
  if (!id) {
    return res.status(400).json({ error: 'Menu item ID is required' });
  }

  try {
    // Check if the menu item exists
    const existingMenuItem = await getMenuItemById(id);
    console.log('Existing menu item:', existingMenuItem);

    if (!existingMenuItem) {
      console.log(`Menu item with ID ${id} not found in the database.`);
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Check if an admin is logged in
    const loggedInAdmin = global.admin;
    if (!loggedInAdmin) {
      return res.status(403).json({ error: 'Unauthorized access: Admin session required' });
    }

    next();
  } catch (error) {
    console.error('Error validating delete menu item:', error);
    res.status(500).json({ error: 'Failed to validate delete menu item' });
  }
};

const validateNewCampaign = async (req, res, next) => {
  const { name, items, promotionalPrice } = req.body;

  // Validate request body against campaign schema
  const { error } = campaignSchema.validate({ name, items, promotionalPrice });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Check if an admin is logged in
    const loggedInAdmin = global.admin;
    if (!loggedInAdmin) {
      return res.status(403).json({ error: 'Unauthorized access: Admin session required' });
    }

    // Validate each item in the campaign
    for (const item of items) {
      const menuItem = await getMenuItemById(item.id);
      if (!menuItem) {
        return res.status(400).json({ error: `Item with ID ${item.id} is not on the menu` });
      }
    }

    next();
  } catch (error) {
    console.error('Error validating campaign item:', error);
    res.status(500).json({ error: 'Failed to validate campaign item' });
  }
};

export { 
  validateNewUser, 
  validateUser, 
  validateOrder, 
  validateCartItem, 
  validateCartOperation, 
  validateNewAdmin, 
  validateAdmin, 
  validateAdminSession,
  validateNewMenuItem,
  validateModifyMenuItem,
	validateDeleteMenuItem,
	validateNewCampaign
};
