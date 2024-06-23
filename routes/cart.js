// File: routes/cart.js

import { Router } from 'express';
import { updateCart, clearCart, deleteItemFromCart } from '../services/cart.js';
import { validateCartOperation, validateCartItem } from '../middlewares/validate.js';

const router = Router();

router.get('/', validateCartOperation, async (req, res) => {
  try {
    res.status(200).json(req.cart);
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
});

router.post('/add', validateCartOperation, validateCartItem, async (req, res) => {
  try {
    const { items } = req.body;
    const updatedCart = await updateCart(req.cart._id, items);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error adding items to cart:', error);
    res.status(500).json({ error: 'Failed to add items to cart' });
  }
});

router.post('/clear', validateCartOperation, async (req, res) => {
  try {
    const clearedCart = await clearCart(req.cart._id);
    res.status(200).json({ cart: clearedCart.cart, message: clearedCart.message });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

router.delete('/item/:id', validateCartOperation, async (req, res) => {
  const itemId = parseInt(req.params.id, 10); 

  try {
    const updatedCart = await deleteItemFromCart(req.cart._id, itemId);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    res.status(500).json({ error: 'Failed to delete item from cart' });
  }
});

export default router;