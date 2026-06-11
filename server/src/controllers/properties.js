import Property from '../models/Property.js';

const buildFilter = (query) => {
  const filter = { isActive: true, approved: true };
  if (query.purpose) filter.purpose = query.purpose;
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  if (query.city) filter['location.city'] = new RegExp(query.city, 'i');
  if (query.governorate) filter['location.governorate'] = query.governorate;
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = parseInt(query.minPrice);
    if (query.maxPrice) filter.price.$lte = parseInt(query.maxPrice);
  }
  if (query.minBedrooms) filter.bedrooms = { $gte: parseInt(query.minBedrooms) };
  if (query.maxBedrooms) filter.bedrooms = { ...filter.bedrooms, $lte: parseInt(query.maxBedrooms) };
  if (query.minBathrooms) filter.bathrooms = { $gte: parseInt(query.minBathrooms) };
  if (query.minArea) filter.floorArea = { $gte: parseInt(query.minArea) };
  if (query.maxArea) filter.floorArea = { ...filter.floorArea, $lte: parseInt(query.maxArea) };
  if (query.furnished) filter.furnished = query.furnished === 'true';
  if (query.featured) filter.featured = query.featured === 'true';
  if (query.amenities) {
    const amenities = query.amenities.split(',');
    filter.amenities = { $all: amenities };
  }
  if (query.features) {
    const features = query.features.split(',');
    features.forEach(f => { filter[`features.${f}`] = true; });
  }
  if (query.keyword) {
    filter.$or = [
      { title: new RegExp(query.keyword, 'i') },
      { description: new RegExp(query.keyword, 'i') },
      { 'location.street': new RegExp(query.keyword, 'i') },
      { 'location.district': new RegExp(query.keyword, 'i') },
    ];
  }
  if (query.owner) filter.owner = query.owner;
  if (query.ids) filter._id = { $in: query.ids.split(',') };
  return filter;
};

export const getProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const filter = buildFilter(req.query);
    let sort = {};
    if (req.query.sort === 'price_asc') sort = { price: 1 };
    else if (req.query.sort === 'price_desc') sort = { price: -1 };
    else if (req.query.sort === 'newest') sort = { createdAt: -1 };
    else if (req.query.sort === 'oldest') sort = { createdAt: 1 };
    else if (req.query.sort === 'bedrooms') sort = { bedrooms: -1 };
    else sort = { featured: -1, createdAt: -1 };
    const [properties, total] = await Promise.all([
      Property.find(filter).skip(skip).limit(limit).sort(sort).populate('owner', 'firstName lastName email phone avatar role'),
      Property.countDocuments(filter),
    ]);
    res.json({ properties, total, page, pages: Math.ceil(total / limit), count: properties.length });
  } catch (error) { next(error); }
};

export const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
      .populate('owner', 'firstName lastName email phone avatar role agency');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ property });
  } catch (error) { next(error); }
};

export const createProperty = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;
    if (req.files?.length) {
      req.body.images = req.files.map((f, i) => ({ public_id: f.filename, url: f.path, isPrimary: i === 0 }));
    }
    const property = await Property.create(req.body);
    res.status(201).json({ property });
  } catch (error) { next(error); }
};

export const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.files?.length) {
      req.body.images = [...property.images, ...req.files.map((f, i) => ({ public_id: f.filename, url: f.path, isPrimary: i === 0 && property.images.length === 0 }))];
    }
    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ property });
  } catch (error) { next(error); }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    property.isActive = false;
    await property.save();
    res.json({ message: 'Property deactivated' });
  } catch (error) { next(error); }
};

export const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).sort('-createdAt');
    res.json({ properties });
  } catch (error) { next(error); }
};

export const approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ property });
  } catch (error) { next(error); }
};

export const toggleFeatured = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    property.featured = !property.featured;
    await property.save();
    res.json({ property });
  } catch (error) { next(error); }
};

export const getSimilarProperties = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const similar = await Property.find({
      _id: { $ne: property._id },
      type: property.type,
      purpose: property.purpose,
      isActive: true,
      approved: true,
      'location.city': property.location.city
    }).limit(6).populate('owner', 'firstName lastName');
    res.json({ properties: similar });
  } catch (error) { next(error); }
};

export const getFeaturedProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ featured: true, isActive: true, approved: true })
      .limit(8).sort('-createdAt').populate('owner', 'firstName lastName');
    res.json({ properties });
  } catch (error) { next(error); }
};

export const getLocations = async (req, res, next) => {
  try {
    const locations = await Property.aggregate([
      { $match: { isActive: true, approved: true } },
      { $group: { _id: '$location.city', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ locations });
  } catch (error) { next(error); }
};
