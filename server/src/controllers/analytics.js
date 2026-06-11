import Property from '../models/Property.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Inquiry from '../models/Inquiry.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalProperties, activeListings, pendingApprovals, totalUsers, totalAgents, totalInquiries, recentTransactions] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ isActive: true, approved: true }),
      Property.countDocuments({ approved: false }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'agent', isActive: true }),
      Inquiry.countDocuments(),
      Transaction.find().sort('-createdAt').limit(10).populate('property', 'title price').populate('buyer', 'firstName lastName'),
    ]);
    const propertiesByType = await Property.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);
    const propertiesByCity = await Property.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const monthlyListings = await Property.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 }, year: { $first: { $year: '$createdAt' } } } },
      { $sort: { '_id': 1 } },
    ]);
    res.json({
      totalProperties, activeListings, pendingApprovals, totalUsers, totalAgents, totalInquiries,
      recentTransactions, propertiesByType, propertiesByCity, monthlyListings,
    });
  } catch (error) { next(error); }
};

export const getAgentStats = async (req, res, next) => {
  try {
    const [totalListings, activeListings, totalInquiries, totalViews] = await Promise.all([
      Property.countDocuments({ owner: req.user.id }),
      Property.countDocuments({ owner: req.user.id, isActive: true, approved: true }),
      Inquiry.countDocuments({ property: { $in: await Property.find({ owner: req.user.id }).distinct('_id') } }),
      Property.aggregate([{ $match: { owner: req.user._id } }, { $group: { _id: null, total: { $sum: '$views' } } }]),
    ]);
    res.json({ totalListings, activeListings, totalInquiries, totalViews: totalViews[0]?.total || 0 });
  } catch (error) { next(error); }
};
