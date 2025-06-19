import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    time:{ type:String, enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner'] , required:true},
    meal: {type: String, required: true},
    calories: { type:Number, required:true},
    protein: {type: Number, required: true},
    carbs: {type: Number, required: true},
    fat: {type: Number, required: true}
});

const mealPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
    unique: true
  },
  meals: [mealSchema]
});


export default mongoose.models.MealPlan || mongoose.model('MealPlan' , mealPlanSchema);