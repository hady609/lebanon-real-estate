import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true, maxlength: 1000 },
  preferredContact: { type: String, enum: ['phone', 'email', 'whatsapp'], default: 'email' },
  viewedByOwner: { type: Boolean, default: false },
  status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
}, { timestamps: true });

inquirySchema.index({ property: 1, createdAt: -1 });
inquirySchema.index({ sender: 1 });

export default mongoose.model('Inquiry', inquirySchema);
