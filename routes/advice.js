const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
const { ElectricUsage, Appliance } = require('../models');
const { authenticateUser } = require('../middleware/firebaseAuth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/:userId', authenticateUser, async (req, res) => {
    try {
        const usages = await ElectricUsage.findAll({
            where: { userId: req.params.userId },
            include: [Appliance]
        });

        if (usages.length === 0) {
            return res.status(404).json({ error: 'No electric usage instances found for this user' });
        }

        const usageJson = JSON.stringify(usages);
        const prompt = `Este es mi consumo eléctrico: ${usageJson}. Basándote en cualquiera de los 3 electrodomésticos con mayor frecuencia de uso, dame un consejo breve en español sobre cómo reducir el consumo eléctrico. Dame solo el consejo, evita palabras innecesarias e intenta dar un consejo específico aplicable.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);

        const advice = result.response.text().trim();

        res.status(200).json({ advice });
    } catch (error) {
        console.error('Error fetching advice:', error);
        res.status(500).json({ error: 'Error fetching advice' });
    }
});

module.exports = router;