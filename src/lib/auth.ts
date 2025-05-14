// MOCK Authentication - NOT FOR PRODUCTION
// In a real app, use Firebase Auth, NextAuth.js, or another secure solution.

const MOCK_USER = {
  username: "admin",
  password: "password", // Never store passwords like this in a real app
};

export async function login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  if (username === MOCK_USER.username && password === MOCK_USER.password) {
    if (typeof window !== 'undefined') {
      localStorage.setItem("isLoggedIn", "true");
    }
    return { success: true };
  }
  return { success: false, message: "Invalid username or password" };
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("isLoggedIn");
  }
}

export function checkAuth(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("isLoggedIn") === "true";
  }
  return false; // Default to not authenticated on server-side for this mock
}
