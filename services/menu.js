import Datastore from 'nedb-promises';
import { newMenuItemSchema } from '../models/menu.js';

const menuDb = new Datastore({ filename: './databases/menu.db', autoload: true });

// Get menu
const getMenu = async () => {
  try {
    const menuItems = await menuDb.find({});
    return menuItems;
  } catch (err) {
    throw new Error(`Failed to get menu: ${err.message}`);
  }
};

// Get menu via ID
const getMenuItemById = async (id) => {
  try {
    // Ensures ID is treated as a number if stored as a number in the database
    const menuItem = await menuDb.findOne({ id: Number(id) });
    return menuItem;
  } catch (err) {
    throw new Error(`Failed to get menu item by ID: ${err.message}`);
  }
};

// Get menu via ID and Title
const getMenuItemByIdAndTitle = async (id, title) => {
  try {
    const menuItem = await menuDb.findOne({ id, title });
    return menuItem;
  } catch (err) {
    throw new Error(`Failed to get menu item by ID and Title: ${err.message}`);
  }
};

// Initialize menu
const initializeMenu = async (menuData) => {
  return new Promise((resolve, reject) => {
    menuDb.insert(menuData, (err, newDocs) => {
      if (err) {
        reject(err);
      } else {
        resolve(newDocs);
      }
    });
  });
};

// Add menu item
const addMenuItem = async (menuItemData) => {
  try {
    const { error } = newMenuItemSchema.validate(menuItemData);
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`);
    }

    const existingMenuItem = await menuDb.findOne({ id: menuItemData.id });
    if (existingMenuItem) {
      throw new Error(`Item with ID ${menuItemData.id} already exists in the menu`);
    }

    const newMenuItem = await menuDb.insert(menuItemData);
    return newMenuItem;
  } catch (error) {
    throw new Error(`Failed to add menu item: ${error.message}`);
  }
};

// Delete menu item
const deleteMenuItem = async (id) => {
  try {
    // Ensure the menu item exists before attempting to delete
    const menuItem = await getMenuItemById(id);
    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    // Perform the delete operation
    const result = await menuDb.remove({ id: Number(id) }, { multi: false });

    if (result.deletedCount === 0) {
      throw new Error('Failed to delete menu item: Item not found');
    }

    console.log(`Menu item with ID ${id} deleted successfully`);
    return true;
  } catch (err) {
    console.error(`Failed to delete menu item: ${err.message}`);
    throw new Error(`Failed to delete menu item: ${err.message}`);
  }
};

export { getMenu, getMenuItemById, getMenuItemByIdAndTitle, initializeMenu, addMenuItem, deleteMenuItem, menuDb };