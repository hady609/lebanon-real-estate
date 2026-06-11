import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  text: { type: String, required: true, maxlength: 2000 },
  isFromAgent: { type: Boolean, default: false },
}, { timestamps: true });

const inquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true, maxlength: 1000 },
  preferredContact: { type: String, enum: ['phone', 'email', 'whatsapp'], default: 'email' },
  status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
  messages: [messageSchema],
}, { timestamps: true });

inquirySchema.index({ property: 1, createdAt: -1 });
inquirySchema.index({ sender: 1 });
inquirySchema.index({ email: 1 });

export default mongoose.model('Inquiry', inquirySchema);
