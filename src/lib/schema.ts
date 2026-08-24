import { z } from 'zod';

export const driveStatusEnum = z.enum([
  'Upcoming',
  'Registered',
  'Rescheduled',
  'Completed',
  'Missed',
  'Rejected',
  'Selected',
  'Registration Error',
  'Cancelled',
]);

export const employmentTypeEnum = z.enum(['Full Time', 'Internship']);

export const driveSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  company_name: z.string().min(1, 'Company name is required').trim(),
  role: z.string().min(1, 'Role is required').trim(),
  employment_type: employmentTypeEnum.nullish().default('Full Time'),
  ctc: z.string().nullable().optional(),
  internship_duration: z.string().nullable().optional(),
  internship_stipend: z.string().nullable().optional(),
  post_internship_package: z.string().nullable().optional(),
  bond: z.boolean().nullable().optional().default(false),
  bond_duration: z.string().nullable().optional(),
  mail_received_date: z.string().nullable().optional(),
  registration_deadline: z.string().nullable().optional(),
  scheduled_date: z.string().nullable().optional(),
  status: driveStatusEnum.nullish().default('Upcoming'),
  notes: z.string().nullable().optional(),
});

export type Drive = z.infer<typeof driveSchema>;
export type DriveStatus = z.infer<typeof driveStatusEnum>;
export type EmploymentType = z.infer<typeof employmentTypeEnum>;
