import mongoose from 'mongoose';
import { getModel } from '../config/db.js';
import { MockExpenses } from '../utils/mockDb.js';

const expenseSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['inventory', 'rent', 'utilities', 'marketing', 'salary', 'other'], 
    required: true 
  },
  amount: { type: Number, required: true },
  description: { type: String, default: '' },
  date: { type: String, required: true } // YYYY-MM-DD
}, { timestamps: true });

const ExpenseMongoose = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

const ExpenseWrapper = {
  find: (query) => getModel(ExpenseMongoose, MockExpenses).find(query),
  findOne: (query) => getModel(ExpenseMongoose, MockExpenses).findOne(query),
  findById: (id) => getModel(ExpenseMongoose, MockExpenses).findById(id),
  create: (data) => getModel(ExpenseMongoose, MockExpenses).create(data),
  findByIdAndUpdate: (id, data, options) => getModel(ExpenseMongoose, MockExpenses).findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getModel(ExpenseMongoose, MockExpenses).findByIdAndDelete(id),
  countDocuments: (query) => getModel(ExpenseMongoose, MockExpenses).countDocuments(query)
};

export default ExpenseWrapper;
export { ExpenseMongoose };
