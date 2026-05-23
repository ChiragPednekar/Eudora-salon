import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Outlet from './src/models/Outlet.js';

dotenv.config();

const seedOutlets = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eudora_salon');
    
    const outlets = [
      {
        name: 'Wadala East',
        location: 'Dosti Aster, 14, Building, S. M. Road, Wadala East, Dosti Acres, Mumbai, Maharashtra 400037',
        timings: { open: '10:00', close: '21:00' },
        activeSlots: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
      },
      {
        name: 'Ghatkopar',
        location: 'Ghatkopar, Mumbai, Maharashtra',
        timings: { open: '10:00', close: '21:00' },
        activeSlots: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
      }
    ];

    for (const outletData of outlets) {
      const exists = await Outlet.findOne({ name: outletData.name });
      if (!exists) {
        await Outlet.create(outletData);
        console.log(`Created outlet: ${outletData.name}`);
      } else {
        console.log(`Outlet already exists: ${outletData.name}`);
      }
    }

    console.log('Outlet seeding complete!');
    process.exit();
  } catch (error) {
    console.error('Error seeding outlets:', error);
    process.exit(1);
  }
};

seedOutlets();
