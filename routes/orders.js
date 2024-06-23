// File: routes/orders.js

import { Router } from 'express';
import { createOrder, findOrder, findOrdersByUserId } from '../services/orders.js';
import { validateOrder } from '../middlewares/validate.js';
import { findCart, clearCart } from '../services/cart.js';
import moment from 'moment-timezone';

const router = Router();

router.post('/create', validateOrder, async (req, res) => {
  try {
    console.log('Order creation started');
    const userId = global.use ? global.use.userId : null;
    const sessionId = req.sessionID;
    console.log('User ID:', userId, 'Session ID:', sessionId);

    const cart = await findCart(userId, sessionId);
    console.log('Cart found:', cart);

    if (!cart || cart.items.length === 0) {
      console.log('Cart is empty');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderItems = cart.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    const orderData = {
      items: orderItems,
      userId: userId,
      address: req.body.address,
      email: req.body.email
    };
    console.log('Order Data:', orderData);

    const newOrder = await createOrder(orderData);
    console.log('Order created:', newOrder);

    await clearCart(cart._id);
    console.log('Cart cleared');

    const deliveryMessage = "Delivery in 20 minutes";

    res.status(201).json({ 
      success: true, 
      order: newOrder, 
      deliveryMessage: deliveryMessage 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Route to fetch order history for a user
router.get('/history', async (req, res) => {
  try {
    const loggedInUser = global.use;
    if (!loggedInUser) {
      return res.status(401).json({ error: 'Unauthorized: User must be logged in' });
    }

    const orders = await findOrdersByUserId(loggedInUser.userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

router.get('/:orderId', async (req, res) => {
  try {
    const order = await findOrder(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error finding order:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// New route for order confirmation
router.get('/:orderId/confirmation', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await findOrder(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const now = moment().tz('Europe/Stockholm');
    const createdAt = moment(order.createdAt).tz('Europe/Stockholm');
    const deliveryTime = createdAt.add(20, 'minutes');
    const timeRemaining = deliveryTime.diff(now, 'minutes');

    if (timeRemaining <= 0) {
      return res.json({
        orderId: order._id,
        status: 'delivered',
        timeRemaining: 0
      });
    } else {
      return res.json({
        orderId: order._id,
        status: order.status,
        timeRemaining: timeRemaining
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;