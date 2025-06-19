const express = require("express");
const router = express.Router();
const MealPlan = require("../models/mealPlan.js").default || require("../models/mealPlan.js");

// GET all meal plans
router.get("/", async (req, res) => {
  try {
    const plans = await MealPlan.find({});
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch meal plans", error: err.message });
  }
});

module.exports = router; 