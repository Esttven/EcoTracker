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
            res.send("<h3>Credenciales inválidas <a href='/login'>Try Again</a></h3>");
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send("Error de inicio de sesión");
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
            return res.send("<h3>Las contraseñas no coinciden <a href='/register'>Intentar de nuevo</a></h3>");
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.send("<h3>El correo ya está registrado <a href='/register'>Intentar de nuevo</a></h3>");
        }

        const newUser = await User.create({
            email,
            username,
            password
        });

        res.redirect('/login');
    } catch (error) {
        console.error('Error de registro:', error);
        res.status(500).send("Ocurrió un error durante el registro");
    }
});

module.exports = router;