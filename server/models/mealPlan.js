import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    name: {type: String, required: true},
    calories: { type:Number, required:true},
    time:{ type:String, enum: [] , required:true}
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