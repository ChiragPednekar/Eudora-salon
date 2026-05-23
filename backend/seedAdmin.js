import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eudora_salon');
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@eudora.com' });
    
    if (adminExists) {
      console.log('Admin already exists!');
    } else {
      // The schema hashes the password in a pre('save') hook, so we just pass plain text
      await User.create({
        name: 'System Admin',
        email: 'admin@eudora.com',
        password: 'password123',
        role: 'admin',
      });
      console.log('Admin account created successfully!');
    }
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
