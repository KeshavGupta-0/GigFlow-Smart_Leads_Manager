import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ILead } from '../../types/lead.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral'])
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: ILead | null;
  onSubmit: (data: LeadFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, isLoading, onCancel }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        status: initialData.status,
        source: initialData.source,
      });
    } else {
      reset({
        name: '',
        email: '',
        status: 'New',
        source: 'Website',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Jane Doe"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="jane@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
        <select
          {...register('status')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>
        {errors.status && <span className="text-xs text-red-500">{errors.status.message}</span>}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
        <select
          {...register('source')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>
        {errors.source && <span className="text-xs text-red-500">{errors.source.message}</span>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
