import express from 'express';
import { createPaymentIntent, createCheckoutSession, webhook, getTransactions, getAllTransactions } from '../controllers/payments.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);
router.get('/transactions', protect, getTransactions);
router.get('/admin/transactions', protect, authorize('admin'), getAllTransactions);

export default router;
