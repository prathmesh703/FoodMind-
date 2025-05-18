const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const client = new OpenAI();

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
});

router.post('/generate-mealplan', async (req, res) => {
  const { dietaryPreference, calorieGoal } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional dietitian. Only return JSON.'
        },
        {
          role: 'user',
          content: `Create a 7-day ${dietaryPreference} meal plan with ${calorieGoal} kcal per day. Include breakfast, lunch, snack, and dinner. Format the output in JSON grouped by day.`
        }
      ]
    });

    const aiResponse = completion.choices[0].message.content;
    const parsed = JSON.parse(aiResponse);

    res.status(200).json(parsed);
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ message: 'Failed to generate meal plan.' });
  }
});

module.exports = router;