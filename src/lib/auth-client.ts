
'use client';
import type { User } from './types';
import { jwtDecode } from 'jwt-decode';


// This file contains functions that are safe to run on the client (in the browser).

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
}

export function checkAuth(): Omit<User, 'hashedPassword' | 'password'> | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        // In a real app, you would verify the token's signature on the server.
        // For the client, we can decode it to get user info for the UI.
        const decoded: User = jwtDecode(token);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            // Ensure the user from token matches stored user
            if (parsedUser.id === decoded.id) {
                return parsedUser;
            }
        }
        // If stored user doesn't match or doesn't exist, rely on token data
        return decoded;
      } catch (e) {
        console.error("Failed to decode token", e);
        logout(); // Token is invalid, so log out
        return null;
      }
    }
  }
  return null;
}

export function saveAuth(token: string, user: Omit<User, 'hashedPassword' | 'password'>): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem("authToken", token);
        // For convenience, we can also save the user object
        localStorage.setItem("user", JSON.stringify(user));
    }
}

// Added for getting the token for API requests
export function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("authToken");
    }
    return null;
}
