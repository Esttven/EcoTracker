const express = require("express");
const router = express.Router();
const ElectricUsage = require("../models/ElectricUsage");
const Appliance = require("../models/Appliance");

router.get("/", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    res.sendFile("views/dashboard.html", { root: __dirname + "/../" });
});

module.exports = router;