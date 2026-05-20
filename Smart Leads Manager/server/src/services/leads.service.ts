import * as leadRepository from '../repositories/lead.repository';
import { ILeadQuery, ICreateLeadBody, IUpdateLeadBody } from '../types/lead.types';
import { ApiError } from '../utils/ApiError';

export const getLeads = async (query: ILeadQuery, userId: string, role: string) => {
  const { leads, total } = await leadRepository.findAll(query, userId, role);
  
  const page = query.page || 1;
  const limit = query.limit || 10;
  const totalPages = Math.ceil(total / limit);

  return {
    docs: leads,
    totalDocs: total,
    limit,
    totalPages,
    page,
  };
};

export const getLeadById = async (id: string, userId: string, role: string) => {
  const lead = await leadRepository.findById(id);
  
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  if (role !== 'admin' && lead.createdBy._id.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to access this lead');
  }

  return lead;
};

export const createLead = async (data: ICreateLeadBody, userId: string) => {
  return leadRepository.create(data, userId);
};

export const updateLead = async (id: string, data: IUpdateLeadBody, userId: string, role: string) => {
  const lead = await leadRepository.findById(id);
  
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  if (role !== 'admin' && lead.createdBy._id.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to update this lead');
  }

  const updatedLead = await leadRepository.update(id, data);
  return updatedLead;
};

export const deleteLead = async (id: string, userId: string, role: string) => {
  const lead = await leadRepository.findById(id);
  
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  if (role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete leads');
  }

  await leadRepository.deleteById(id);
  return { success: true };
};

export const exportLeads = async (query: Partial<ILeadQuery>, userId: string, role: string) => {
  return leadRepository.findAllForExport(query, userId, role);
};
