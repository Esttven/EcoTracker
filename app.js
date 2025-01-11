const express = require("express");
const session = require("express-session");
const path = require("path");
const { Sequelize } = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: "simple-auth", resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, "public")));

// Rutas
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
app.use("/", authRoutes);
app.use("/dashboard", dashboardRoutes);

// Ruta principal
app.get("/", (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, "views", "dashboard.html"));
    } else {
        res.sendFile(path.join(__dirname, "views", "index.html"));
    }
});

// Base de datos
const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: "localhost",
    dialect: "postgres",
});
sequelize.authenticate()
    .then(() => console.log("Base de datos conectada"))
    .catch(err => console.error("Conección a la base de datos fallida:", err));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en: http://localhost:${port}`);
});