"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_service_1 = require("../services/email.service");
const validation_1 = require("../utils/validation");
const register = async (req, res) => {
    try {
        const validatedData = validation_1.registerSchema.parse(req.body);
        const existingUser = await user_model_1.User.findOne({
            $or: [{ email: validatedData.email }, { cnic: validatedData.cnic }]
        });
        if (existingUser) {
            res.status(400).json({ message: 'Email or CNIC already exists' });
            return;
        }
        const user = new user_model_1.User({
            cnic: validatedData.cnic,
            email: validatedData.email,
            password: validatedData.password
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        res.status(201).json({ token });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validatedData = validation_1.loginSchema.parse(req.body);
        const user = await user_model_1.User.findOne({ email: validatedData.email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isValidPassword = await user.comparePassword(validatedData.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        res.json({ token });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        const validatedData = validation_1.resetPasswordSchema.parse(req.body);
        const user = await user_model_1.User.findOne({ email: validatedData.email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = otpExpiration;
        await user.save();
        await (0, email_service_1.sendResetPasswordEmail)(user.email, otp);
        res.json({ message: 'OTP sent to your email' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const validatedData = validation_1.verifyOtpSchema.parse(req.body);
        const user = await user_model_1.User.findOne({
            email: validatedData.email,
            resetPasswordToken: validatedData.otp,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }
        user.password = validatedData.newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.resetPassword = resetPassword;
