"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExperience = exports.validateEducation = exports.validatePersonalInfo = exports.authMiddleware = exports.verifyOtpSchema = exports.resetPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("./constants");
exports.registerSchema = zod_1.z.object({
    cnic: zod_1.z.string().regex(/^\d{13}$/, 'CNIC must be exactly 13 digits'),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    confirmPassword: zod_1.z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().length(6),
    newPassword: zod_1.z.string().min(6),
    confirmPassword: zod_1.z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
// job validators
const personalInfoSchema = zod_1.z.object({
    jobType: zod_1.z.enum(constants_1.JOB_TYPES),
    feeDepositDate: zod_1.z.string().transform(str => new Date(str)),
    feeAmount: zod_1.z.union([zod_1.z.literal(505), zod_1.z.literal(1005), zod_1.z.literal(1200), zod_1.z.literal('govt-employee')]),
    cnic: zod_1.z.string().regex(/^\d{13}$/, 'CNIC must be exactly 13 digits'),
    applicantName: zod_1.z.string().min(1),
    fatherName: zod_1.z.string().min(1),
    age: zod_1.z.number().min(18).max(60),
    dateOfBirth: zod_1.z.string().transform(str => new Date(str)),
    domicile: zod_1.z.enum(constants_1.DOMICILES),
    gender: zod_1.z.enum(constants_1.GENDERS),
    religion: zod_1.z.enum(constants_1.RELIGIONS),
    possessRequiredQualification: zod_1.z.boolean(),
    transcriptIssuanceDate: zod_1.z.string().optional().transform(str => str ? new Date(str) : undefined),
    isInGovernmentService: zod_1.z.boolean(),
    verificationNumber: zod_1.z.string()
});
const educationSchema = zod_1.z.object({
    level: zod_1.z.enum(constants_1.EDUCATION_LEVELS),
    instituteName: zod_1.z.string().min(1),
    attendedFrom: zod_1.z.string().transform(str => new Date(str)),
    attendedTill: zod_1.z.string().transform(str => new Date(str)),
    boardOrUniversityName: zod_1.z.string().min(1),
    obtainedMarks: zod_1.z.number().min(0),
    totalMarks: zod_1.z.number().min(0),
    percentage: zod_1.z.number().min(0).max(100)
}).refine(data => data.obtainedMarks <= data.totalMarks, {
    message: "Obtained marks cannot be greater than total marks",
    path: ["obtainedMarks"]
});
const experienceSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1),
    fromYear: zod_1.z.string().transform(str => new Date(str)),
    tillYear: zod_1.z.string().transform(str => new Date(str)),
    employmentType: zod_1.z.enum(constants_1.EMPLOYMENT_TYPES)
}).refine(data => data.fromYear <= data.tillYear, {
    message: "From date must be before or equal to till date",
    path: ["fromYear"]
});
const validatePersonalInfo = (data) => {
    return personalInfoSchema.parse(data);
};
exports.validatePersonalInfo = validatePersonalInfo;
const validateEducation = (data) => {
    return educationSchema.parse(data);
};
exports.validateEducation = validateEducation;
const validateExperience = (data) => {
    return experienceSchema.parse(data);
};
exports.validateExperience = validateExperience;
