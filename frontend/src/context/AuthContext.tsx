import { createContext, useContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { User } from "../types";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  login: (nextToken: string, nextUser: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "expense_tracker_token";
const USER_KEY = "expense_tracker_user";

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<User>;
    if (!parsed.email || !parsed.name) {
      return null;
    }

    return {
      id: parsed.id ?? 0,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role === "admin" ? "admin" : "user"
    };
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      login: (nextToken, nextUser) => {
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem(TOKEN_KEY, nextToken);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      },
      logout: () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
