import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  customerInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      size: { type: String, default: 'N/A' }, 
      color: { type: String, default: 'N/A' }, 
      price: { type: Number, required: true },
      imageUrl: { type: String, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
  },
  

  paymentMethod: {
    type: String,
    required: true,
    default: 'Cash on Delivery',
  },
  transactionId: {
    type: String, 
  },

  
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;