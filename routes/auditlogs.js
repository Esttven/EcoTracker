const express = require('express');
const router = express.Router();
const { AuditLog } = require('../models');
const { authenticateUser } = require('../middleware/firebaseAuth');

// Get all audit logs
router.get('/', authenticateUser, async (req, res) => {
  try {
    const logs = await AuditLog.findAll();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Error fetching audit logs', details: error.message });
  }
});

module.exports = router;