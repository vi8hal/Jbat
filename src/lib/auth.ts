
'use server';

// REAL Authentication using Drizzle ORM and Neon DB
import "dotenv/config";
import { db } from './db';
import { users, companies } from './db/schema';
import { eq, or } from 'drizzle-orm';
import type { SignUpData } from './types';
import bcrypt from 'bcryptjs';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// NOTE: This does not implement JWTs or cookies yet as it requires a server-side context
// which is complex to manage here. This sets up the database interaction layer.
// The "isLoggedIn" in localStorage remains a client-side mock for UI state.

export async function getCompanies(): Promise<{ id: string; name: string }[]> {
  await delay(50);
  try {
    const allCompanies = await db.select({ id: companies.id, name: companies.name }).from(companies);
    return allCompanies;
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return [];
  }
}

export async function signUp(data: SignUpData): Promise<{ success: boolean; message?: string }> {
  await delay(700);

  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: or(eq(users.email, data.email), eq(users.username, data.username)),
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        return { success: false, message: "An account with this email already exists." };
      }
      return { success: false, message: "This username is already taken." };
    }

    // Find or create company
    let company = await db.query.companies.findFirst({
      where: eq(companies.name, data.companyName),
    });

    if (!company) {
      [company] = await db.insert(companies).values({
        name: data.companyName,
        address: data.companyAddress,
      }).returning();
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create the user
    await db.insert(users).values({
      username: data.username,
      email: data.email,
      hashedPassword: hashedPassword,
      companyId: company.id,
      mobile: data.mobile,
    });
    
    // For this flow, we'll log the user in immediately after signup
    return login(data.email, data.password);

  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, message: "An unexpected error occurred during sign up." };
  }
}

export async function login(identifier: string, password: string): Promise<{ success: boolean; message?: string }> {
  await delay(500);

  try {
    const user = await db.query.users.findFirst({
      where: or(eq(users.username, identifier), eq(users.email, identifier)),
    });

    if (!user) {
      return { success: false, message: "Invalid credentials. Please try again." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      return { success: false, message: "Invalid credentials. Please try again." };
    }

    if (typeof window !== 'undefined') {
      // In a real JWT-based app, you'd receive and store the token here.
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify({ username: user.username, email: user.email }));
    }
    return { success: true };

  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An unexpected error occurred during login." };
  }
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await delay(700);
    // This is a placeholder for a real forgot password flow.
    // In a real app, you would:
    // 1. Check if user exists with db.query.users.findFirst({ where: eq(users.email, email) })
    // 2. Generate a secure, unique password reset token (e.g., using crypto.randomBytes)
    // 3. Hash the token and store it in the user's record in the DB along with an expiry date.
    // 4. Send an email to the user with a link containing the unhashed token.
    console.log(`Password reset requested for ${email}. In a real app, an email would be sent.`);
    
    // We return the same message to prevent user enumeration attacks.
    return { success: true, message: `If an account exists for ${email}, a password reset link has been sent.` };
}
