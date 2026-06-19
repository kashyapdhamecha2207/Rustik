import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getModel } from '../config/db.js';
import { MockUsers } from '../utils/mockDb.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['owner', 'manager', 'barber', 'staff', 'admin'], 
    default: 'staff' 
  },
  specialties: [{ type: String }],
  experience: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  instagram: { type: String, default: '' },
  phone: { type: String, default: '' },
  attendance: [{
    date: { type: String }, // YYYY-MM-DD
    status: { type: String, enum: ['present', 'absent', 'leave'], default: 'present' }
  }]
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserMongoose = mongoose.models.User || mongoose.model('User', userSchema);

// Custom wrapper to match methods on both Mongoose and Mock collection
const UserWrapper = {
  find: (query) => getModel(UserMongoose, MockUsers).find(query),
  findOne: (query) => {
    // Normalize email query if present
    if (query && query.email) {
      query.email = query.email.trim().toLowerCase();
    }
    return getModel(UserMongoose, MockUsers).findOne(query);
  },
  findById: (id) => getModel(UserMongoose, MockUsers).findById(id),
  create: async (data) => {
    if (data.email) {
      data.email = data.email.trim().toLowerCase();
    }
    // If mock DB is active, create in mock collection
    if (global.isMockDB) {
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }
      return MockUsers.create(data);
    }
    return UserMongoose.create(data);
  },
  findByIdAndUpdate: (id, data, options) => getModel(UserMongoose, MockUsers).findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getModel(UserMongoose, MockUsers).findByIdAndDelete(id),
  countDocuments: (query) => getModel(UserMongoose, MockUsers).countDocuments(query),
  // Additional custom helper for comparing passwords
  comparePassword: async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
};

export default UserWrapper;
export { UserMongoose };
