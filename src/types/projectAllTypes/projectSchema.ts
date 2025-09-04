import { z } from 'zod';

export const projectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  clientName: z.string().optional(),
  clientEmail: z.string().email('Invalid email').optional(),
  reference: z.string().min(1, 'Contract reference is required'),
  address: z.string().min(1, 'Project address is required'),
  contact: z.string().min(1, 'Primary contact is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),

  startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid start date'),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid end date'),

  contractFile: z.any().optional(),
  value: z.number().min(1, 'Project value must be positive'),

  status: z.enum(['ongoing', 'completed', 'pending', 'cancelled']).optional(),

  team: z.array(z.string()).optional(),

  milestones: z
    .array(
      z.object({
        name: z.string().min(1),
        date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid milestone date'),
      })
    )
    .optional(),
});

export type ProjectForm = z.infer<typeof projectSchema>;
