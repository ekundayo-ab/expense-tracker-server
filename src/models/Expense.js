import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExpenseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
});

export default mongoose.model('Expense', ExpenseSchema);
