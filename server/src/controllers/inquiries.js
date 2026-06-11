import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';

export const createInquiry = async (req, res, next) => {
  try {
    const { property, name, email, phone, message, preferredContact } = req.body;
    if (!property || !name || !email || !message) {
      return res.status(400).json({ message: 'Property, name, email, and message are required' });
    }
    const prop = await Property.findById(property);
    if (!prop) return res.status(404).json({ message: 'Property not found' });
    const inquiry = await Inquiry.create({
      property, name, email, phone, message, preferredContact,
      sender: req.user?.id || null,
      messages: [{
        sender: req.user?.id || null,
        senderName: name,
        senderEmail: email,
        text: message,
        isFromAgent: false,
      }]
    });
    res.status(201).json({ inquiry });
  } catch (error) { next(error); }
};

export const replyToInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    const property = await Property.findById(inquiry.property);
    const isOwner = property?.owner?.toString() === req.user?.id || req.user?.role === 'admin';
    if (!isOwner) return res.status(403).json({ message: 'Not authorized' });
    if (!req.body.message?.trim()) return res.status(400).json({ message: 'Message is required' });
    inquiry.messages.push({
      sender: req.user.id,
      senderName: `${req.user.firstName} ${req.user.lastName}`,
      senderEmail: req.user.email,
      text: req.body.message,
      isFromAgent: true,
    });
    inquiry.status = 'replied';
    await inquiry.save();
    res.json({ inquiry });
  } catch (error) { next(error); }
};

export const getPropertyInquiries = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const inquiries = await Inquiry.find({ property: req.params.propertyId }).sort('-updatedAt');
    res.json({ inquiries });
  } catch (error) { next(error); }
};

export const getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({
      $or: [
        { sender: req.user.id },
        { email: { $regex: new RegExp(`^${req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
      ]
    })
      .populate('property', 'title price type location.city images')
      .sort('-updatedAt');
    res.json({ inquiries });
  } catch (error) { next(error); }
};

export const getAgentInquiries = async (req, res, next) => {
  try {
    const userProperties = await Property.find({ owner: req.user.id }).select('_id');
    const propertyIds = userProperties.map(p => p._id);
    if (propertyIds.length === 0) return res.json({ inquiries: [] });
    const inquiries = await Inquiry.find({ property: { $in: propertyIds } })
      .populate('property', 'title price type location.city images')
      .sort('-updatedAt');
    res.json({ inquiries });
  } catch (error) { next(error); }
};

export const getAllInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter).skip(skip).limit(limit).sort('-updatedAt')
        .populate('property', 'title price location.city'),
      Inquiry.countDocuments(filter),
    ]);
    res.json({ inquiries, total, page, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

export const getInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property', 'title price type location.city images contactInfo owner');
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    const property = await Property.findById(inquiry.property);
    const isOwner = property?.owner?.toString() === req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    const isSender = inquiry.sender?.toString() === req.user?.id ||
                    inquiry.email?.toLowerCase() === req.user?.email?.toLowerCase();
    if (!isOwner && !isSender && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if ((inquiry.status === 'new' || inquiry.status === 'read') && (isOwner || isAdmin)) {
      inquiry.status = inquiry.status === 'new' ? 'read' : 'read';
      await inquiry.save();
    }
    res.json({ inquiry });
  } catch (error) { next(error); }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ inquiry });
  } catch (error) { next(error); }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    let count = 0;
    if (req.user.role === 'admin') {
      count = await Inquiry.countDocuments({ status: 'new' });
    } else {
      const userProperties = await Property.find({ owner: req.user.id }).select('_id');
      const propertyIds = userProperties.map(p => p._id);
      if (propertyIds.length > 0) {
        count = await Inquiry.countDocuments({ property: { $in: propertyIds }, status: 'new' });
      }
    }
    res.json({ count });
  } catch (error) { next(error); }
};
