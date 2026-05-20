import { z } from 'zod';

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
    source: z.enum(['Website', 'Instagram', 'Referral'])
  })
});

export const updateLeadSchema = z.object({
  body: createLeadSchema.shape.body.partial()
});

export const leadQuerySchema = z.object({
  query: z.object({
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
    source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
    search: z.string().optional(),
    sort: z.enum(['asc', 'desc']).default('desc'),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10)
  })
});

export type CreateLeadBody = z.infer<typeof createLeadSchema>['body'];
export type UpdateLeadBody = z.infer<typeof updateLeadSchema>['body'];
export type LeadQuery = z.infer<typeof leadQuerySchema>['query'];
