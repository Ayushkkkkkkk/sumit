import { useState, type FormEvent } from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";

export function AddIncomePage() {
  const { token } = useAuth();
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      return;
    }

    setMessage("");
    setError("");
    try {
      await apiRequest("/incomes", {
        method: "POST",
        token,
        body: {
          amount: Number(amount),
          source,
          description: description || undefined
        }
      });
      setMessage("Income saved successfully.");
      setAmount("");
      setSource("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save income");
    }
  }

  return (
    <section className="card form-card">
      <h2>Add Income</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Source
          <input value={source} onChange={(e) => setSource(e.target.value)} required />
        </label>
        <label>
          Description (optional)
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button className="button" type="submit">
          Save Income
        </button>
      </form>
      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
