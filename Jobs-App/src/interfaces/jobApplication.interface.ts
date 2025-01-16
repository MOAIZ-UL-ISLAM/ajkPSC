import { Document } from 'mongoose';
import { 
    JOB_TYPES, FEE_AMOUNTS, DOMICILES, GENDERS, 
    RELIGIONS, EDUCATION_LEVELS, EMPLOYMENT_TYPES 
  } from '../utils/constants';

export interface IPersonalInfo {
  jobType: typeof JOB_TYPES[number];
  feeDepositDate: Date;
  feeAmount: typeof FEE_AMOUNTS[number];
  cnic: string;
  applicantName: string;
  fatherName: string;
  age: number;
  dateOfBirth: Date;
  domicile: typeof DOMICILES[number];
  gender: typeof GENDERS[number];
  religion: typeof RELIGIONS[number];
  possessRequiredQualification: boolean;
  transcriptIssuanceDate?: Date;
  isInGovernmentService: boolean;
  verificationNumber: string;
}

export interface IEducation {
  level: typeof EDUCATION_LEVELS[number];
  instituteName: string;
  attendedFrom: Date;
  attendedTill: Date;
  boardOrUniversityName: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
}

export interface IExperience {
  companyName: string;
  fromYear: Date;
  tillYear: Date;
  employmentType: typeof EMPLOYMENT_TYPES[number];
}

export interface IJobApplication extends Document {
  userId: string;
  personalInfo: IPersonalInfo;
  education: IEducation[];
  experience: IExperience[];
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
