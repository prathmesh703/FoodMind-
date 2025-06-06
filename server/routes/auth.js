const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Create token and send user data after signup
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({
      msg: "User created successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not exist");
      return res.status(400).json({ msg: "user does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("invalid credentials");
      return res.status(400).json({ msg: "invalid credentials" });
    }
    console.log("login successful");
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send user data along with token
    res.json({
      msg: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
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

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Bearer token

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Get user data
router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
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

module.exports = { router, verifyToken };
