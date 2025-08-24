
'use server';

import 'dotenv/config';
import type { SignUpData, User, Company } from './types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { companies, users } from './db/schema';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';


// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCompanies(): Promise<{ id: string; name: string }[]> {
  await delay(50);
  const companyList = await db.select({ id: companies.id, name: companies.name }).from(companies);
  return companyList;
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
  
  return { success: true, user: newUser, message: "Account created successfully!" };
}

export async function login(identifier: string, password: string): Promise<{ success: boolean; message?: string; user?: Omit<User, 'hashedPassword' | 'password'>, token?: string }> {
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
  
  const { hashedPassword, passwordResetToken, passwordResetExpires, ...userSafe } = user;

  // Instead of returning the user object directly, we can just return success
  // The client will then prompt for OTP. After OTP, we can issue the JWT.
  // For simulation, we return the user object so the client knows who is logging in.
  
  return { success: true, user: userSafe };
}

// This function would be called AFTER successful OTP verification
export async function issueJwt(userId: string): Promise<{ token: string } | { error: string }> {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) {
        return { error: "User not found." };
    }
    const { hashedPassword, passwordResetExpires, passwordResetToken, ...userSafe } = user;
    
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
    console.log(`Password reset requested for ${email}. In a real app, an email would be sent.`);
    // Simulate sending OTP
    console.log(`Simulated OTP for ${email}: 123456`);
    return { success: true, message: `If an account exists for ${email}, a password reset link has been sent.` };
}
