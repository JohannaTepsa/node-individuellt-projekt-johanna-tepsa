import { Router } from 'express';
import { addItemToCart, getUserCart, removeItemFromCart } from '../services/cartServices.js';
import validate from '../middlewares/validate.js';

const router = Router();

// Add item to cart
router.post('/add', validate, async (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (!id || !quantity) {
      return res.status(400).json({ error: 'Item ID and quantity are required' });
    }

    const user = global.user; // Check if user is logged in
    const identifier = user ? user.username : null; // Use null for guests

    const updatedCart = await addItemToCart(identifier, id, quantity, !user); // Pass isGuest flag
    res.json(updatedCart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Remove item from cart
router.post('/remove', validate, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    const user = global.user; // Check if user is logged in
    const identifier = user ? user.username : null; // Use null for guests

    const updatedCart = await removeItemFromCart(identifier, id, !user); // Pass isGuest flag
    res.json(updatedCart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Get user's cart
router.get('/', async (req, res) => {
  try {
    const user = global.user; // Check if user is logged in
    const identifier = user ? user.username : null; // Use null for guests

    const userCart = await getUserCart(identifier, !user); // Pass isGuest flag
    res.json(userCart);
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

export default router;