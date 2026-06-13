import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'rustik_academy_super_secret_key_123';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords using our static wrapper helper
    const isMatch = await User.comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Your account is deactivated.' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        specialties: user.specialties,
        experience: user.experience,
        rating: user.rating,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private/Admin (Only Owner or Manager can add staff/barbers)
router.post('/register', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  const { name, email, password, role, specialties, experience, bio, avatar, instagram, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'staff',
      specialties: specialties || [],
      experience: experience || 0,
      bio: bio || '',
      avatar: avatar || '',
      instagram: instagram || '',
      phone: phone || '',
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      specialties: req.user.specialties,
      experience: req.user.experience,
      rating: req.user.rating,
      phone: req.user.phone,
      bio: req.user.bio
    }
  });
});

// @desc    Get all active barbers (for portfolio website)
// @route   GET /api/auth/barbers
// @access  Public
router.get('/barbers', async (req, res) => {
  try {
    const barbers = await User.find({ role: 'barber', status: 'active' });
    res.json({ success: true, barbers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all employees (Admin view)
// @route   GET /api/auth/employees
// @access  Private (Owner or Manager)
router.get('/employees', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  try {
    const employees = await User.find({});
    // Strip passwords before sending
    const safeEmployees = employees.map(emp => {
      const { password, ...rest } = emp;
      return rest;
    });
    res.json({ success: true, employees: safeEmployees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update employee details
// @route   PUT /api/auth/employees/:id
// @access  Private (Owner or Manager)
router.put('/employees/:id', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee updated successfully', employee: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Deactivate employee status (toggle active/inactive)
// @route   PATCH /api/auth/employees/:id/status
// @access  Private (Owner or Manager)
router.patch('/employees/:id/status', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  const { status } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: `Employee status set to ${status}`, employee: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Record/Update employee attendance
// @route   POST /api/auth/employees/:id/attendance
// @access  Private (Owner, Manager, Staff)
router.post('/employees/:id/attendance', protect, authorizeRoles('owner', 'manager', 'staff'), async (req, res) => {
  const { date, status } = req.body; // date format: YYYY-MM-DD
  
  try {
    const emp = await User.findById(req.params.id);
    if (!emp) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    let attendance = emp.attendance || [];
    const index = attendance.findIndex(a => a.date === date);

    if (index > -1) {
      attendance[index].status = status;
    } else {
      attendance.push({ date, status });
    }

    const updatedEmp = await User.findByIdAndUpdate(req.params.id, { attendance }, { new: true });
    res.json({ success: true, message: 'Attendance recorded successfully', employee: updatedEmp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
