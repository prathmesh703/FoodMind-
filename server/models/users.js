const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dailyCalories: {
      type: Number,
      default: 0,
    },
    proteinGoal: {
      type: Number,
      default: 0,
    },
    carbGoal: {
      type: Number,
      default: 0,
    },
    fatGoal: {
      type: Number,
      default: 0,
    },
    waterGoal: {
      type: Number,
      default: 0,
    },
    dietRestrictions: {
      type: [String],
      default: [],
    },
    weeklyProgress: {
      type: [Number],
      default: [0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
