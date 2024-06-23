import moment from 'moment-timezone';
import { getMenuItemById } from './menu.js';
import nedb from 'nedb-promises';

const ordersDb = new nedb({ filename: './databases/orders.db', autoload: true });

const createOrder = async (orderData) => {
  try {
    // Calculate total price on the server side
    let total = 0;
    for (const item of orderData.items) {
      const menuItem = await getMenuItemById(item.id);
      if (menuItem) {
        total += menuItem.price * item.quantity;
      }
    }

    // Add the calculated total to the order data
    orderData.total = total;
    orderData.status = 'pending';
    orderData.createdAt = moment().tz('Europe/Stockholm').format(); // Set timestamp for Stockholm time zone

    // Save the order to the database
    const newOrder = await ordersDb.insert(orderData);
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

const findOrder = async (orderId) => {
  try {
    const order = await ordersDb.findOne({ _id: orderId });
    return order;
  } catch (error) {
    console.error('Error finding order:', error);
    throw new Error('Failed to find order');
  }
};

const findOrdersByUserId = async (userId) => {
  try {
    const orders = await ordersDb.find({ userId: userId });
    return orders;
  } catch (error) {
    console.error('Error finding orders by userId:', error);
    throw new Error('Failed to find orders by userId');
  }
};

export { createOrder, findOrder, findOrdersByUserId };