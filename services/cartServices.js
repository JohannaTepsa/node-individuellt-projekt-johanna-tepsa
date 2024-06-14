import nedb from 'nedb-promises';

const cartDb = new nedb({ filename: "cart.db", autoload: true });
const menuDb = new nedb({ filename: "menu.db", autoload: true });

const addItemToCart = async (identifier, id, quantity, isGuest = false) => {
  const menu = await menuDb.findOne({});
  if (!menu) {
    throw new Error('Menu not found');
  }

  const item = menu.menu.find(item => item.id === id);
  if (!item) {
    throw new Error('Item not found in menu');
  }

  let userCart = await cartDb.findOne({ identifier, isGuest });
  if (!userCart) {
    userCart = { identifier, isGuest, items: [] };
    await cartDb.insert(userCart);
  }

  const cartItem = userCart.items.find(cartItem => cartItem.id === id);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    userCart.items.push({ id, title: item.title, price: item.price, quantity });
  }

  await cartDb.update({ identifier, isGuest }, userCart);
  return userCart;
};

const removeItemFromCart = async (identifier, id, isGuest = false) => {
  let userCart = await cartDb.findOne({ identifier, isGuest });
  if (!userCart) {
    throw new Error('Cart not found');
  }

  const itemIndex = userCart.items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  userCart.items.splice(itemIndex, 1);

  await cartDb.update({ identifier, isGuest }, userCart);
  return userCart;
};

const getUserCart = async (identifier, isGuest = false) => {
  const userCart = await cartDb.findOne({ identifier, isGuest });
  return userCart || { identifier, isGuest, items: [] };
};

export { addItemToCart, removeItemFromCart, getUserCart };