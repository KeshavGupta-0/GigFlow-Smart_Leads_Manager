import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Website' | 'Instagram' | 'Referral' | 'admin' | 'sales_user' | string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant }) => {
  let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  switch (variant) {
    case 'New':
      colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      break;
    case 'Contacted':
      colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      break;
    case 'Qualified':
      colorClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      break;
    case 'Lost':
      colorClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      break;
    case 'Website':
    case 'Instagram':
    case 'Referral':
      colorClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      break;
    case 'admin':
      colorClass = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      break;
    case 'sales_user':
      colorClass = 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {children}
    </span>
  );
};
