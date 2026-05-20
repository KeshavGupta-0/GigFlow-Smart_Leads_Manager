import { CreateLeadBody, UpdateLeadBody, LeadQuery } from '../schemas/lead.schemas';

export interface ICreateLeadBody extends CreateLeadBody {}
export interface IUpdateLeadBody extends UpdateLeadBody {}
export interface ILeadQuery extends LeadQuery {}

export interface ILeadResponse {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
