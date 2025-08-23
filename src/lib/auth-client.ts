
'use client';

// This file contains functions that are safe to run on the client (in the browser).

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
