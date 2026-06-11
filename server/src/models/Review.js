import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 1000 },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

reviewSchema.index({ property: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
