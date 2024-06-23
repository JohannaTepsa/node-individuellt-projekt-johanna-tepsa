import Datastore from 'nedb-promises';
import { getMenuItemById } from './menu.js';
import { v4 as uuidv4 } from 'uuid';

const cartDb = new Datastore({ filename: './databases/cart.db', autoload: true });

const createCart = async (userId, sessionId) => {
  const newCart = {
    items: [],
    userId: userId || null,
    sessionId: sessionId || uuidv4(),
  };
  const cart = await cartDb.insert(newCart);
  return cart;
};

const findCart = async (userId, sessionId) => {
  try {
    let cart;
    if (userId) {
      cart = await cartDb.findOne({ userId });
      if (cart) {
        return cart;
      }
    }
    cart = await cartDb.findOne({ sessionId });
    return cart;
  } catch (error) {
    console.error('Error finding cart:', error);
    throw new Error(`Failed to find cart: ${error.message}`);
  }
};

const findCartItem = async (cartId, itemId) => {
  try {
    const cart = await cartDb.findOne({ _id: cartId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find(item => item.id === itemId);
    return item;
  } catch (error) {
    console.error('Error finding cart item:', error);
    throw new Error(`Failed to find cart item: ${error.message}`);
  }
};

const updateCart = async (cartId, items) => {
  try {
    const cart = await cartDb.findOne({ _id: cartId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const updatedItems = [...cart.items]; // Creating a copy of existing items

    for (const newItem of items) {
      const menuItem = await getMenuItemById(newItem.id);
      if (!menuItem) {
        throw new Error(`Item with ID ${newItem.id} is not on the menu`);
      }

      // Check if item already exists in the cart
      const existingItemIndex = updatedItems.findIndex(item => item.id === newItem.id);

      if (existingItemIndex !== -1) {
        // Item already exists in cart, update quantity
        updatedItems[existingItemIndex].quantity += newItem.quantity;
      } else {
        // Item doesn't exist in cart, add item
        updatedItems.push({
          id: newItem.id,
          quantity: newItem.quantity
        });
      }
    }

    const updatedCart = await cartDb.update(
      { _id: cartId },
      { $set: { items: updatedItems } },
      { returnUpdatedDocs: true }
    );

    return updatedCart;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw new Error(`Failed to update cart: ${error.message}`);
  }
};

const clearCart = async (cartId) => {
  const clearedCart = await cartDb.update(
    { _id: cartId },
    { $set: { items: [] } },
    { returnUpdatedDocs: true }
  );
  return { cart: clearedCart, message: "Cart has been cleared." };
};

const deleteItemFromCart = async (cartId, itemId) => {
  const cart = await cartDb.findOne({ _id: cartId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const updatedItems = cart.items.filter(item => item.id !== itemId);
  const updatedCart = await cartDb.update(
    { _id: cartId },
    { $set: { items: updatedItems } },
    { returnUpdatedDocs: true }
  );
  return updatedCart;
};

export { createCart, findCart, findCartItem, updateCart, clearCart, deleteItemFromCart };