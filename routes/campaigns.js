// File: routes/campaigns.js

import { Router } from 'express';
import { createCampaign, findCampaign } from '../services/campaigns.js';
import { validateNewCampaign } from '../middlewares/validate.js';

const router = Router();

// Route to create a new campaign
router.post('/add', validateNewCampaign, async (req, res) => {
  const { name, items, promotionalPrice } = req.body;

  try {
    // Check if a campaign with the same name exists
    const existingCampaign = await findCampaign(name);
    if (existingCampaign) {
      return res.status(400).json({ error: 'A campaign with the same name already exists' });
    }

    // Create campaign object
    const campaignData = { name, items, promotionalPrice };

    // Add campaign to database
    const newCampaign = await createCampaign(campaignData);

    // Return success response
    res.status(201).json({ success: true, campaign: newCampaign });
  } catch (error) {
    console.error('Failed to add new campaign:', error);
    res.status(500).json({ error: 'Failed to add new campaign' });
  }
});

export default router;