import express from 'express';
import Customer from '../models/Customer.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all customers with optional search queries
// @route   GET /api/customers
// @access  Private
router.get('/', protect, async (req, res) => {
  const { search } = req.query;
  try {
    let query = {};
    if (search) {
      // If we are using mock database, we have simple JS filter which is handled by mockDb.js
      // We will perform the matching locally in the route for both MongoDB and Mock DB for maximum safety
      const customers = await Customer.find({});
      const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.phone.includes(search) || 
        (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
      );
      return res.json({ success: true, customers: filtered });
    }
    const customers = await Customer.find({});
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get customer details
// @route   GET /api/customers/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add customer manually from dashboard
// @route   POST /api/customers
// @access  Private (Owner, Manager, Staff, Admin)
router.post('/', protect, authorizeRoles('owner', 'manager', 'staff', 'admin'), async (req, res) => {
  const { name, email, phone, notes } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Customer name and phone number are required' });
  }

  try {
    const exists = await Customer.findOne({ phone });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Customer with this phone number already exists' });
    }

    const customer = await Customer.create({
      name,
      email: email || '',
      phone,
      notes: notes || '',
      visits: []
    });

    res.status(201).json({ success: true, message: 'Customer profile created', customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update customer profile
// @route   PUT /api/customers/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Customer profile updated', customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete customer profile
// @route   DELETE /api/customers/:id
// @access  Private (Owner, Manager, Admin)
router.delete('/:id', protect, authorizeRoles('owner', 'manager', 'admin'), async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
