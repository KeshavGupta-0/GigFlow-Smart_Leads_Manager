export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: { _id: string, name: string, email: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface ILeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
