import express from 'express';
import { createInquiry, getPropertyInquiries, getMyInquiries, getAllInquiries, updateInquiryStatus } from '../controllers/inquiries.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/mine', protect, getMyInquiries);
router.get('/property/:propertyId', protect, getPropertyInquiries);
router.get('/', protect, authorize('admin'), getAllInquiries);
router.put('/:id', protect, updateInquiryStatus);

export default router;
