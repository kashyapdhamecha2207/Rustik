import mongoose from 'mongoose';
import { getModel } from '../config/db.js';
import { MockServices } from '../utils/mockDb.js';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['haircut', 'beard', 'coloring', 'facial', 'grooming'], 
    required: true 
  },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  description: { type: String, default: '' },
  image: { type: String, default: '' }
}, { timestamps: true });

const ServiceMongoose = mongoose.models.Service || mongoose.model('Service', serviceSchema);

const ServiceWrapper = {
  find: (query) => getModel(ServiceMongoose, MockServices).find(query),
  findOne: (query) => getModel(ServiceMongoose, MockServices).findOne(query),
  findById: (id) => getModel(ServiceMongoose, MockServices).findById(id),
  create: (data) => getModel(ServiceMongoose, MockServices).create(data),
  findByIdAndUpdate: (id, data, options) => getModel(ServiceMongoose, MockServices).findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getModel(ServiceMongoose, MockServices).findByIdAndDelete(id),
  countDocuments: (query) => getModel(ServiceMongoose, MockServices).countDocuments(query)
};

export default ServiceWrapper;
export { ServiceMongoose };
