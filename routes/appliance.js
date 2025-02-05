const express = require('express');
const router = express.Router();
const { Appliance } = require('../models');
const { authenticateUser } = require('../middleware/firebaseAuth');

// Create a new appliance
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { name, type, kwh } = req.body;
        const newAppliance = await Appliance.create({ name, type, kwh });
        res.status(201).json(newAppliance);
    } catch (error) {
        res.status(500).json({ error: 'Error creating appliance' });
    }
});

// Get all appliances
router.get('/', authenticateUser, async (req, res) => {
    try {
        const appliances = await Appliance.findAll();
        res.status(200).json(appliances);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching appliances' });
    }
});

// Get an appliance by ID
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const appliance = await Appliance.findByPk(req.params.id);
        if (appliance) {
            res.status(200).json(appliance);
        } else {
            res.status(404).json({ error: 'Appliance not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching appliance' });
    }
});

// Update an appliance
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const { name, type, kwh } = req.body;
        const appliance = await Appliance.findByPk(req.params.id);
        if (appliance) {
            await appliance.update({ name, type, kwh });
            res.status(200).json(appliance);
        } else {
            res.status(404).json({ error: 'Appliance not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating appliance' });
    }
});

// Delete an appliance
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const appliance = await Appliance.findByPk(req.params.id);
        if (appliance) {
            await appliance.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Appliance not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting appliance' });
    }
});

module.exports = router;