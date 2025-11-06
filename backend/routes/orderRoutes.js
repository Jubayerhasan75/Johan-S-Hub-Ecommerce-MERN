import express from 'express';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- 1. POST /api/orders (Create New Order) ---
// protect middleware is required so req.user._id is available when creating an order
router.post('/', protect, async (req, res) => {
  try {
    const { customerInfo, orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
  user: req.user._id, // ✅ user id saved with the order
      customerInfo,
      orderItems,
      shippingAddress,
      totalPrice,
      isPaid: false,
      isDelivered: false,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order Create Error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// --- 2. GET /api/orders/myorders (Get Logged In User's Orders) ---
// ⚠️ This route must be defined before the /:id route
router.get('/myorders', protect, async (req, res) => {
  try {
  // only fetch orders that belong to the current user
  const orders = await Order.find({ user: req.user._id }); 
    res.json(orders);
  } catch (error) {
    console.error('My Orders Fetch Error:', error);
    res.status(500).json({ message: 'Server error fetching user orders' });
  }
});

// --- 3. GET /api/orders/:id (Get Single Order by ID) ---
// ✅ This route is for both admin and the owner of the order
router.get('/:id', protect, async (req, res) => {
  try {
  // populate the order with the user's name and email
  const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

  // security check: only admin or the owner can view this order
  if (req.user.isAdmin || order.user._id.equals(req.user._id)) {
      res.json(order);
    } else {
      res.status(401).json({ message: 'Not authorized to view this order' });
    }
  } catch (error) {
    console.error('Get Order By ID Error:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Order not found (Invalid ID)' });
    }
    res.status(500).json({ message: 'Server error fetching order details' });
  }
});

// --- 4. GET /api/orders (Get All Orders - Admin Only) ---
router.get('/', protect, admin, async (req, res) => {
  try {
    // Fix: when populating the 'user' field ensure it exists to avoid errors.
    // We'll select only the necessary fields.
    // Instruct Mongoose to populate 'user' field from the User model with 'name' and 'email'.
    const orders = await Order.find({})
      .populate({
        path: 'user',
        select: 'name email', // only select these two fields
        // option: if user is not found during populate, return null instead of throwing
        options: { strictPopulate: false } 
      });
      
    res.json(orders);
  } catch (error) {
  // Log the error but avoid crashing the server
  console.error('Server error fetching orders with populate:', error); 
  res.status(500).json({ message: 'Server error fetching orders' }); // keep 500 status code
  }
});

// --- 5. PUT /api/orders/:id/deliver (Mark as Delivered - Admin Only) ---
router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order' });
  }
});

export default router;