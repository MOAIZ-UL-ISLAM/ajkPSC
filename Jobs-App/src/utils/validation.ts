import { z } from 'zod';
import { 
  JOB_TYPES, FEE_AMOUNTS, DOMICILES, GENDERS, 
  RELIGIONS, EDUCATION_LEVELS, EMPLOYMENT_TYPES 
} from './constants';
import { IPersonalInfo, IEducation, IExperience } from '../interfaces/jobApplication.interface';


export const registerSchema = z.object({
  cnic: z.string().regex(/^\d{13}$/, 'CNIC must be exactly 13 digits'),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const resetPasswordSchema = z.object({
  email: z.string().email()
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


// job validators

const personalInfoSchema = z.object({
  jobType: z.enum(JOB_TYPES),
  feeDepositDate: z.string().transform(str => new Date(str)),
  feeAmount: z.union([z.literal(505), z.literal(1005), z.literal(1200), z.literal('govt-employee')]),
  cnic: z.string().regex(/^\d{13}$/, 'CNIC must be exactly 13 digits'),
  applicantName: z.string().min(1),
  fatherName: z.string().min(1),
  age: z.number().min(18).max(60),
  dateOfBirth: z.string().transform(str => new Date(str)),
  domicile: z.enum(DOMICILES),
  gender: z.enum(GENDERS),
  religion: z.enum(RELIGIONS),
  possessRequiredQualification: z.boolean(),
  transcriptIssuanceDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
  isInGovernmentService: z.boolean(),
  verificationNumber: z.string()
});

const educationSchema = z.object({
  level: z.enum(EDUCATION_LEVELS),
  instituteName: z.string().min(1),
  attendedFrom: z.string().transform(str => new Date(str)),
  attendedTill: z.string().transform(str => new Date(str)),
  boardOrUniversityName: z.string().min(1),
  obtainedMarks: z.number().min(0),
  totalMarks: z.number().min(0),
  percentage: z.number().min(0).max(100)
}).refine(data => data.obtainedMarks <= data.totalMarks, {
  message: "Obtained marks cannot be greater than total marks",
  path: ["obtainedMarks"]
});

const experienceSchema = z.object({
  companyName: z.string().min(1),
  fromYear: z.string().transform(str => new Date(str)),
  tillYear: z.string().transform(str => new Date(str)),
  employmentType: z.enum(EMPLOYMENT_TYPES)
}).refine(data => data.fromYear <= data.tillYear, {
  message: "From date must be before or equal to till date",
  path: ["fromYear"]
});

export const validatePersonalInfo = (data: unknown): IPersonalInfo => {
  return personalInfoSchema.parse(data);
};

export const validateEducation = (data: unknown): IEducation => {
  return educationSchema.parse(data);
};

export const validateExperience = (data: unknown): IExperience => { 
  return experienceSchema.parse(data);
};
