import mongoose from 'mongoose';
import { User } from '../models/User.model';
import { Lead } from '../models/Lead.model';
import { env } from '../config/env';

const runSeed = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('Cleared existing data');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      passwordHash: 'Admin123!',
      role: 'admin',
    });

    const sales = await User.create({
      name: 'Sales User',
      email: 'sales@test.com',
      passwordHash: 'Sales123!',
      role: 'sales_user',
    });

    console.log('Created Admin and Sales users');

    const statuses = ['New', 'Contacted', 'Qualified', 'Lost'];
    const sources = ['Website', 'Instagram', 'Referral'];

    const leads = Array.from({ length: 25 }).map((_, i) => ({
      name: `Lead ${i + 1}`,
      email: `lead${i + 1}@example.com`,
      status: statuses[i % statuses.length],
      source: sources[i % sources.length],
      createdBy: i % 2 === 0 ? admin._id : sales._id,
    }));

    await Lead.insertMany(leads);
    console.log('Created 25 fake leads');

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

runSeed();
