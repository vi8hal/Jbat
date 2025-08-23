
'use client';
import type { User } from './types';


// This file contains functions that are safe to run on the client (in the browser).

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("user");
  }
}

export function checkAuth(): Omit<User, 'hashedPassword' | 'password'> | null {
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem("user");
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            return null;
        }
    }
  }
  return null;
}

export function saveAuth(user: Omit<User, 'hashedPassword' | 'password'>): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(user));
    }
}
