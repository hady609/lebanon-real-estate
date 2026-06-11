import express from 'express';
import { register, login, logout, getMe, updateProfile, updatePassword, getUsers, getUserById, deleteUser, saveProperty, saveSearch, deleteSavedSearch, getAgents } from '../controllers/auth.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/agents', getAgents);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/save-property/:propertyId', protect, saveProperty);
router.post('/save-search', protect, saveSearch);
router.delete('/save-search/:searchId', protect, deleteSavedSearch);

router.get('/users', protect, authorize('admin'), getUsers);
router.get('/users/:id', protect, getUserById);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;
