const express = require('express');
const router = express.Router();
const { ElectricUsage, Appliance, User } = require('../models');
const { authenticateUser } = require('../middleware/firebaseAuth');

// Create a new electric usage
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { applianceId, frequency } = req.body;
        const userId = req.user.uid;

        const newUsage = await ElectricUsage.create({
            userId,
            applianceId,
            frequency
        });

        const appliance = await Appliance.findByPk(applianceId);
        const monthlyUsage = appliance.type === "hours_per_day"
            ? frequency * appliance.kwh * 30
            : frequency * appliance.kwh * 4;

        res.status(201).json({
            id: newUsage.id,
            applianceName: appliance.name,
            frequency: frequency,
            monthlyUsage
        });
    } catch (error) {
        console.error('Error creating electric usage:', error);
        res.status(500).json({ error: 'Error creating electric usage' });
    }
});

// Get all electric usages
router.get('/', authenticateUser, async (req, res) => {
    try {
        const usages = await ElectricUsage.findAll({
            include: [Appliance]
        });
        res.status(200).json(usages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching electric usages' });
    }
});

// Get electric usage by ID
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const usage = await ElectricUsage.findByPk(req.params.id, {
            include: [Appliance]
        });
        if (usage) {
            res.status(200).json(usage);
        } else {
            res.status(404).json({ error: 'Electric usage not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching electric usage' });
    }
});

// Update electric usage
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const { frequency } = req.body;
        const usage = await ElectricUsage.findByPk(req.params.id, {
            include: [Appliance]
        });

        if (usage) {
            await usage.update({ frequency });

            const monthlyUsage = usage.Appliance.type === "hours_per_day"
                ? frequency * usage.Appliance.kwh * 30
                : frequency * usage.Appliance.kwh * 4;

            res.status(200).json({
                id: usage.id,
                applianceName: usage.Appliance.name,
                frequency,
                type: usage.Appliance.type,
                monthlyUsage
            });
        } else {
            res.status(404).json({ error: 'Electric usage not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating electric usage' });
    }
});

// Delete electric usage
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const usage = await ElectricUsage.findByPk(req.params.id);

        if (usage) {
            await usage.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Electric usage not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting electric usage' });
    }
});

// Get all electric usages by user ID
router.get('/user/:userId', authenticateUser, async (req, res) => {
    try {
        const usages = await ElectricUsage.findAll({
            where: { userId: req.params.userId },
            include: [Appliance]
        });

        const usagesWithMonthlyUsage = usages.map(usage => {
            const monthlyUsage = usage.Appliance.type === "hours_per_day"
                ? usage.frequency * usage.Appliance.kwh * 30
                : usage.frequency * usage.Appliance.kwh * 4;

            return {
                id: usage.id,
                applianceName: usage.Appliance.name,
                frequency: usage.frequency,
                type: usage.Appliance.type,
                monthlyUsage
            };
        });

        res.status(200).json(usagesWithMonthlyUsage);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching electric usages by user ID' });
    }
});

module.exports = router;