import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const sendToken = (user, statusCode, res) => {
  const token = getToken(user._id);
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  user.password = undefined;
  res.status(statusCode).cookie('token', token, options).json({ token, user });
};

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ firstName, lastName, email, password, phone, role: role || 'buyer' });
    sendToken(user, 201, res);
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    user.lastLogin = Date.now();
    await user.save();
    sendToken(user, 200, res);
  } catch (error) { next(error); }
};

export const logout = (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 5000), httpOnly: true }).json({ message: 'Logged out' });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('savedProperties');
    res.json({ user });
  } catch (error) { next(error); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const fields = ['firstName', 'lastName', 'phone', 'avatar', 'agency'];
    const updates = {};
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.json({ user });
  } catch (error) { next(error); }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) { next(error); }
};

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive) filter.isActive = req.query.isActive === 'true';
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort('-createdAt'),
      User.countDocuments(filter),
    ]);
    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('properties');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deactivated' });
  } catch (error) { next(error); }
};

export const saveProperty = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const propId = req.params.propertyId;
    if (user.savedProperties.includes(propId)) {
      user.savedProperties.pull(propId);
      await user.save();
      return res.json({ saved: false, message: 'Property removed from saved' });
    }
    user.savedProperties.push(propId);
    await user.save();
    res.json({ saved: true, message: 'Property saved' });
  } catch (error) { next(error); }
};

export const saveSearch = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { name, criteria } = req.body;
    user.savedSearches.push({ name, criteria });
    await user.save();
    res.json({ savedSearches: user.savedSearches });
  } catch (error) { next(error); }
};

export const deleteSavedSearch = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedSearches.pull(req.params.searchId);
    await user.save();
    res.json({ savedSearches: user.savedSearches });
  } catch (error) { next(error); }
};

export const getAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true });
    res.json({ agents });
  } catch (error) { next(error); }
};
