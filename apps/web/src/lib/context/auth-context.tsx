"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { User } from "@carasta/types";
import { MOCK_USERS } from "@carasta/mock-data";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  returnTo: string | null;
  signIn: (userId?: string) => void;
  signOut: () => void;
  enterGuest: () => void;
  exitGuest: () => void;
  setReturnTo: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  returnTo: null,
  signIn: () => {},
  signOut: () => {},
  enterGuest: () => {},
  exitGuest: () => {},
  setReturnTo: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [returnTo, setReturnTo] = useState<string | null>(null);

  const signIn = useCallback((userId = "user-me") => {
    const found = MOCK_USERS.find((u) => u.id === userId);
    setUser(found ?? null);
    setIsGuest(false);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setIsGuest(false);
  }, []);

  const enterGuest = useCallback(() => {
    setUser(null);
    setIsGuest(true);
  }, []);

  const exitGuest = useCallback(() => {
    setIsGuest(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isGuest, returnTo, signIn, signOut, enterGuest, exitGuest, setReturnTo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
