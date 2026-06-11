import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['LBP', 'USD'], default: 'USD' },
  type: { type: String, enum: ['sale', 'rent', 'deposit', 'commission'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled', 'refunded'], default: 'pending' },
  stripePaymentIntentId: String,
  stripeSessionId: String,
  platformFee: { type: Number, default: 0 },
  notes: { type: String },
}, { timestamps: true });

transactionSchema.index({ buyer: 1, property: 1 });
transactionSchema.index({ seller: 1 });
transactionSchema.index({ stripePaymentIntentId: 1 });

export default mongoose.model('Transaction', transactionSchema);
