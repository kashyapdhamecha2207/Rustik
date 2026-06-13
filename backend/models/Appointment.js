import mongoose from 'mongoose';
import { getModel } from '../config/db.js';
import { MockAppointments } from '../utils/mockDb.js';

const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerId: { type: String, default: '' },
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  barberId: { type: String, required: true },
  barberName: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:MM
  duration: { type: Number, default: 30 }, // in minutes
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

const AppointmentMongoose = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

const AppointmentWrapper = {
  find: (query) => getModel(AppointmentMongoose, MockAppointments).find(query),
  findOne: (query) => getModel(AppointmentMongoose, MockAppointments).findOne(query),
  findById: (id) => getModel(AppointmentMongoose, MockAppointments).findById(id),
  create: (data) => getModel(AppointmentMongoose, MockAppointments).create(data),
  findByIdAndUpdate: (id, data, options) => getModel(AppointmentMongoose, MockAppointments).findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getModel(AppointmentMongoose, MockAppointments).findByIdAndDelete(id),
  countDocuments: (query) => getModel(AppointmentMongoose, MockAppointments).countDocuments(query)
};

export default AppointmentWrapper;
export { AppointmentMongoose };
