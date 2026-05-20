"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = require("../models/User.model");
const Lead_model_1 = require("../models/Lead.model");
const env_1 = require("../config/env");
const runSeed = async () => {
    try {
        await mongoose_1.default.connect(env_1.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        await User_model_1.User.deleteMany({});
        await Lead_model_1.Lead.deleteMany({});
        console.log('Cleared existing data');
        const admin = await User_model_1.User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            passwordHash: 'Admin123!',
            role: 'admin',
        });
        const sales = await User_model_1.User.create({
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
        await Lead_model_1.Lead.insertMany(leads);
        console.log('Created 25 fake leads');
        console.log('Seeding complete!');
    }
    catch (error) {
        console.error('Seeding error:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};
runSeed();
