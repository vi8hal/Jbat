
'use server';

// This file now simulates a database with mock data.
// In a real application, this would interact with your Turso DB.
import "dotenv/config";
import type { SignUpData, User, Company } from './types';
import bcrypt from 'bcryptjs';

// --- MOCK DATABASE ---

export const mockCompanies: Company[] = [
  { id: 'company-01', name: 'Innovate Inc.', address: '123 Tech Ave' },
  { id: 'company-02', name: 'Quantum Finance', address: '456 Wall St' },
  { id: 'company-03', name: 'Vitality Health', address: '789 Wellness Blvd' },
  { id: 'company-04', name: 'Eco Solutions', address: '101 Green Way' },
  { id: 'company-05', name: 'RetailNext', address: '212 Market St' },
  { id: 'company-06', name: 'Wanderlust Travels', address: '303 Adventure Rd' },
  { id: 'company-07', name: 'Gourmet Group', address: '404 Eatery Ln' },
  { id: 'company-08', name: 'AutoMotion', address: '505 Piston Dr' },
  { id: 'company-09', name: 'Homestead Realty', address: '606 Property Plz' },
  { id: 'company-10', name: 'Media Stream', address: '707 Broadcast Bld' },
];

export let mockUsers: User[] = [
  { id: 'user-01', username: 'tech_writer', email: 'tech@innovate.com', password: 'password123', companyId: 'company-01', mobile: '111-222-3333' },
  { id: 'user-02', username: 'finance_guru', email: 'fin@quantum.com', password: 'password123', companyId: 'company-02', mobile: '222-333-4444' },
  { id: 'user-03', username: 'health_expert', email: 'health@vitality.com', password: 'password123', companyId: 'company-03', mobile: '333-444-5555' },
  { id: 'user-04', username: 'green_advocate', email: 'eco@solutions.com', password: 'password123', companyId: 'company-04', mobile: '444-555-6666' },
  { id: 'user-05', username: 'retail_innovator', email: 'shop@retailnext.com', password: 'password123', companyId: 'company-05', mobile: '555-666-7777' },
  { id: 'user-06', username: 'travel_blogger', email: 'go@wanderlust.com', password: 'password123', companyId: 'company-06', mobile: '666-777-8888' },
  { id: 'user-07', username: 'food_critic', email: 'eat@gourmet.com', password: 'password123', companyId: 'company-07', mobile: '777-888-9999' },
  { id: 'user-08', username: 'auto_enthusiast', email: 'drive@automotion.com', password: 'password123', companyId: 'company-08', mobile: '888-999-0000' },
  { id: 'user-09', username: 'realestate_pro', email: 'sell@homestead.com', password: 'password123', companyId: 'company-09', mobile: '999-000-1111' },
  { id: 'user-10', username: 'media_maven', email: 'watch@mediastream.com', password: 'password123', companyId: 'company-10', mobile: '000-111-2222' },
];

// Hash passwords for the mock users
(async () => {
    const hashedUsers = await Promise.all(mockUsers.map(async (user) => {
        if (user.password) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, hashedPassword };
        }
        return user;
    }));
    mockUsers = hashedUsers;
})();

// --- MOCK API FUNCTIONS ---

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
