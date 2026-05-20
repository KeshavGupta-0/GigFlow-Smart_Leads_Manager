import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { leadsService } from '../services/leads.service';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import { useLeads } from '../hooks/useLeads';
import { ArrowLeft, Calendar, Mail, User, Shield, Edit2 } from 'lucide-react';
import { canEditLead } from '../utils/permissions';
import { useAuthStore } from '../store/authStore';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const { updateLead } = useLeads();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsService.getLeadById(id!),
    enabled: !!id,
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="text-center py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lead Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The lead you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  const canEdit = canEditLead(user, lead.createdBy);
  const creatorName = typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown';

  return (
    <ErrorBoundary>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-2 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Leads</span>
          </Link>
          {canEdit && (
            <Button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2">
              <Edit2 size={16} />
              <span>Edit Lead</span>
            </Button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                {lead.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <Badge variant={lead.status}>{lead.status}</Badge>
                  <Badge variant={lead.source}>{lead.source}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                  <Mail size={16} /> Contact Information
                </h3>
                <p className="text-base text-gray-900 dark:text-white font-medium break-all">{lead.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                  <User size={16} /> Assigned To
                </h3>
                <p className="text-base text-gray-900 dark:text-white">{creatorName}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                  <Calendar size={16} /> Timestamps
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900 dark:text-gray-200">
                    <span className="text-gray-500 dark:text-gray-400 w-20 inline-block">Created:</span>
                    {new Date(lead.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-200">
                    <span className="text-gray-500 dark:text-gray-400 w-20 inline-block">Updated:</span>
                    {new Date(lead.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                  <Shield size={16} /> System ID
                </h3>
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400 break-all">{lead._id}</p>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Lead">
          <LeadForm 
            initialData={lead} 
            onSubmit={(data) => {
              updateLead.mutate({ id: lead._id, data }, {
                onSuccess: () => setIsEditModalOpen(false)
              });
            }} 
            isLoading={updateLead.isPending} 
            onCancel={() => setIsEditModalOpen(false)} 
          />
        </Modal>
      </div>
    </ErrorBoundary>
  );
};
