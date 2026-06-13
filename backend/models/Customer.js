import mongoose from 'mongoose';
import { getModel } from '../config/db.js';
import { MockCustomers } from '../utils/mockDb.js';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  notes: { type: String, default: '' },
  visits: [{
    date: { type: String }, // YYYY-MM-DD
    services: [{ type: String }],
    barberName: { type: String },
    amount: { type: Number },
    appointmentId: { type: String }
  }]
}, { timestamps: true });

const CustomerMongoose = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

const CustomerWrapper = {
  find: (query) => getModel(CustomerMongoose, MockCustomers).find(query),
  findOne: (query) => getModel(CustomerMongoose, MockCustomers).findOne(query),
  findById: (id) => getModel(CustomerMongoose, MockCustomers).findById(id),
  create: (data) => getModel(CustomerMongoose, MockCustomers).create(data),
  findByIdAndUpdate: (id, data, options) => getModel(CustomerMongoose, MockCustomers).findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getModel(CustomerMongoose, MockCustomers).findByIdAndDelete(id),
  countDocuments: (query) => getModel(CustomerMongoose, MockCustomers).countDocuments(query)
};

export default CustomerWrapper;
export { CustomerMongoose };
