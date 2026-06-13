import express from 'express';
import CMS from '../models/CMS.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get CMS content by key (homepage, testimonials, gallery)
// @route   GET /api/cms/:key
// @access  Public
router.get('/:key', async (req, res) => {
  try {
    const cmsItem = await CMS.findOne({ key: req.params.key });
    if (!cmsItem) {
      return res.status(404).json({ success: false, message: `CMS key '${req.params.key}' not found` });
    }
    res.json({ success: true, key: req.params.key, data: cmsItem.value });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update CMS content by key
// @route   POST /api/cms/:key
// @access  Private (Owner or Manager)
router.post('/:key', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  const { data } = req.body;

  if (data === undefined) {
    return res.status(400).json({ success: false, message: 'Data content is required' });
  }

  try {
    const updated = await CMS.findOneAndUpdate(
      { key: req.params.key },
      { value: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: `CMS ${req.params.key} updated successfully`, data: updated.value });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
