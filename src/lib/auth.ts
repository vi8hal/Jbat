
'use server';

import 'dotenv/config';
import type { SignUpData, User, Company } from './types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { companies, users } from './db/schema';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { sendVerificationEmail } from './email';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper function to set OTP on a user record
async function setOtpForUser(userId: string): Promise<string> {
  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  await db.update(users).set({
    otp,
    otpExpires,
  }).where(eq(users.id, userId));

  return otp;
}


export async function signUp(data: SignUpData): Promise<{ success: boolean; message?: string; user?: Omit<User, 'hashedPassword' | 'password'> }> {
  await delay(700);

  const existingUser = await db.query.users.findFirst({
    where: (users, { or, eq }) => or(eq(users.email, data.email), eq(users.username, data.username)),
  });


  if (existingUser) {
    if (existingUser.email === data.email) {
      return { success: false, message: "An account with this email already exists." };
    }
    return { success: false, message: "This username is already taken." };
  }

  let company = await db.query.companies.findFirst({
    where: (companies, { eq }) => eq(companies.name, data.companyName)
  });

  if (!company) {
    const [newCompany] = await db.insert(companies).values({
      name: data.companyName,
      address: data.companyAddress,
    }).returning();
    company = newCompany;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const [newUser] = await db.insert(users).values({
    username: data.username,
    email: data.email,
    hashedPassword: hashedPassword,
    companyId: company.id,
    mobile: data.mobile,
  }).returning({
      id: users.id,
      username: users.username,
      email: users.email,
      companyId: users.companyId,
      mobile: users.mobile,
  });

  const otp = await setOtpForUser(newUser.id);
  await sendVerificationEmail(newUser.email, otp);
  
  return { success: true, user: newUser, message: "Account created successfully! Please check your email for an OTP." };
}

export async function login(identifier: string, password: string): Promise<{ success: boolean; message?: string; user?: Omit<User, 'hashedPassword' | 'password'> }> {
  await delay(500);

  const user = await db.query.users.findFirst({
    where: (users, { or, eq }) => or(eq(users.email, identifier), eq(users.username, identifier)),
  });

  if (!user || !user.hashedPassword) {
    return { success: false, message: "Invalid credentials. Please try again." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

  if (!isPasswordValid) {
    return { success: false, message: "Invalid credentials. Please try again." };
  }
  
  const { hashedPassword, passwordResetToken, passwordResetExpires, otp, otpExpires, ...userSafe } = user;

  const newOtp = await setOtpForUser(user.id);
  await sendVerificationEmail(user.email, newOtp);

  return { success: true, user: userSafe, message: "OTP sent to your email." };
}

export async function verifyOtp(userId: string, otp: string): Promise<{ success: boolean; message: string; token?: string }> {
  await delay(500);
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user || !user.otp || !user.otpExpires) {
    return { success: false, message: "Invalid request. Please try signing in again." };
  }

  if (user.otpExpires < new Date()) {
    return { success: false, message: "Your OTP has expired. Please try signing in again." };
  }

  if (user.otp !== otp) {
    return { success: false, message: "Invalid OTP. Please check the code and try again." };
  }

  // Clear OTP fields after successful verification
  await db.update(users).set({
    otp: null,
    otpExpires: null,
  }).where(eq(users.id, user.id));

  // Issue JWT
  const jwtResult = await issueJwt(user.id);
  if ('error' in jwtResult) {
    return { success: false, message: jwtResult.error };
  }

  return { success: true, message: "Verification successful!", token: jwtResult.token };
}

// This function would be called AFTER successful OTP verification
export async function issueJwt(userId: string): Promise<{ token: string } | { error: string }> {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) {
        return { error: "User not found." };
    }
    const { hashedPassword, passwordResetExpires, passwordResetToken, otp, otpExpires, ...userSafe } = user;
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT_SECRET is not set in environment variables.");
        throw new Error("Server configuration error: JWT secret is missing.");
    }

    const token = jwt.sign(userSafe, secret, { expiresIn: '1h' });

    return { token };
}


export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await delay(700);
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });

    if (!user) {
      // We don't want to reveal if an email exists or not
      return { success: true, message: `If an account exists for ${email}, an OTP has been sent.` };
    }

    const otp = await setOtpForUser(user.id);
    await sendVerificationEmail(user.email, otp);
    
    return { success: true, message: `If an account exists for ${email}, an OTP has been sent.` };
}
