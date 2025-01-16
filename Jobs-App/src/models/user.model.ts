import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';

interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
  cnic: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => /^\d{13}$/.test(value),
      message: 'CNIC must be exactly 13 digits'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUserDocument>('User', userSchema);
