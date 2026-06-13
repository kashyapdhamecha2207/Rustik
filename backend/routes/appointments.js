import express from 'express';
import Appointment from '../models/Appointment.js';
import Customer from '../models/Customer.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all appointments (Filtered by date, barber, status)
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  const { date, barberId, status } = req.query;
  const filter = {};

  if (date) filter.date = date;
  if (status) filter.status = status;
  
  // Barber role constraint: Barbers can ONLY see their own schedule
  if (req.user.role === 'barber') {
    filter.barberId = req.user._id.toString();
  } else if (barberId) {
    filter.barberId = barberId;
  }

  try {
    const appointments = await Appointment.find(filter);
    // Sort chronologically by date and then time
    appointments.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new appointment (Public - from portfolio booking widget)
// @route   POST /api/appointments
// @access  Public
router.post('/', async (req, res) => {
  const { customerName, customerPhone, customerEmail, serviceId, serviceName, barberId, barberName, date, time, duration, price, notes } = req.body;

  if (!customerName || !customerPhone || !serviceId || !serviceName || !barberId || !barberName || !date || !time || !price) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
  }

  try {
    // 1. Check if customer exists by phone, if not create them
    let customer = await Customer.findOne({ phone: customerPhone });
    if (!customer) {
      customer = await Customer.create({
        name: customerName,
        email: customerEmail || '',
        phone: customerPhone,
        notes: 'Signed up via online booking'
      });
    }

    // 2. Create the appointment
    const appointment = await Appointment.create({
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      customerId: customer._id.toString(),
      serviceId,
      serviceName,
      barberId,
      barberName,
      date,
      time,
      duration: Number(duration) || 30,
      price: Number(price),
      status: 'pending',
      notes: notes || ''
    });

    res.status(201).json({ success: true, message: 'Appointment requested successfully.', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update appointment status (Approve, Complete, Cancel)
// @route   PATCH /api/appointments/:id/status
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
  const { status } = req.body; // pending, confirmed, completed, cancelled

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // If barber role, check that they own the appointment
    if (req.user.role === 'barber' && appointment.barberId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized. You can only update your own appointments.' });
    }

    // Update status
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });

    // If status is updated to completed, append to customer visit records
    if (status === 'completed' && appointment.customerId) {
      const customer = await Customer.findById(appointment.customerId);
      if (customer) {
        let visits = customer.visits || [];
        // Check if visit is already logged for this appointment
        if (!visits.some(v => v.appointmentId === appointment._id.toString())) {
          visits.push({
            date: appointment.date,
            services: [appointment.serviceName],
            barberName: appointment.barberName,
            amount: appointment.price,
            appointmentId: appointment._id.toString()
          });
          await Customer.findByIdAndUpdate(appointment.customerId, { visits });
        }
      }
    }

    res.json({ success: true, message: `Appointment status updated to ${status}`, appointment: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Edit full appointment details
// @route   PUT /api/appointments/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (req.user.role === 'barber' && appointment.barberId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized. You can only edit your own appointments.' });
    }

    const updatedAppt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Appointment details modified', appointment: updatedAppt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Owner or Manager)
router.delete('/:id', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
