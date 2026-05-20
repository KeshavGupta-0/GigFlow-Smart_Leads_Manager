import { Lead, ILeadDocument } from '../models/Lead.model';
import { ILeadQuery, ICreateLeadBody, IUpdateLeadBody } from '../types/lead.types';
import mongoose from 'mongoose';

// In-memory fallback database for leads
const memoryLeads: any[] = [
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

const buildFilter = (query: Partial<ILeadQuery>, userId: string, role: string): Record<string, any> => {
  const filter: Record<string, any> = {};

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

export const findAll = async (
  query: ILeadQuery,
  userId: string,
  role: string
): Promise<{ leads: ILeadDocument[]; total: number }> => {
  if (mongoose.connection.readyState !== 1) {
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
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(s) || 
        l.email.toLowerCase().includes(s)
      );
    }
    
    // Sort
    const sortDirection = query.sort === 'asc' ? 1 : -1;
    filtered.sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * sortDirection);
    
    // Paginate
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    
    const leads = filtered.slice(skip, skip + limit);
    return { leads: leads as any, total: filtered.length };
  }

  const filter = buildFilter(query, userId, role);
  const sortDirection = query.sort === 'asc' ? 1 : -1;
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .lean(),
    Lead.countDocuments(filter),
  ]);

  return { leads, total };
};

export const findAllForExport = async (
  query: Partial<ILeadQuery>,
  userId: string,
  role: string
): Promise<ILeadDocument[]> => {
  if (mongoose.connection.readyState !== 1) {
    let filtered = [...memoryLeads];
    if (query.status) filtered = filtered.filter(l => l.status === query.status);
    if (query.source) filtered = filtered.filter(l => l.source === query.source);
    filtered.sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * (query.sort === 'asc' ? 1 : -1));
    return filtered as any;
  }

  const filter = buildFilter(query, userId, role);
  return Lead.find(filter)
    .sort({ createdAt: query.sort === 'asc' ? 1 : -1 })
    .populate('createdBy', 'name email')
    .lean() as any;
};

export const findById = async (id: string): Promise<ILeadDocument | null> => {
  if (mongoose.connection.readyState !== 1) {
    const matched = memoryLeads.find(l => l._id === id);
    return matched || null;
  }
  return Lead.findById(id).populate('createdBy', 'name email').lean() as any;
};

export const create = async (data: ICreateLeadBody, userId: string): Promise<ILeadDocument> => {
  if (mongoose.connection.readyState !== 1) {
    const newLead = {
      _id: 'mock-lead-' + Math.random().toString(36).substr(2, 9),
      ...data,
      createdBy: { _id: userId, name: 'GigFlow Demo Admin', email: 'admin@gigflow.com' },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryLeads.push(newLead);
    return newLead as any;
  }

  const lead = new Lead({ ...data, createdBy: userId });
  await lead.save();
  return lead.toObject() as any;
};

export const update = async (id: string, data: IUpdateLeadBody): Promise<ILeadDocument | null> => {
  if (mongoose.connection.readyState !== 1) {
    const index = memoryLeads.findIndex(l => l._id === id);
    if (index === -1) return null;
    memoryLeads[index] = {
      ...memoryLeads[index],
      ...data,
      updatedAt: new Date()
    };
    return memoryLeads[index] as any;
  }

  return Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('createdBy', 'name email').lean() as any;
};

export const deleteById = async (id: string): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    const index = memoryLeads.findIndex(l => l._id === id);
    if (index !== -1) {
      memoryLeads.splice(index, 1);
    }
    return;
  }

  await Lead.findByIdAndDelete(id);
};
