"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.update = exports.create = exports.findById = exports.findAllForExport = exports.findAll = void 0;
const Lead_model_1 = require("../models/Lead.model");
const mongoose_1 = __importDefault(require("mongoose"));
// In-memory fallback database for leads
const memoryLeads = [
    {
        _id: 'mock-lead-1',
        name: 'Sarah Connor',
        email: 'sarah.connor@cyberdyne.com',
        phone: '555-0199',
        status: 'New',
        source: 'Website',
        value: 12000,
        createdBy: { _id: 'mock-admin', name: 'GigFlow Demo Admin', email: 'admin@gigflow.com' },
        createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 2)
    },
    {
        _id: 'mock-lead-2',
        name: 'Bruce Wayne',
        email: 'bruce@wayneenterprises.com',
        phone: '555-1939',
        status: 'Contacted',
        source: 'Referral',
        value: 85000,
        createdBy: { _id: 'mock-admin', name: 'GigFlow Demo Admin', email: 'admin@gigflow.com' },
        createdAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
        updatedAt: new Date(Date.now() - 3600000 * 12)
    },
    {
        _id: 'mock-lead-3',
        name: 'Tony Stark',
        email: 'tony@starkindustries.com',
        phone: '555-1963',
        status: 'Qualified',
        source: 'Instagram',
        value: 150000,
        createdBy: { _id: 'mock-admin', name: 'GigFlow Demo Admin', email: 'admin@gigflow.com' },
        createdAt: new Date(Date.now() - 3600000 * 48), // 2 days ago
        updatedAt: new Date(Date.now() - 3600000 * 4)
    }
];
const buildFilter = (query, userId, role) => {
    const filter = {};
    if (role !== 'admin') {
        filter.createdBy = userId;
    }
    if (query.status) {
        filter.status = query.status;
    }
    if (query.source) {
        filter.source = query.source;
    }
    if (query.search) {
        const searchRegex = new RegExp(query.search, 'i');
        filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }
    return filter;
};
const findAll = async (query, userId, role) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        let filtered = [...memoryLeads];
        // Filter status
        if (query.status) {
            filtered = filtered.filter(l => l.status === query.status);
        }
        // Filter source
        if (query.source) {
            filtered = filtered.filter(l => l.source === query.source);
        }
        // Filter search
        if (query.search) {
            const s = query.search.toLowerCase();
            filtered = filtered.filter(l => l.name.toLowerCase().includes(s) ||
                l.email.toLowerCase().includes(s));
        }
        // Sort
        const sortDirection = query.sort === 'asc' ? 1 : -1;
        filtered.sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * sortDirection);
        // Paginate
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const leads = filtered.slice(skip, skip + limit);
        return { leads: leads, total: filtered.length };
    }
    const filter = buildFilter(query, userId, role);
    const sortDirection = query.sort === 'asc' ? 1 : -1;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const [leads, total] = await Promise.all([
        Lead_model_1.Lead.find(filter)
            .sort({ createdAt: sortDirection })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name email')
            .lean(),
        Lead_model_1.Lead.countDocuments(filter),
    ]);
    return { leads, total };
};
exports.findAll = findAll;
const findAllForExport = async (query, userId, role) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        let filtered = [...memoryLeads];
        if (query.status)
            filtered = filtered.filter(l => l.status === query.status);
        if (query.source)
            filtered = filtered.filter(l => l.source === query.source);
        filtered.sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * (query.sort === 'asc' ? 1 : -1));
        return filtered;
    }
    const filter = buildFilter(query, userId, role);
    return Lead_model_1.Lead.find(filter)
        .sort({ createdAt: query.sort === 'asc' ? 1 : -1 })
        .populate('createdBy', 'name email')
        .lean();
};
exports.findAllForExport = findAllForExport;
const findById = async (id) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        const matched = memoryLeads.find(l => l._id === id);
        return matched || null;
    }
    return Lead_model_1.Lead.findById(id).populate('createdBy', 'name email').lean();
};
exports.findById = findById;
const create = async (data, userId) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        const newLead = {
            _id: 'mock-lead-' + Math.random().toString(36).substr(2, 9),
            ...data,
            createdBy: { _id: userId, name: 'GigFlow Demo Admin', email: 'admin@gigflow.com' },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        memoryLeads.push(newLead);
        return newLead;
    }
    const lead = new Lead_model_1.Lead({ ...data, createdBy: userId });
    await lead.save();
    return lead.toObject();
};
exports.create = create;
const update = async (id, data) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        const index = memoryLeads.findIndex(l => l._id === id);
        if (index === -1)
            return null;
        memoryLeads[index] = {
            ...memoryLeads[index],
            ...data,
            updatedAt: new Date()
        };
        return memoryLeads[index];
    }
    return Lead_model_1.Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('createdBy', 'name email').lean();
};
exports.update = update;
const deleteById = async (id) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        const index = memoryLeads.findIndex(l => l._id === id);
        if (index !== -1) {
            memoryLeads.splice(index, 1);
        }
        return;
    }
    await Lead_model_1.Lead.findByIdAndDelete(id);
};
exports.deleteById = deleteById;
