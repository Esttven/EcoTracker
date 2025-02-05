const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticateUser } = require('../middleware/firebaseAuth');

// Create a new user
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { username, adminId } = req.body;
        const newUser = await User.create({ username, adminId });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Get all users
router.get('/', authenticateUser, async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Get a user by ID
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Update a user
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const { username, adminId } = req.body;
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update({ username, adminId });
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Delete a user
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;