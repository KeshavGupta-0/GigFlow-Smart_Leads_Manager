import { User, IUserDocument } from '../models/User.model';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// In-memory fallback database for user demo mode
const memoryUsers: any[] = [];

// Seed a default admin user so you can log in immediately:
// Email: admin@gigflow.com
// Password: password123
const seedAdmin = async () => {
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash('password123', salt);
  
  memoryUsers.push({
    _id: new mongoose.Types.ObjectId(),
    name: 'GigFlow Demo Admin',
    email: 'admin@gigflow.com',
    passwordHash: passwordHash,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    comparePassword: async function (candidate: string) {
      return bcrypt.compare(candidate, this.passwordHash);
    },
    toObject: function () {
      return {
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  });
};

seedAdmin();

export const findByEmail = async (email: string): Promise<IUserDocument | null> => {
  if (mongoose.connection.readyState !== 1) {
    const found = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found || null;
  }
  return User.findOne({ email });
};

export const findById = async (id: string): Promise<IUserDocument | null> => {
  if (mongoose.connection.readyState !== 1) {
    const found = memoryUsers.find(u => u._id.toString() === id.toString());
    return found || null;
  }
  return User.findById(id);
};

export const createUser = async (data: Partial<IUserDocument>): Promise<IUserDocument> => {
  if (mongoose.connection.readyState !== 1) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.passwordHash || '', salt);

    const newUser = {
      _id: new mongoose.Types.ObjectId(),
      name: data.name,
      email: data.email,
      passwordHash: passwordHash,
      role: 'admin', // Demo registrations are automatically admins for a full preview
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: async function (candidate: string) {
        return bcrypt.compare(candidate, this.passwordHash);
      },
      toObject: function () {
        return {
          _id: this._id,
          name: this.name,
          email: this.email,
          role: this.role,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt
        };
      }
    };
    memoryUsers.push(newUser);
    return newUser as any;
  }

  const user = new User(data);
  return user.save();
};
