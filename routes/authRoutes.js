import { Router } from 'express';
import { createUser, findUser } from '../services/authServices.js';
import validate from '../middlewares/validate.js';

const router = Router();

router.post('/register', validate, async (req, res) => {
  const { username, password, email } = req.body;
  
  try {
    const user = await findUser(username);
    if (user) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    const newUser = await createUser({ username, password, email });
    const response = {
      success: true,
      status: 201,
      message: 'User created successfully',
      data: newUser
    };
    res.json(response);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', validate, async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await findUser(username);
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }
    
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    global.user = user;
    const response = {
      success: true,
      status: 200,
      message: 'User logged in successfully',
      data: user
    };
    res.json(response);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to login user' });
  }
});

router.post('/logout', (req, res) => {
  global.user = null;
  const response = {
    success: true,
    status: 200,
    message: 'User logged out successfully'
  };
  res.json(response);
});

export default router;