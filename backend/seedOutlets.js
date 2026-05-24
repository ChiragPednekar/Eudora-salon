import mongoose from 'mongoose';

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://Eudora:aCAAaachgEw9SaD5@cluster0.vmax5n9.mongodb.net/eudora_salon?appName=Cluster0');
  
  const outletSchema = new mongoose.Schema({
    name: String,
    location: String,
    timings: { open: String, close: String },
    activeSlots: [String]
  });
  
  const Outlet = mongoose.models.Outlet || mongoose.model('Outlet', outletSchema);
  
  const defaultSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
  
  const outletsData = [
    { name: "Wadala East", location: "S. M. Road, Wadala East, Mumbai", timings: { open: "10:00", close: "21:00" }, activeSlots: defaultSlots },
    { name: "Matunga", location: "Bhaudaji Road, Matunga, Mumbai", timings: { open: "10:00", close: "21:00" }, activeSlots: defaultSlots },
    { name: "Dadar East", location: "Hindu Colony, Dadar East, Mumbai", timings: { open: "10:00", close: "21:00" }, activeSlots: defaultSlots }
  ];

  await Outlet.deleteMany({});
  await Outlet.insertMany(outletsData);
  console.log('Outlets Seeded Successfully!');
  process.exit(0);
};

connectDB();
