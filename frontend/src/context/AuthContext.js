import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from "react";
const AuthContext = createContext(undefined);
const TOKEN_KEY = "expense_tracker_token";
const USER_KEY = "expense_tracker_user";
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
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
    const value = useMemo(() => ({
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
    }), [token, user]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
}
