import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
export function LoginPage() {
    const [loginType, setLoginType] = useState("user");
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const path = loginType === "admin"
                ? "/auth/admin-login"
                : mode === "login"
                    ? "/auth/login"
                    : "/auth/register";
            const body = loginType === "admin" || mode === "login"
                ? { email, password }
                : {
                    name,
                    email,
                    password
                };
            const data = await apiRequest(path, {
                method: "POST",
                body
            });
            login(data.token, data.user);
            navigate(data.user.role === "admin" ? "/admin" : "/");
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            setError(message);
        }
        finally {
            setIsLoading(false);
        }
    }
    return (_jsx("div", { className: "auth-wrapper", children: _jsxs("form", { className: "card auth-card", onSubmit: handleSubmit, children: [_jsx("h2", { children: loginType === "admin" ? "Admin Login" : mode === "login" ? "Login" : "Create Account" }), _jsxs("div", { className: "segmented-control", children: [_jsx("button", { className: loginType === "user" ? "segmented-btn active" : "segmented-btn", type: "button", onClick: () => setLoginType("user"), children: "User" }), _jsx("button", { className: loginType === "admin" ? "segmented-btn active" : "segmented-btn", type: "button", onClick: () => {
                                setLoginType("admin");
                                setMode("login");
                            }, children: "Admin" })] }), loginType === "user" && mode === "register" && (_jsxs("label", { children: ["Name", _jsx("input", { value: name, onChange: (e) => setName(e.target.value), required: true })] })), _jsxs("label", { children: ["Email", _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("label", { children: ["Password", _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), error && _jsx("p", { className: "error-text", children: error }), _jsx("button", { className: "button", type: "submit", disabled: isLoading, children: isLoading
                        ? "Please wait..."
                        : loginType === "admin"
                            ? "Login as Admin"
                            : mode === "login"
                                ? "Login"
                                : "Register" }), loginType === "user" && (_jsx("button", { type: "button", className: "link-button", onClick: () => setMode((prev) => (prev === "login" ? "register" : "login")), children: mode === "login" ? "New user? Register here" : "Already a user? Login" }))] }) }));
}
