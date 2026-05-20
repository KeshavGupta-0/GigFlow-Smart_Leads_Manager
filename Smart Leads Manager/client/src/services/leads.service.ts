import { api } from './api';
import { ILead, ILeadQuery, LeadStatus, LeadSource } from '../types/lead.types';
import { ApiResponse, PaginatedResponse } from '../types/api.types';

export interface ICreateLeadPayload {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface IUpdateLeadPayload extends Partial<ICreateLeadPayload> {}

export const leadsService = {
  getLeads: async (params?: ILeadQuery) => {
    const response = await api.get<ApiResponse<PaginatedResponse<ILead>['data']>>('/leads', { params });
    return response.data.data;
  },
  getLeadById: async (id: string) => {
    const response = await api.get<ApiResponse<ILead>>(`/leads/${id}`);
    return response.data.data;
  },
  createLead: async (data: ICreateLeadPayload) => {
    const response = await api.post<ApiResponse<ILead>>('/leads', data);
    return response.data.data;
  },
  updateLead: async (id: string, data: IUpdateLeadPayload) => {
    const response = await api.put<ApiResponse<ILead>>(`/leads/${id}`, data);
    return response.data.data;
  },
  deleteLead: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return response.data;
  },
  exportLeads: async () => {
    const response = await api.get('/leads/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
