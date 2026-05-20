import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import * as leadsService from '../services/leads.service';
import { ApiResponse } from '../utils/ApiResponse';

export const getLeads = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const result = await leadsService.getLeads(req.query as any, userId, role);
    res.status(200).json(ApiResponse(200, 'Leads fetched successfully', result));
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const lead = await leadsService.getLeadById(req.params.id as string, userId, role);
    res.status(200).json(ApiResponse(200, 'Lead fetched successfully', lead));
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const lead = await leadsService.createLead(req.body, userId);
    res.status(201).json(ApiResponse(201, 'Lead created successfully', lead));
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const lead = await leadsService.updateLead(req.params.id as string, req.body, userId, role);
    res.status(200).json(ApiResponse(200, 'Lead updated successfully', lead));
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    await leadsService.deleteLead(req.params.id as string, userId, role);
    res.status(200).json(ApiResponse(200, 'Lead deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const leads = await leadsService.exportLeads(req.query as any, userId, role);

    if (leads.length === 0) {
      res.status(404).json(ApiResponse(404, 'No leads found to export'));
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Created At'];
    
    const rows = leads.map(lead => [
      lead._id.toString(),
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.email.replace(/"/g, '""')}"`,
      lead.status,
      lead.source,
      lead.createdAt.toISOString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
