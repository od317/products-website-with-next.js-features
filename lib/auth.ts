// lib/auth.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
];

export async function login(username: string, password: string) {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const cookieStore = await cookies();
    cookieStore.set(
      "auth-token",
      JSON.stringify({
        userId: user.id,
        username: user.username,
        role: user.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
      }
    );

    return { success: true, user };
  }

  return { success: false, error: "Invalid credentials" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/login");
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) return null;

  try {
    return JSON.parse(token.value);
  } catch {
    return null;
  }
}

// We only need this for getting user info in components
export async function getCurrentUser() {
  const token = await getAuthToken();
  return token;
}
