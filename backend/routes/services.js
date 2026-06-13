import express from 'express';
import Service from '../models/Service.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({});
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Owner or Manager)
router.post('/', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  const { name, category, price, duration, description, image } = req.body;

  if (!name || !category || !price || !duration) {
    return res.status(400).json({ success: false, message: 'Please provide name, category, price, and duration' });
  }

  try {
    const service = await Service.create({
      name,
      category,
      price: Number(price),
      duration: Number(duration),
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=300'
    });
    res.status(201).json({ success: true, message: 'Service created successfully', service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Owner or Manager)
router.put('/:id', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Owner or Manager)
router.delete('/:id', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
