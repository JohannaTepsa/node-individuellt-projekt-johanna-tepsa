// File: routes/menu.js

import { Router } from 'express';
import { initializeMenu, getMenu,  addMenuItem, getMenuItemById, deleteMenuItem } from '../services/menu.js';
import { validateNewMenuItem, validateModifyMenuItem, validateDeleteMenuItem } from '../middlewares/validate.js';

const router = Router();

// Initialize menu - should be a one-time event
router.post('/initialize', async (req, res) => {
  const menuData = req.body.menu;
  const newMenu = await initializeMenu(menuData);
  res.status(201).json({ success: true, menu: newMenu });
});

// View menu
router.get('/view', async (req, res) => {
  const menu = await getMenu();
  res.status(200).json(menu);
});

// Add new menu item
router.post('/add', validateNewMenuItem, async (req, res) => {
  const { id, title, desc, price } = req.body;

  try {
    // Create menu item object
    const menuItemData = { id, title, desc, price };

    // Add menu item to database
    const newMenuItem = await addMenuItem(menuItemData);

    // Return success response
    res.status(201).json({ success: true, menuItem: newMenuItem });
  } catch (error) {
    console.error('Failed to add new menu item:', error);
    res.status(500).json({ error: 'Failed to add new menu item' });
  }
});

// Update menu item
router.patch('/:id', validateModifyMenuItem, async (req, res) => {
  const { id } = req.params;
  const { title, desc, price } = req.body;

  try {
    // Update menu item in database
    const updatedMenuItem = await updateMenuItem(id, title, desc, price);

    // Return success response
    res.status(200).json({ success: true, menuItem: updatedMenuItem });
  } catch (error) {
    console.error('Failed to update menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Remove menu item via POST
router.post('/delete/:id', validateDeleteMenuItem, async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the menu item exists by ID
    const existingMenuItem = await getMenuItemById(id);
    if (!existingMenuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    // Perform delete operation
    await deleteMenuItem(id);

    // Return success response
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export default router;