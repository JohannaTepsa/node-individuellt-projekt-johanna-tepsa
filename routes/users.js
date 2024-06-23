// File: routes/users.js

import { Router } from 'express';
import { createUser, findUser, getOrderHistory } from '../services/users.js';
import { validateNewUser, validateUser } from '../middlewares/validate.js';

const router = Router();

router.post('/register', validateNewUser, async(req, res) => {
  const user = await findUser(req.body.username);
  if (user) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = await createUser(req.body);
  const response = {
    success: true,
    status: 201,
    message: 'User created successfully',
    data: newUser
  }
  res.json(response);
});

router.post('/login', validateUser, async (req, res) => {
  try {
    const user = await findUser(req.body.username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } else if (user.password !== req.body.password) {
      return res.status(404).json({ error: 'Invalid password' });
    }

    global.use = user;
    const response = {
      success: true,
      status: 200,
      message: 'User logged in successfully',
      data: user
    }

    res.json(response);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in user' });
  }
});

router.post('/logout', (req, res) => {
  global.use = null;
  const response = {
    success: true,
    status: 200,
    message: 'User logged out successfully'
  }

  res.json(response);
})

export default router;