const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Login Page
router.get("/login", (req, res) => {
    res.sendFile("views/login.html", { root: __dirname + "/../" });
});

// Login Logic
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username, password } });
        if (user) {
            req.session.userId = user.id;
            res.redirect("/dashboard");
        } else {
            res.send("<h3>Invalid credentials! <a href='/login'>Try Again</a></h3>");
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send("An error occurred during login");
    }
});


// Register Page
router.get("/register", (req, res) => {
    res.sendFile("views/register.html", { root: __dirname + "/../" });
});

// Register Logic
router.post("/register", async (req, res) => {
    try {
        const { email, username, password, confirm_password } = req.body;

        if (password !== confirm_password) {
            return res.send("<h3>Passwords do not match! <a href='/register'>Try Again</a></h3>");
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.send("<h3>Email is already registered! <a href='/register'>Try Again</a></h3>");
        }

        // Add user creation logic here
        const newUser = await User.create({
            email,
            username,
            password
        });

        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send("An error occurred during registration");
    }
});

module.exports = router;