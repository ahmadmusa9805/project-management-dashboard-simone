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
  contractPdf: z.any().optional(),
   status: z.enum(['ongoing', 'completed', 'pending', 'cancelled']).optional(),
});


 export type projectType = {
  id:number;
  projectName: string;
  clientName: string;
  projectType: string;
  primaryContact: string;
  projectAddress: string;
  description: string;
  
  contract: {
    reference: string;
    date: string; // ISO date string
    pdf: {
      uid: string;
      name: string;
    };
    value: number;
    currency: string;
    estimatedBudget: number;
    overheadCost: number;
  };

  timeline: {
    startDate: string; // ISO date string
    estimatedCompletionDate: string; // ISO date string
    status: string;
  };

  milestones: {
    name: string;
    date: string; // ISO date string
  }[];

  team: any[]; // You can replace `any` with more specific types if you have team member structure
};


