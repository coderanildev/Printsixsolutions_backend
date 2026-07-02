const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const checkAdminAuth = require("../middleware/checkAdminAuth");
const Country = require("../model/Country");
const router = express.Router();

// Add New Country
router.post("/", checkAdminAuth, async (req, res) => {
  try {
    console.log(req.user.role);
    
    const { name, code } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    const existing = await Country.findOne({ $or: [{ name }, { code }] });
    if (existing) {
      return res.status(409).json({ message: 'Country already exists' });
    }

    const newCountry = await Country.create({ name, code });
    res.status(201).json(newCountry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a country
router.put('/:id', checkAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const updatedCountry = await Country.findByIdAndUpdate(
      id,
      { name, code },
      { new: true, runValidators: true }
    );

    if (!updatedCountry) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.json(updatedCountry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a country
router.delete('/:id', checkAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Country.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.json({ message: 'Country deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all countries
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 }); 
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch countries', error });
  }
});

// Get country by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findById(id);

    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.json(country);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching country', error });
  }
});

module.exports = router;
