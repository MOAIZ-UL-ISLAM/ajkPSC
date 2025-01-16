import { Request, Response } from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail } from '../services/email.service';
import { registerSchema, loginSchema, resetPasswordSchema, verifyOtpSchema } from '../utils/validation';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    const existingUser = await User.findOne({ 
      $or: [{ email: validatedData.email }, { cnic: validatedData.cnic }] 
    });
    
    if (existingUser) {
      res.status(400).json({ message: 'Email or CNIC already exists' });
      return;
    }

    const user = new User({
      cnic: validatedData.cnic,
      email: validatedData.email,
      password: validatedData.password
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({ token });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await user.comparePassword(validatedData.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({ token });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordToken = otp;
    user.resetPasswordExpires = otpExpiration;
    await user.save();

    await sendResetPasswordEmail(user.email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = verifyOtpSchema.parse(req.body);
    
    const user = await User.findOne({
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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};