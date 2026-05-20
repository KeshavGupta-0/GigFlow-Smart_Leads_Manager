import { IUser } from '../types/auth.types';

export const canDeleteLead = (user: IUser | null): boolean => {
  if (!user) return false;
  return user.role === 'admin';
};

export const canExportLeads = (user: IUser | null): boolean => {
  if (!user) return false;
  return user.role === 'admin';
};

export const canSeeAllLeads = (user: IUser | null): boolean => {
  if (!user) return false;
  return user.role === 'admin';
};

export const canEditLead = (user: IUser | null, createdBy: string | { _id: string } | null | undefined): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (!createdBy) return false;
  
  const creatorId = typeof createdBy === 'object' && createdBy !== null && '_id' in createdBy 
    ? createdBy._id 
    : createdBy;
  return user._id === creatorId;
};
