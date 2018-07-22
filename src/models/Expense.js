const mongoose = require('mongoose');

const { Schema } = mongoose;

const ExpenseSchema = new Schema({
  title: { type: String, required: true, index: { unique: true } },
  description: { type: String, required: true },
  amount: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
