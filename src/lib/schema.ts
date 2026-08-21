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
]);

export const employmentTypeEnum = z.enum(['Full Time', 'Internship']);

export const driveSchema = z.object({
  id: z.string().uuid().optional(),
  company_name: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  employment_type: employmentTypeEnum.default('Full Time'),
  ctc: z.string().optional(),
  internship_duration: z.string().optional().nullable(),
  internship_stipend: z.string().optional().nullable(),
  post_internship_package: z.string().optional().nullable(),
  bond: z.boolean().optional().default(false),
  bond_duration: z.string().optional(),
  mail_received_date: z.string().optional().nullable(),
  registration_deadline: z.string().optional().nullable(),
  scheduled_date: z.string().optional().nullable(),
  status: driveStatusEnum.default('Upcoming'),
  notes: z.string().optional().nullable(),
});

export type Drive = z.infer<typeof driveSchema>;
export type DriveStatus = z.infer<typeof driveStatusEnum>;
export type EmploymentType = z.infer<typeof employmentTypeEnum>;
