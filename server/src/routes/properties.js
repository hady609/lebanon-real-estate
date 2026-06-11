import express from 'express';
import { getProperties, getProperty, createProperty, updateProperty, deleteProperty, getMyProperties, approveProperty, toggleFeatured, getSimilarProperties, getFeaturedProperties, getLocations } from '../controllers/properties.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/locations', getLocations);
router.get('/mine', protect, getMyProperties);
router.get('/:id', getProperty);
router.get('/:id/similar', getSimilarProperties);
router.post('/', protect, upload.array('images', 20), createProperty);
router.put('/:id', protect, upload.array('images', 20), updateProperty);
router.delete('/:id', protect, deleteProperty);
router.put('/:id/approve', protect, authorize('admin'), approveProperty);
router.put('/:id/featured', protect, authorize('admin'), toggleFeatured);

export default router;
