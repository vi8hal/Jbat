
'use server';

// This file now simulates a database with mock data.
// In a real application, this would interact with your Turso DB.
import "dotenv/config";
import type { SignUpData, User, Company } from './types';
import bcrypt from 'bcryptjs';
import { mockUsers, mockCompanies } from './blogData'; // Import from centralized mock data

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCompanies(): Promise<{ id: string; name: string }[]> {
  await delay(50);
  return mockCompanies.map(c => ({ id: c.id, name: c.name }));
}

export async function signUp(data: SignUpData): Promise<{ success: boolean; message?: string; user?: User }> {
  await delay(700);

  const existingUser = mockUsers.find(
    u => u.email === data.email || u.username === data.username
  );

  if (existingUser) {
    if (existingUser.email === data.email) {
      return { success: false, message: "An account with this email already exists." };
    }
    return { success: false, message: "This username is already taken." };
  }

  let company = mockCompanies.find(c => c.name.toLowerCase() === data.companyName.toLowerCase());
  if (!company) {
    company = {
      id: `company-${Date.now()}`,
      name: data.companyName,
      address: data.companyAddress,
    };
    mockCompanies.push(company);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser: User = {
    id: `user-${Date.now()}`,
    username: data.username,
    email: data.email,
    hashedPassword: hashedPassword,
    companyId: company.id,
    mobile: data.mobile,
  };

  mockUsers.push(newUser);
  
  return { success: true, user: newUser, message: "Account created successfully!" };
}

export async function login(identifier: string, password: string): Promise<{ success: boolean; message?: string; user?: Omit<User, 'hashedPassword' | 'password'> }> {
  await delay(500);

  const user = mockUsers.find(
    u => u.username === identifier || u.email === identifier
  );

  if (!user || !user.hashedPassword) {
    return { success: false, message: "Invalid credentials. Please try again." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

  if (!isPasswordValid) {
    return { success: false, message: "Invalid credentials. Please try again." };
  }
  
  const { hashedPassword, password: plainPassword, ...userSafe } = user;

  return { success: true, user: userSafe };
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await delay(700);
    console.log(`Password reset requested for ${email}. In a real app, an email would be sent.`);
    return { success: true, message: `If an account exists for ${email}, a password reset link has been sent.` };
}
