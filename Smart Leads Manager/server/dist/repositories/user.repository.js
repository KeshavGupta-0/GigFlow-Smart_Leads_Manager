"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findById = exports.findByEmail = void 0;
const User_model_1 = require("../models/User.model");
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// In-memory fallback database for user demo mode
const memoryUsers = [];
// Seed a default admin user so you can log in immediately:
// Email: admin@gigflow.com
// Password: password123
const seedAdmin = async () => {
    const salt = await bcryptjs_1.default.genSalt(12);
    const passwordHash = await bcryptjs_1.default.hash('password123', salt);
    memoryUsers.push({
        _id: new mongoose_1.default.Types.ObjectId(),
        name: 'GigFlow Demo Admin',
        email: 'admin@gigflow.com',
        passwordHash: passwordHash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        comparePassword: async function (candidate) {
            return bcryptjs_1.default.compare(candidate, this.passwordHash);
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
const findByEmail = async (email) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        const found = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        return found || null;
    }
    return User_model_1.User.findOne({ email });
};
exports.findByEmail = findByEmail;
const findById = async (id) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        const found = memoryUsers.find(u => u._id.toString() === id.toString());
        return found || null;
    }
    return User_model_1.User.findById(id);
};
exports.findById = findById;
const createUser = async (data) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        const salt = await bcryptjs_1.default.genSalt(12);
        const passwordHash = await bcryptjs_1.default.hash(data.passwordHash || '', salt);
        const newUser = {
            _id: new mongoose_1.default.Types.ObjectId(),
            name: data.name,
            email: data.email,
            passwordHash: passwordHash,
            role: 'admin', // Demo registrations are automatically admins for a full preview
            createdAt: new Date(),
            updatedAt: new Date(),
            comparePassword: async function (candidate) {
                return bcryptjs_1.default.compare(candidate, this.passwordHash);
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
        return newUser;
    }
    const user = new User_model_1.User(data);
    return user.save();
};
exports.createUser = createUser;
