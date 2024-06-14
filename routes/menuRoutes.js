import { Router } from 'express';
import { getMenu } from '../services/menuServices.js';

const router = Router();

// Route to get the menu
router.get('/', async (req, res) => {
  try {
    const menu = await getMenu();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

export default router;