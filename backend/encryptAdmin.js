import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js'; // your User model

dotenv.config();

// --------------------------------------------------
// ⚠️ Provide your real admin credentials here
const YOUR_EMAIL = "johanhasanrohan@gmail.com"; // <-- the email you used in step 1.5
const YOUR_NEW_PASSWORD = "northmugda75"; // <-- your real password
// --------------------------------------------------

const encryptPassword = async () => {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(YOUR_NEW_PASSWORD, salt);

    console.log("Hashing password...");

    const user = await User.findOneAndUpdate(
      { email: YOUR_EMAIL, isAdmin: true },
      { password: hashedPassword },
      { new: true } // return the updated document
    );

    if (user) {
      console.log("✅ SUCCESS! Admin password has been updated.");
      console.log("You can now delete this 'encryptAdmin.js' file.");
    } else {
      console.error("❌ ERROR: Admin user not found. Did you create it in Atlas?");
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

encryptPassword();