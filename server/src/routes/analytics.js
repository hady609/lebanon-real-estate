import express from 'express';
import { getDashboardStats, getAgentStats } from '../controllers/analytics.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/agent-stats', protect, authorize('agent', 'seller'), getAgentStats);

export default router;
