import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';

export const createInquiry = async (req, res, next) => {
  try {
    const { property, name, email, phone, message, preferredContact } = req.body;
    const prop = await Property.findById(property);
    if (!prop) return res.status(404).json({ message: 'Property not found' });
    const inquiry = await Inquiry.create({
      property, name, email, phone, message, preferredContact,
      sender: req.user?.id
    });
    res.status(201).json({ inquiry });
  } catch (error) { next(error); }
};

export const getPropertyInquiries = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const inquiries = await Inquiry.find({ property: req.params.propertyId }).sort('-createdAt');
    res.json({ inquiries });
  } catch (error) { next(error); }
};

export const getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ sender: req.user.id })
      .populate('property', 'title price type status location')
      .sort('-createdAt');
    res.json({ inquiries });
  } catch (error) { next(error); }
};

export const getAllInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter).skip(skip).limit(limit).sort('-createdAt')
        .populate('property', 'title price location'),
      Inquiry.countDocuments(filter),
    ]);
    res.json({ inquiries, total, page, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ inquiry });
  } catch (error) { next(error); }
};
