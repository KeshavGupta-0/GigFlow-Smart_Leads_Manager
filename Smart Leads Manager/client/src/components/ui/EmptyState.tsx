import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
