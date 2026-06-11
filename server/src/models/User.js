import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 50 },
  lastName: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8, select: false },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['buyer', 'seller', 'agent', 'admin'], default: 'buyer' },
  avatar: { public_id: String, url: String },
  agency: { name: String, licenseNumber: String, address: String, logo: { public_id: String, url: String } },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  savedSearches: [{ name: String, criteria: mongoose.Schema.Types.Mixed, alertsEnabled: { type: Boolean, default: true }, createdAt: { type: Date, default: Date.now } }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual('fullName').get(function() { return `${this.firstName} ${this.lastName}`; });
userSchema.virtual('properties', { ref: 'Property', localField: '_id', foreignField: 'owner' });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export default mongoose.model('User', userSchema);
