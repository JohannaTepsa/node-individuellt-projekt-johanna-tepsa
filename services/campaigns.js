import Datastore from 'nedb-promises';

// Initialize nedb database
const campaignDb = Datastore.create({ filename: './databases/campaigns.db', autoload: true });

// Function to create a new campaign
const createCampaign = async (campaignData) => {
  try {
    const newCampaign = await campaignDb.insert(campaignData);
    return newCampaign;
  } catch (err) {
    throw err;
  }
};

// Function to find a campaign by name
const findCampaign = async (name) => {
  try {
    const campaign = await campaignDb.findOne({ name });
    return campaign;
  } catch (err) {
    throw err;
  }
};

export { createCampaign, findCampaign }