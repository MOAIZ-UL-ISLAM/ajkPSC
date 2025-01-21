"use strict";
// import { Request, Response } from 'express';
// import { JobApplication } from '../models/jobApplication.model';
// import { validatePersonalInfo, validateEducation, validateExperience } from '../utils/validation';
// import { AuthRequest } from '../middleware/auth.middleware';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplication = exports.submitApplication = exports.addExperience = exports.addEducation = exports.createPersonalInfo = void 0;
const jobApplication_model_1 = require("../models/jobApplication.model");
const validation_1 = require("../utils/validation");
const createPersonalInfo = async (req, res) => {
    try {
        console.log("Raw Request Body:", req.body);
        const userId = req.user?.userId;
        const personalInfo = (0, validation_1.validatePersonalInfo)(req.body);
        // Create a new application document without validation
        const [application] = await jobApplication_model_1.JobApplication.create([{
                userId,
                personalInfo,
                education: [], // Initialize empty education array
                status: 'draft'
            }], { validateBeforeSave: false }); // Skip validation on initial creation
        res.status(201).json({
            message: 'Personal information saved successfully',
            applicationId: application._id
        });
    }
    catch (error) {
        console.error('Error in createPersonalInfo:', error);
        res.status(400).json({
            message: error.message,
            details: error.errors ? Object.values(error.errors).map((err) => err.message) : undefined
        });
    }
};
exports.createPersonalInfo = createPersonalInfo;
const addEducation = async (req, res) => {
    try {
        console.log("education Request Body:", req.body);
        const { applicationId } = req.params;
        console.log(applicationId);
        const userId = req.user?.userId;
        const educationData = (0, validation_1.validateEducation)(req.body);
        const application = await jobApplication_model_1.JobApplication.findOne({ _id: applicationId });
        console.log(application);
        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        application.education.push(educationData);
        // Run validation only on the education array
        const validationError = application.validateSync('education');
        if (validationError) {
            res.status(400).json({
                message: 'Validation failed',
                details: Object.values(validationError.errors).map(err => err.message)
            });
            return;
        }
        await application.save();
        res.json({
            message: 'Education information added successfully',
            education: application.education
        });
    }
    catch (error) {
        console.error('Error in addEducation:', error);
        res.status(400).json({
            message: error.message,
            details: error.errors ? Object.values(error.errors).map((err) => err.message) : undefined
        });
    }
};
exports.addEducation = addEducation;
const addExperience = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const userId = req.user?.userId;
        const experienceData = (0, validation_1.validateExperience)(req.body);
        const application = await jobApplication_model_1.JobApplication.findOne({ _id: applicationId });
        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        application.experience.push(experienceData);
        await application.save();
        res.json({
            message: 'Experience information added successfully',
            experience: application.experience
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.addExperience = addExperience;
const submitApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const userId = req.user?.userId;
        const application = await jobApplication_model_1.JobApplication.findOne({ _id: applicationId });
        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        // Run full validation before submission
        const validationError = application.validateSync();
        if (validationError) {
            res.status(400).json({
                message: 'Application validation failed',
                details: Object.values(validationError.errors).map(err => err.message)
            });
            return;
        }
        application.status = 'submitted';
        await application.save();
        res.json({
            message: 'Application submitted successfully',
            application
        });
    }
    catch (error) {
        console.error('Error in submitApplication:', error);
        res.status(400).json({
            message: error.message,
            details: error.errors ? Object.values(error.errors).map((err) => err.message) : undefined
        });
    }
};
exports.submitApplication = submitApplication;
const getApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const userId = req.user?.userId;
        const application = await jobApplication_model_1.JobApplication.findOne({ _id: applicationId });
        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        res.json(application);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getApplication = getApplication;
