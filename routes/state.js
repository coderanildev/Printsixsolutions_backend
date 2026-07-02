const express = require("express");
const State = require('../model/State');
const Country = require("../model/Country");
const checkAuth = require("../middleware/checkAuth");
const checkAdminAuth = require("../middleware/checkAdminAuth");
const router = express.Router();

// Add a new state
router.post('/', checkAdminAuth, async (req, res) => {
  try {
    const { name, code, countryId } = req.body;

    if (!name || !countryId) {
      return res.status(400).json({ message: 'Name and country are required' });
    }

    // Check if country exists
    const existingCountry = await Country.findById(countryId);
    if (!existingCountry) {
      return res.status(404).json({ message: 'Country not found' });
    }

    const newState = await State.create({ name, code, countryId });
    res.status(201).json(newState);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create state', error });
  }
});

// Update a state
router.put('/:id', checkAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, countryId } = req.body;

    const updated = await State.findByIdAndUpdate(
      id,
      { name, code, countryId },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'State not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update state', error });
  }
});

// Delete a state
router.delete('/:id', checkAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await State.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'State not found' });
    }

    res.json({ message: 'State deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete state', error });
  }
});

// Get all states
router.get('/', async (req, res) => {
  try {
    const states = await State.find().populate('country', 'name code').sort({ name: 1 });
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch states', error });
  }
});

// Get state by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const state = await State.findById(id);

    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }

    res.json(state);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch state', error });
  }
});

// Get states by country ID
router.get('/by-country/:countryId', async (req, res) => {
  try {
    const { countryId } = req.params;
    console.log("countryId", countryId);
    
    const states = await State.find({ countryId: countryId }).sort({ name: 1 });
    console.log("states", states);
    if (!states.length) {
      return res.status(404).json({ message: 'No states found for this country' });
    }

    res.json(states);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch states by country', error });
  }
});

module.exports = router;
