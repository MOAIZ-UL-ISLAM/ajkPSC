import mongoose, { Schema } from 'mongoose';
import { IJobApplication } from '../interfaces/jobApplication.interface';
import { 
  JOB_TYPES, FEE_AMOUNTS, DOMICILES, GENDERS, 
  RELIGIONS, EDUCATION_LEVELS, EMPLOYMENT_TYPES 
} from '../utils/constants';

const personalInfoSchema = new Schema({
  jobType: {
    type: String,
    enum: JOB_TYPES,
    required: true
  },
  feeDepositDate: {
    type: Date,
    required: true
  },
  feeAmount: {
    type: Schema.Types.Mixed,
    enum: FEE_AMOUNTS,
    required: true
  },
  cnic: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^\d{13}$/.test(value),
      message: 'CNIC must be exactly 13 digits'
    }
  },
  applicantName: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 60
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  domicile: {
    type: String,
    enum: DOMICILES,
    required: true
  },
  gender: {
    type: String,
    enum: GENDERS,
    required: true
  },
  religion: {
    type: String,
    enum: RELIGIONS,
    required: true
  },
  possessRequiredQualification: {
    type: Boolean,
    required: true
  },
  transcriptIssuanceDate: {
    type: Date
  },
  isInGovernmentService: {
    type: Boolean,
    required: true
  },
  verificationNumber: {
    type: String,
    required: true
  }
});

const educationSchema = new Schema({
  level: {
    type: String,
    enum: EDUCATION_LEVELS,
    required: true
  },
  instituteName: {
    type: String,
    required: true,
    trim: true
  },
  attendedFrom: {
    type: Date,
    required: true
  },
  attendedTill: {
    type: Date,
    required: true
  },
  boardOrUniversityName: {
    type: String,
    required: true,
    trim: true
  },
  obtainedMarks: {
    type: Number,
    required: true,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

const experienceSchema = new Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  fromYear: {
    type: Date,
    required: true
  },
  tillYear: {
    type: Date,
    required: true
  },
  employmentType: {
    type: String,
    enum: EMPLOYMENT_TYPES,
    required: true
  }
});

const jobApplicationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    type: personalInfoSchema,
    required: true
  },
  education: {
    type: [educationSchema],
    required: true,
    validate: {
      validator: (value: any[]) => value.length > 0,
      message: 'At least one education record is required'
    }
  },
  experience: {
    type: [experienceSchema],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under-review', 'approved', 'rejected'],
    default: 'draft'
  }
}, {
  timestamps: true
});

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
