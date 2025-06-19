const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { verifyToken } = require("./auth");

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({
      name: user.name,
      email: user.email,
      dailyCalories: user.dailyCalories,
      proteinGoal: user.proteinGoal,
      carbGoal: user.carbGoal,
      fatGoal: user.fatGoal,
      waterGoal: user.waterGoal,
      dietRestrictions: user.dietRestrictions,
      weeklyProgress: user.weeklyProgress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update nutritional goals
router.put("/goals", verifyToken, async (req, res) => {
  try {
    const { dailyCalories, proteinGoal, carbGoal, fatGoal } = req.body;

    // Validate input
    const goals = {};
    if (dailyCalories !== undefined) goals.dailyCalories = dailyCalories;
    if (proteinGoal !== undefined) goals.proteinGoal = proteinGoal;
    if (carbGoal !== undefined) goals.carbGoal = carbGoal;
    if (fatGoal !== undefined) goals.fatGoal = fatGoal;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: goals },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Goals updated successfully",
      user: {
        name: user.name,
        email: user.email,
        dailyCalories: user.dailyCalories,
        proteinGoal: user.proteinGoal,
        carbGoal: user.carbGoal,
        fatGoal: user.fatGoal,
        waterGoal: user.waterGoal,
        dietRestrictions: user.dietRestrictions,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update dietary restrictions
router.put("/diet-restrictions", verifyToken, async (req, res) => {
  try {
    const { dietRestrictions } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { dietRestrictions } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Dietary restrictions updated successfully",
      dietRestrictions: user.dietRestrictions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
