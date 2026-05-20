import React, { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { Pagination } from '../components/leads/Pagination';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import { Button } from '../components/ui/Button';
import { Download, Plus } from 'lucide-react';
import { ILead } from '../types/lead.types';
import { useAuthStore } from '../store/authStore';
import { leadsService } from '../services/leads.service';
import toast from 'react-hot-toast';

import { canExportLeads } from '../utils/permissions';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

export const DashboardPage: React.FC = () => {
  const { 
    leads, 
    meta, 
    isLoading, 
    filters, 
    setFilter, 
    resetFilters,
    createLead,
    updateLead,
    deleteLead
  } = useLeads();
  
  const user = useAuthStore(state => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<ILead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleOpenModal = (lead?: ILead) => {
    setEditingLead(lead || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingLead(null), 200); 
  };

  const handleFormSubmit = async (data: any) => {
    if (editingLead) {
      updateLead.mutate({ id: editingLead._id, data }, {
        onSuccess: handleCloseModal
      });
    } else {
      createLead.mutate(data, {
        onSuccess: handleCloseModal
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await leadsService.exportLeads();
      toast.success('Export downloaded successfully');
    } catch (error) {
      toast.error('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  const isAdmin = canExportLeads(user);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GigFlow Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and track your gigs and workflow</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button variant="secondary" onClick={handleExport} isLoading={isExporting} className="flex items-center gap-2">
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          )}
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>

      <LeadFilters 
        filters={filters} 
        setFilter={setFilter} 
        resetFilters={resetFilters} 
      />

      <LeadTable 
        leads={leads} 
        isLoading={isLoading} 
        onEdit={handleOpenModal}
        onDelete={(id) => deleteLead.mutate(id)}
      />

      {meta && (
        <Pagination 
          page={meta.page} 
          totalPages={meta.totalPages} 
          onPageChange={(page) => setFilter('page', page)} 
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingLead ? "Edit Lead" : "Add New Lead"}
      >
        <LeadForm 
          initialData={editingLead} 
          onSubmit={handleFormSubmit} 
          isLoading={createLead.isPending || updateLead.isPending} 
          onCancel={handleCloseModal} 
        />
      </Modal>
      </div>
    </ErrorBoundary>
  );
};
