import mongoose from 'mongoose';

const outletSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    timings: {
      open: { type: String, default: '10:00' }, // e.g., "10:00"
      close: { type: String, default: '21:00' }, // e.g., "21:00"
    },
    activeSlots: {
      type: [String], // Arrays of slot strings e.g. ["10:00", "11:00", ...]
      default: [],
    },
    blockedDates: {
      type: [String], // Array of blocked dates (YYYY-MM-DD)
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

const Outlet = mongoose.model('Outlet', outletSchema);
export default Outlet;
