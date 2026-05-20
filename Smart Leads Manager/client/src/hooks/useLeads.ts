import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService, ICreateLeadPayload, IUpdateLeadPayload } from '../services/leads.service';
import { ILeadQuery } from '../types/lead.types';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

export const useLeads = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<ILeadQuery>({
    page: 1,
    limit: 10,
    sort: 'desc',
    search: '',
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const queryParams = { ...filters, search: debouncedSearch };

  const { data, isLoading } = useQuery({
    queryKey: ['leads', queryParams],
    queryFn: () => leadsService.getLeads(queryParams),
  });

  const setFilter = <K extends keyof ILeadQuery>(key: K, value: ILeadQuery[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, ...(key !== 'page' && { page: 1 }) }));
  };

  const resetFilters = () => {
    setFilters({ page: 1, limit: 10, sort: 'desc', search: '' });
  };

  const createMutation = useMutation({
    mutationFn: (data: ICreateLeadPayload) => leadsService.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully');
    },
    onError: (error: Error) => {
      toast.error((error as any).response?.data?.message || 'Failed to create lead');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateLeadPayload }) => leadsService.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated successfully');
    },
    onError: (error: Error) => {
      toast.error((error as any).response?.data?.message || 'Failed to update lead');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully');
    },
    onError: (error: Error) => {
      toast.error((error as any).response?.data?.message || 'Failed to delete lead');
    }
  });

  return {
    leads: data?.docs || [],
    meta: data ? {
      totalDocs: data.totalDocs,
      limit: data.limit,
      totalPages: data.totalPages,
      page: data.page,
      pagingCounter: data.pagingCounter,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevPage: data.prevPage,
      nextPage: data.nextPage
    } : undefined,
    isLoading,
    filters,
    setFilter,
    resetFilters,
    createLead: createMutation,
    updateLead: updateMutation,
    deleteLead: deleteMutation,
  };
};
