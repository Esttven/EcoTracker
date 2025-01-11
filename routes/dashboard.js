const express = require("express");
const router = express.Router();
const { User, ElectricUsage, Appliance } = require("../models");

router.get("/", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    res.sendFile("views/dashboard.html", { root: __dirname + "/../" });
});

router.get("/data", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: "No autenticado" });
        }

        const user = await User.findByPk(req.session.userId);
        const appliances = await Appliance.findAll({
            attributes: ['id', 'name', 'type', 'kwh']
        });
        const usageInstances = await ElectricUsage.findAll({
            where: { userId: req.session.userId },
            include: [{
                model: Appliance,
                attributes: ['name', 'type', 'kwh']
            }],
            order: [['createdAt', 'DESC']]
        });

        const instances = usageInstances.map(usage => ({
            id: usage.id,
            applianceName: usage.Appliance.name,
            frequency: usage.frequency,
            type: usage.Appliance.type,
            monthlyUsage: usage.Appliance.type === "hours_per_day"
                ? usage.frequency * usage.Appliance.kwh * 30
                : usage.frequency * usage.Appliance.kwh * 4
        }));

        const totalMonthlyUsage = instances.reduce((total, instance) => 
            total + instance.monthlyUsage, 0);

        res.json({
            username: user.username,
            appliances: appliances,
            usageInstances: instances,
            totalMonthlyUsage: totalMonthlyUsage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

function calculateMonthlyUsage(frequency, appliance) {
    if (appliance.type === "hours_per_day") {
        return frequency * appliance.kwh * 30; // Daily to monthly
    } else {
        return frequency * appliance.kwh * 4; // Weekly to monthly
    }
}

router.post("/usage", async (req, res) => {
    try {
        const { applianceId, frequency } = req.body;
        const userId = req.session.userId;

        const newUsage = await ElectricUsage.create({
            userId,
            applianceId,
            frequency
        });

        const appliance = await Appliance.findByPk(applianceId);
        const monthlyUsage = appliance.type === "hours_per_day"
            ? frequency * appliance.kwh * 30
            : frequency * appliance.kwh * 4;

        res.json({
            id: newUsage.id,
            applianceName: appliance.name,
            frequency: frequency,
            monthlyUsage
        });
    } catch (error) {
        res.status(500).json({ error: "Error al cargar la instancia de uso" });
    }
});

router.put("/usage/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { frequency } = req.body;
        const usage = await ElectricUsage.findByPk(id, {
            include: [Appliance]
        });

        if (!usage || usage.userId !== req.session.userId) {
            return res.status(404).json({ error: "Uso no encontrado" });
        }

        await usage.update({ frequency });

        const monthlyUsage = usage.Appliance.type === "hours_per_day"
            ? frequency * usage.Appliance.kwh * 30
            : frequency * usage.Appliance.kwh * 4;

        res.json({
            id: usage.id,
            applianceName: usage.Appliance.name,
            frequency,
            type: usage.Appliance.type,
            monthlyUsage
        });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar uso" });
    }
});

router.delete("/usage/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const usage = await ElectricUsage.findByPk(id);

        if (!usage || usage.userId !== req.session.userId) {
            return res.status(404).json({ error: "Uso no encontrado" });
        }

        await usage.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar uso" });
    }
});

module.exports = router;