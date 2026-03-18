import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { AuthResponse } from "../types";

type Mode = "login" | "register";

export function LoginPage() {
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
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login"
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
        <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

        {mode === "register" && (
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
          {isLoading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <button
          type="button"
          className="link-button"
          onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
        >
          {mode === "login" ? "New user? Register here" : "Already a user? Login"}
        </button>
      </form>
    </div>
  );
}
