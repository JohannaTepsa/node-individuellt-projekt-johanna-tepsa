import nedb from 'nedb-promises';
import { v4 as uuidv4 } from 'uuid';

const userDb = new nedb({ filename: './databases/users.db', autoload: true });

// Create a User
const createUser = async (user) => {
	user.userId = uuidv4();  // Generates a unique ID
	const newUser = await userDb.insert(user);
	return newUser;
}

// Find a User
const findUser = async (username) => {
	const user = await userDb.findOne({ username : username });
	return user;
}

const getOrderHistory = async (userId) => {
  const orders = await ordersDb.find({ userId: userId });
  return orders;
};

export { createUser, findUser, getOrderHistory };