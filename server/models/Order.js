const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  clientId: { type: String, required: true }, // device/session ID for offline sync
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    zip: String,
    country: String,
  },
  syncedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
