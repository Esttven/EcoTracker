const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } = require('firebase/auth');
const { initializeApp } = require('firebase/app');
const { User } = require('../models');
const { firebaseConfig, googleProvider } = require('../config/firebaseConfig');
const { authenticateUser } = require('../middleware/firebaseAuth');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Add user to the database
        const newUser = await User.create({
            id: user.uid, // Store Firebase user ID in the id field
            email,
            username,
            adminId: 0
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        const userId = userCredential.user.uid;

        // Check if user exists in the database
        let user = await User.findOne({ where: { id: userId } });
        if (!user) {
            // Add user to the database if not exists
            user = await User.create({
                id: userId, // Store Firebase user ID in the id field
                email,
                username: email,
                adminId: 0
            });
        }

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in user', details: error.message });
    }
});

// Google login
router.post('/google-auth', async (req, res) => {
    try {
        const { token, email, userId } = req.body;

        console.log('Google auth request:', { token: token.substring(0, 20) + '...', email, userId });

        const decodedToken = await admin.auth().verifyIdToken(token);
        
        console.log('Decoded token:', { uid: decodedToken.uid, userId });
        
        if (decodedToken.uid !== userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if user exists in database
        let user = await User.findOne({ where: { id: userId } });
        
        // Create user if doesn't exist
        if (!user) {
            user = await User.create({
                id: userId,
                email,
                username: email.split('@')[0], // Create username from email
                adminId: 0
            });
        }

        res.status(200).json({ user, token });
    } catch (error) {
        console.error('Error in Google authentication:', error);
        res.status(500).json({ 
            error: 'Authentication failed', 
            details: error.message 
        });
    }
});

// Logout user
router.post('/logout', async (req, res) => {
    try {
        await signOut(auth);
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error logging out user', details: error.message });
    }
});

// Verify token
router.get('/verify-token', authenticateUser, async (req, res) => {
    try {
        res.status(200).json({
            valid: true,
            userId: req.user.uid
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;