import nedb from 'nedb-promises';

const db = new nedb({ filename: "users.db", autoload: true});

// Create a new user
const createUser = async (user) => {
	const newUser = await db.insert(user); // Send new user
	return newUser; // Return new user
}

// Find existing user
const findUser = async (username) => {
	const user = await db.findOne({ username : username });
	return user;
}

export { createUser, findUser }