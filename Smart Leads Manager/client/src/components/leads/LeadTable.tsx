import React from 'react';
import { Edit2, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ILead } from '../../types/lead.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useAuthStore } from '../../store/authStore';
import { canEditLead, canDeleteLead } from '../../utils/permissions';

interface LeadTableProps {
  leads: ILead[];
  isLoading: boolean;
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading, onEdit, onDelete }) => {
  const user = useAuthStore(state => state.user);
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {['Name', 'Email', 'Status', 'Source', 'Created At', 'Actions'].map((h, i) => (
                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No leads found"
        description="Get started by creating a new lead or adjusting your search filters."
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {leads.map((lead) => {
            const canModify = canEditLead(user, lead.createdBy);
            const canDelete = canDeleteLead(user);

            return (
              <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-accent hover:underline">
                  <Link to={`/leads/${lead._id}`}>{lead.name}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><Badge variant={lead.status}>{lead.status}</Badge></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><Badge variant={lead.source}>{lead.source}</Badge></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {canModify && (
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(lead)} aria-label="Edit" className="px-2">
                        <Edit2 size={16} />
                      </Button>
                      {canDelete && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this lead?')) {
                              onDelete(lead._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 px-2"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
