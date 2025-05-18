import mongoose from 'mongoose';

const shoppingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Produce', 'Dairy', 'Meat', 'Grains', 'Seafood', 'Nuts', 'Other'],
    required: true
  }
});

export default mongoose.models.ShoppingItem || mongoose.model('ShoppingItem', shoppingItemSchema);
