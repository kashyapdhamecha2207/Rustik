import mongoose from 'mongoose';
import { getModel } from '../config/db.js';
import { MockCMS } from '../utils/mockDb.js';

const cmsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const CMSMongoose = mongoose.models.CMS || mongoose.model('CMS', cmsSchema);

const CMSWrapper = {
  find: (query) => getModel(CMSMongoose, MockCMS).find(query),
  findOne: (query) => getModel(CMSMongoose, MockCMS).findOne(query),
  findById: (id) => getModel(CMSMongoose, MockCMS).findById(id),
  create: (data) => getModel(CMSMongoose, MockCMS).create(data),
  findByIdAndUpdate: (id, data, options) => getModel(CMSMongoose, MockCMS).findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getModel(CMSMongoose, MockCMS).findByIdAndDelete(id),
  countDocuments: (query) => getModel(CMSMongoose, MockCMS).countDocuments(query),
  // Direct key update or insert helper
  findOneAndUpdate: async (filter, update, options = {}) => {
    if (global.isMockDB) {
      const existing = await MockCMS.findOne(filter);
      if (existing) {
        return MockCMS.findByIdAndUpdate(existing._id, update, options);
      } else {
        return MockCMS.create({ ...filter, ...update });
      }
    }
    return CMSMongoose.findOneAndUpdate(filter, update, { upsert: true, new: true, ...options });
  }
};

export default CMSWrapper;
export { CMSMongoose };
