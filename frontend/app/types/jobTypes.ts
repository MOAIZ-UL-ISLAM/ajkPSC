type JobType = 'clerk' | 'programmer' | 'qasid';
type FeeAmount = 505 | 1005 | 1200 | 'govt-employee';
type Domicile = 'Muzaffarabad' | 'kotli' | 'mirpur';
type Gender = 'male' | 'female' | 'other';
type Religion = 'Islam' | 'Christianity' | 'Hinduism' | 'Other';

interface IPersonalInfo {
  jobType: JobType;
  feeDepositDate: Date;
  feeAmount: FeeAmount;
  cnic: string;
  applicantName: string;
  fatherName: string;
  age: number;
  dateOfBirth: Date;
  domicile: Domicile;
  gender: Gender;
  religion: Religion;
  possessRequiredQualification: boolean;
  transcriptIssuanceDate?: Date;
  isInGovernmentService: boolean;
  verificationNumber: string;
}

type EducationLevel = 'matric' | 'intermediate' | 'BS' | 'Mphil' | 'PhD';

interface IEducation {
  level: EducationLevel;
  instituteName: string;
  attendedFrom: Date;
  attendedTill: Date;
  boardOrUniversityName: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
}

type EmploymentType = 'govt' | 'semi govt' | 'private';

interface IExperience {
  companyName: string;
  fromYear: Date;
  tillYear: Date;
  employmentType: EmploymentType;
}

type JobApplicationStatus = 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';

interface IJobApplication extends Document {
  userId: string;
  personalInfo: IPersonalInfo;
  education: IEducation[];
  experience: IExperience[];
  status: JobApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}
