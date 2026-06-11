import express from 'express';
import { createInquiry, replyToInquiry, getPropertyInquiries, getMyInquiries, getAgentInquiries, getAllInquiries, getInquiry, updateInquiryStatus } from '../controllers/inquiries.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/mine', protect, getMyInquiries);
router.get('/agent', protect, authorize('agent', 'seller', 'admin'), getAgentInquiries);
router.get('/property/:propertyId', protect, getPropertyInquiries);
router.get('/', protect, authorize('admin'), getAllInquiries);
router.get('/:id', protect, getInquiry);
router.post('/:id/reply', protect, replyToInquiry);
router.put('/:id', protect, updateInquiryStatus);

export default router;
