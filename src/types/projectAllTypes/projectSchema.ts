import { z } from 'zod';

export const projectSchema = z.object({
  projectName: z.string().min(1, 'Required'),
  clientName: z.string().min(1, 'Required'),
  projectType: z.enum(['Renovation', 'New Build', 'Extension']),
  description: z.string().optional(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
  estimatedCompletionDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
  contractDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
  contractReference: z.string().min(1, 'Required'),
  contractValue: z.number().positive('Must be positive'),
  estimatedBudget: z.number().optional(),
  overheadCost: z.number().optional(),
  billingCurrency: z.string().min(1, 'Required'),
  projectAddress: z.string().min(1, 'Required'),
  primaryContact: z.string().min(1, 'Required'),
  team: z.array(z.string()).optional(),
  milestones: z.array(z.object({
    name: z.string(),
    date: z.string(),
  })).optional(),
  contractPdf: z.any().optional()
});
