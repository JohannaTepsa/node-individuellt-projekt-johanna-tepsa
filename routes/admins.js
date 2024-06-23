// File: routes/admins.js

import express from 'express';
import { validateNewAdmin, validateAdmin, validateAdminSession } from '../middlewares/validate.js';
import { createAdmin, findAdmin } from '../services/admins.js';

const router = express.Router();

// Route to register a new admin
router.post('/register', validateNewAdmin, async (req, res) => {
  const existingAdmin = await findAdmin(req.body.username);
  if (existingAdmin) {
    return res.status(400).json({ error: 'Admin already exists' });
  }

  try {
    const newAdmin = await createAdmin(req.body);
    const response = {
      success: true,
      status: 201,
      message: 'Admin created successfully',
      data: newAdmin
    };
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to login an admin
router.post('/login', validateAdmin, async (req, res) => {
  const admin = await findAdmin(req.body.username);
  if (!admin) {
    return res.status(404).json({ error: 'Admin not found' });
  } else if (admin.password !== req.body.password) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  global.admin = admin;
  const response = {
    success: true,
    status: 200,
    message: 'Admin logged in successfully',
    data: admin
  };
  res.json(response);
});

// Route to logout an admin
router.post('/logout', validateAdminSession, (req, res) => {
  global.admin = null;
  const response = {
    success: true,
    status: 200,
    message: 'Admin logged out successfully'
  };

  res.json(response);
});

export default router;