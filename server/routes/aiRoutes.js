const express = require("express");
const router = express.Router();
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const mongoose = require("mongoose");
const MealPlan = require("../models/mealPlan.js").default || require("../models/mealPlan.js");

// Initialize Google AI
const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

router.post("/generate-mealplan", async (req, res) => {
  const {
    dailyCalories,
    dietaryRestrictions,
    proteinGoal,
    carbGoal,
    fatGoal,
    additionalRequirements,
  } = req.body;

  // Validate required fields
  if (!dailyCalories || !proteinGoal || !carbGoal || !fatGoal) {
    return res.status(400).json({
      message:
        "Missing required fields: dailyCalories, proteinGoal, carbGoal, and fatGoal are required",
    });
  }

  try {
    const prompt = `Create a 7-day meal plan with the following requirements:
      - Dietary Restrictions: ${dietaryRestrictions || "None"}
      - Daily Calories: ${dailyCalories} kcal
      - Protein Goal: ${proteinGoal}g
      - Fat Goal: ${fatGoal}g
      - Carb Goal: ${carbGoal}g
      - Additional Requirements: ${additionalRequirements || "None"}

      Please provide a detailed meal plan for each day including breakfast, lunch, snack, and dinner.
      Format the response as a JSON object with the following structure:
      {
        "monday": {
          "breakfast": { "meal": "meal name", "calories": number, "protein": number, "carbs": number, "fat": number },
          "lunch": { "meal": "meal name", "calories": number, "protein": number, "carbs": number, "fat": number },
          "snack": { "meal": "meal name", "calories": number, "protein": number, "carbs": number, "fat": number },
          "dinner": { "meal": "meal name", "calories": number, "protein": number, "carbs": number, "fat": number }
        },
        // ... repeat for all days of the week
      }
      
      Ensure that:
      1. The total daily calories are close to ${dailyCalories}
      2. The macronutrient distribution matches the goals
      3. All meals comply with the dietary restrictions
      4. Include only the JSON in your response, no additional text`;

    // Generate content using the new API pattern
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    try {
      // Parse the response as JSON
      // Note: Gemini might include markdown code blocks, so we need to clean the response
      const cleanJson = response.text.replace(/```json\n?|\n?```/g, "").trim();
      const mealPlan = JSON.parse(cleanJson);

      // Save each day's meal plan to MongoDB
      const days = Object.keys(mealPlan);
      const savedPlans = [];
      for (const day of days) {
        const meals = mealPlan[day];
        // Convert to array of meals for the schema
        const mealsArray = Object.entries(meals).map(([time, meal]) => ({
          time: time.charAt(0).toUpperCase() + time.slice(1),
          meal: meal.meal,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
        }));
        // Upsert (update if exists, otherwise insert)
        const saved = await MealPlan.findOneAndUpdate(
          { day: day.charAt(0).toUpperCase() + day.slice(1) },
          { day: day.charAt(0).toUpperCase() + day.slice(1), meals: mealsArray },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        savedPlans.push(saved);
      }

      res.status(200).json({ mealPlan, savedPlans });
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      res.status(500).json({
        message: "Failed to parse AI response",
        error: parseError.message,
        rawResponse: response.text,
      });
    }
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({
      message: "Failed to generate meal plan",
      error: error.message,
    });
  }
});

module.exports = router;
