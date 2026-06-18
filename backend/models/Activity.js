import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  type: { 
    type: String, 
    enum: ['travel', 'energy', 'diet', 'shopping'], 
    required: true 
  },
  category: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  co2e: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Activity', activitySchema);