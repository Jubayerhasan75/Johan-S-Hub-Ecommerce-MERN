import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- 1. POST /api/users/login (login route) ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

  // user.matchPassword is defined in the User.js model
    if (user && (await user.matchPassword(password))) {
  // ✅ SUCCESS: on successful login return data with token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
  token: generateToken(user._id), // token generated
      });
    } else {
  // ❌ FAIL: invalid email or password
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error during login process' });
  }
});

// --- 2. POST /api/users/register (registration route) ---
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

  // isAdmin defaults to false (per User.js model)
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // On successful registration, return data and token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
    } catch (error) {
    console.error('Registration Error:', error); // for debugging
    res.status(500).json({ message: 'Server error during registration' });
  }
});


// --- 3. GET /api/users/profile (profile route) ---
router.get('/profile', protect, async (req, res) => {
 const user = await User.findById(req.user._id);

 if (user) {
   res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
 } else {
  res.status(404).json({ message: 'User not found' }); // return 404
 }
});


// --- 4. GET /api/users (all users - admin only) ---
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
     res.status(500).json({ message: 'Server Error fetching users' });
  }
});

export default router;