"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplication = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../utils/constants");
const personalInfoSchema = new mongoose_1.Schema({
    jobType: {
        type: String,
        enum: constants_1.JOB_TYPES,
        required: true
    },
    feeDepositDate: {
        type: Date,
        required: true
    },
    feeAmount: {
        type: mongoose_1.Schema.Types.Mixed,
        enum: constants_1.FEE_AMOUNTS,
        required: true
    },
    cnic: {
        type: String,
        required: true,
        validate: {
            validator: (value) => /^\d{13}$/.test(value),
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
        enum: constants_1.DOMICILES,
        required: true
    },
    gender: {
        type: String,
        enum: constants_1.GENDERS,
        required: true
    },
    religion: {
        type: String,
        enum: constants_1.RELIGIONS,
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
const educationSchema = new mongoose_1.Schema({
    level: {
        type: String,
        enum: constants_1.EDUCATION_LEVELS,
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
const experienceSchema = new mongoose_1.Schema({
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
        enum: constants_1.EMPLOYMENT_TYPES,
        required: true
    }
});
const jobApplicationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            validator: (value) => value.length > 0,
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
exports.JobApplication = mongoose_1.default.model('JobApplication', jobApplicationSchema);
