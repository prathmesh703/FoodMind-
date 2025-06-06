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
      default: 2000,
    },
    proteinGoal: {
      type: Number,
      default: 150,
    },
    carbGoal: {
      type: Number,
      default: 200,
    },
    fatGoal: {
      type: Number,
      default: 65,
    },
    waterGoal: {
      type: Number,
      default: 2000,
    },
    dietRestrictions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
