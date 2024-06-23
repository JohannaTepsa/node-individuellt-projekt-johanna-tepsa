import Datastore from 'nedb-promises';

// Initialize nedb database
const db = Datastore.create({ filename: './databases/admins.db', autoload: true });

// Function to create a new admin
const createAdmin = async (adminData) => {
  try {
    const newAdmin = await db.insert(adminData);
    return newAdmin;
  } catch (err) {
    throw err;
  }
};

// Function to find an admin by username
const findAdmin = async (username) => {
  try {
    const admin = await db.findOne({ username });
    return admin;
  } catch (err) {
    throw err;
  }
};

export { createAdmin, findAdmin };