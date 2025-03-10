// lib/schemas.ts
import { z } from 'zod';
import { 
  JOB_TYPES, 
  FEE_AMOUNTS, 
  DOMICILES, 
  GENDERS, 
  RELIGIONS, 
  EDUCATION_LEVELS,
  EMPLOYMENT_TYPES 
} from '@/utils/contants';

export const personalInfoSchema = z.object({
  jobType: z.enum(JOB_TYPES),
  feeDepositDate: z.string().transform((str) => new Date(str)),
  feeAmount: z.union([z.number(), z.literal('govt-employee')]),
  cnic: z.string().length(13).regex(/^\d+$/),
  applicantName: z.string().min(2),
  fatherName: z.string().min(2),
  age: z.number().min(18).max(60),
  dateOfBirth: z.string().transform((str) => new Date(str)),
  domicile: z.enum(DOMICILES),
  gender: z.enum(GENDERS),
  religion: z.enum(RELIGIONS),
  possessRequiredQualification: z.boolean(),
  transcriptIssuanceDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  isInGovernmentService: z.boolean(),
  verificationNumber: z.string()
});

export const educationSchema = z.object({
  level: z.enum(EDUCATION_LEVELS),
  instituteName: z.string().min(2),
  attendedFrom: z.string().transform((str) => new Date(str)),
  attendedTill: z.string().transform((str) => new Date(str)),
  boardOrUniversityName: z.string().min(2),
  obtainedMarks: z.preprocess((val) => Number(val), z.number().min(0)),
  totalMarks: z.preprocess((val) => Number(val), z.number().min(1)),  
  percentage: z.number().min(0).max(100)
});

export const experienceSchema = z.object({
  companyName: z.string().min(2),
  fromYear: z.string().transform((str) => new Date(str)),
  tillYear: z.string().transform((str) => new Date(str)),
  employmentType: z.enum(EMPLOYMENT_TYPES)
});