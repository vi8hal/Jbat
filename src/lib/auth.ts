// MOCK Authentication - NOT FOR PRODUCTION
// This file simulates a basic multi-user, multi-company authentication system.

import type { User, Company, SignUpData } from './types';

// --- MOCK DATABASE ---
let mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@jbat.com',
    password: 'password', // Never store plaintext passwords
    companyId: 'comp-1',
    mobile: '123-456-7890',
  }
];

let mockCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'JBat Inc.',
    address: '123 AI Lane, Tech City',
  }
];
// --- END MOCK DATABASE ---

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCompanies(): Promise<Company[]> {
  await delay(50);
  return [...mockCompanies];
}


export async function signUp(data: SignUpData): Promise<{ success: boolean; message?: string }> {
  await delay(700);
  if (mockUsers.some(u => u.email === data.email)) {
    return { success: false, message: "An account with this email already exists." };
  }
  if (mockUsers.some(u => u.username === data.username)) {
    return { success: false, message: "This username is already taken." };
  }

  // Create or find company
  let company = mockCompanies.find(c => c.name.toLowerCase() === data.companyName.toLowerCase());
  if (!company) {
    company = {
      id: `comp-${Date.now()}`,
      name: data.companyName,
      address: data.companyAddress,
    };
    mockCompanies.push(company);
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    username: data.username,
    email: data.email,
    password: data.password, // In a real app, HASH this password
    companyId: company.id,
    mobile: data.mobile,
  };
  mockUsers.push(newUser);

  // For this mock, we'll log the user in immediately after signup
  return login(data.email, data.password);
}


export async function login(identifier: string, password: string): Promise<{ success: boolean; message?: string }> {
  await delay(500);

  const user = mockUsers.find(
    u => (u.username === identifier || u.email === identifier) && u.password === password
  );

  if (user) {
    if (typeof window !== 'undefined') {
      // In a real JWT-based app, you'd store the token here.
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify({ username: user.username, email: user.email }));
    }
    return { success: true };
  }
  return { success: false, message: "Invalid credentials. Please try again." };
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await delay(700);

    const userExists = mockUsers.some(u => u.email === email);

    if (userExists) {
        // In a real app, you would generate a reset token and send an email here.
        // For this mock, we just return a success message.
        return { success: true, message: `If an account exists for ${email}, a password reset link has been sent.` };
    } else {
        // We return the same message to prevent user enumeration attacks.
        return { success: true, message: `If an account exists for ${email}, a password reset link has been sent.` };
    }
}


export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  }
}

export function checkAuth(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("isLoggedIn") === "true";
  }
  return false;
}
