import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
  description: { type: String, required: [true, 'Description is required'], maxlength: 5000 },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  currency: { type: String, enum: ['LBP', 'USD'], default: 'USD' },
  pricePerSquareMeter: { type: Number, min: 0 },
  negotiable: { type: Boolean, default: true },
  status: { type: String, enum: ['for-sale', 'for-rent', 'sold', 'rented', 'pending'], default: 'for-sale' },
  purpose: { type: String, enum: ['sale', 'rent'], required: true },
  type: { type: String, enum: ['apartment', 'villa', 'house', 'penthouse', 'duplex', 'studio', 'land', 'commercial', 'office', 'building', 'townhouse', 'chalet'], required: true },
  bedrooms: { type: Number, min: 0, default: 0 },
  bathrooms: { type: Number, min: 0, default: 0 },
  floorArea: { type: Number, min: 0 },
  landArea: { type: Number, min: 0 },
  floors: { type: Number, min: 1 },
  yearBuilt: { type: Number },
  furnished: { type: Boolean, default: false },
  amenities: [{ type: String }],
  location: {
    street: { type: String },
    district: { type: String },
    city: { type: String, required: [true, 'City is required'] },
    governorate: { type: String, enum: ['Beirut', 'Mount Lebanon', 'North', 'South', 'Bekaa', 'Nabatieh', 'Akkar', 'Baalbek-Hermel'] },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    nearbyLandmarks: [{ type: String }]
  },
  images: [{
    public_id: String,
    url: String,
    isPrimary: { type: Boolean, default: false }
  }],
  videoUrl: { type: String },
  virtualTour: { type: String },
  features: {
    parking: { type: Boolean, default: false },
    parkingSpaces: { type: Number, default: 0 },
    balcony: { type: Boolean, default: false },
    garden: { type: Boolean, default: false },
    pool: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    airConditioning: { type: Boolean, default: false },
    heating: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    generator: { type: Boolean, default: false },
    waterTank: { type: Boolean, default: false },
    solarPanels: { type: Boolean, default: false },
    maidRoom: { type: Boolean, default: false },
    storage: { type: Boolean, default: false },
    roof: { type: Boolean, default: false }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactInfo: {
    name: String,
    phone: String,
    email: String,
    whatsapp: String
  },
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  approved: { type: Boolean, default: false },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

propertySchema.virtual('inquiries', { ref: 'Inquiry', localField: '_id', foreignField: 'property' });
propertySchema.virtual('reviews', { ref: 'Review', localField: '_id', foreignField: 'property' });
propertySchema.virtual('averageRating').get(function() {
  if (!this.reviews || this.reviews.length === 0) return 0;
  return this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
});

propertySchema.index({ 'location.city': 1, status: 1, type: 1, price: 1, bedrooms: 1 });
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ featured: -1, createdAt: -1 });

export default mongoose.model('Property', propertySchema);
