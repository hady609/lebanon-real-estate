import Transaction from '../models/Transaction.js';
import Property from '../models/Property.js';

export const createPaymentIntent = async (req, res, next) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { propertyId, type } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const amount = type === 'deposit' ? Math.round(property.price * 0.1 * 100) : Math.round(property.price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { propertyId, userId: req.user.id, type },
    });
    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) { next(error); }
};

export const createCheckoutSession = async (req, res, next) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { propertyId, type } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: property.title, images: property.images?.map(i => i.url) },
          unit_amount: Math.round(property.price * 100),
        },
        quantity: 1,
      }],
      mode: type === 'rent' ? 'payment' : 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: { propertyId, userId: req.user.id, type },
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) { next(error); }
};

export const webhook = async (req, res, next) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Webhook signature verification failed' });
    }
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await Transaction.create({
        buyer: session.metadata.userId,
        property: session.metadata.propertyId,
        amount: session.amount_total / 100,
        type: session.metadata.type,
        status: 'completed',
        stripeSessionId: session.id,
      });
    }
    res.json({ received: true });
  } catch (error) { next(error); }
};

export const getTransactions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'buyer') filter.buyer = req.user.id;
    if (req.user.role === 'seller' || req.user.role === 'agent') filter.seller = req.user.id;
    const transactions = await Transaction.find(filter).sort('-createdAt')
      .populate('property', 'title price location images')
      .populate('buyer', 'firstName lastName email');
    res.json({ transactions });
  } catch (error) { next(error); }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find({}).skip(skip).limit(limit).sort('-createdAt')
        .populate('property', 'title price')
        .populate('buyer', 'firstName lastName email'),
      Transaction.countDocuments({}),
    ]);
    res.json({ transactions, total, page, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};
