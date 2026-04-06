import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { AuthResponse } from "../types";

type Mode = "login" | "register";
type LoginType = "user" | "admin";

export function LoginPage() {
  const [loginType, setLoginType] = useState<LoginType>("user");
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const path =
        loginType === "admin"
          ? "/auth/admin-login"
          : mode === "login"
            ? "/auth/login"
            : "/auth/register";
      const body =
        loginType === "admin" || mode === "login"
          ? { email, password }
          : {
              name,
              email,
              password
            };

      const data = await apiRequest<AuthResponse>(path, {
        method: "POST",
        body
      });

      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>{loginType === "admin" ? "Admin Login" : mode === "login" ? "Login" : "Create Account"}</h2>

        <div className="segmented-control">
          <button
            className={loginType === "user" ? "segmented-btn active" : "segmented-btn"}
            type="button"
            onClick={() => setLoginType("user")}
          >
            User
          </button>
          <button
            className={loginType === "admin" ? "segmented-btn active" : "segmented-btn"}
            type="button"
            onClick={() => {
              setLoginType("admin");
              setMode("login");
            }}
          >
            Admin
          </button>
        </div>

        {loginType === "user" && mode === "register" && (
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        )}

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button className="button" type="submit" disabled={isLoading}>
          {isLoading
            ? "Please wait..."
            : loginType === "admin"
              ? "Login as Admin"
              : mode === "login"
                ? "Login"
                : "Register"}
        </button>

        {loginType === "user" && (
          <button
            type="button"
            className="link-button"
            onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
          >
            {mode === "login" ? "New user? Register here" : "Already a user? Login"}
          </button>
        )}
      </form>
    </div>
  );
}
