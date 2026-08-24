"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

interface User {
  email: string;
  name: string;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const loading = status === "loading";

  const user: User | null = session?.user?.email
    ? {
        email: session.user.email,
        name: session.user.name || session.user.email.split("@")[0],
        id: (session.user as { id?: string }).id,
      }
    : null;

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        return { success: false, error: "Invalid email or password." };
      }
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: e instanceof Error ? e.message : String(e) };
    }
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { success: false, error: data?.error || "Registration failed. Please try again." };
        }
        return await login(email, password);
      } catch (e) {
        console.error(e);
        return { success: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
    } catch (e) {
      console.error("Logout error:", e);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
