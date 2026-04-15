import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
export function AddExpensePage() {
    const { token } = useAuth();
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    async function handleSubmit(e) {
        e.preventDefault();
        if (!token) {
            return;
        }
        setMessage("");
        setError("");
        try {
            await apiRequest("/expenses", {
                method: "POST",
                token,
                body: {
                    amount: Number(amount),
                    category,
                    description: description || undefined
                }
            });
            setMessage("Expense saved successfully.");
            setAmount("");
            setCategory("");
            setDescription("");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save expense");
        }
    }
    return (_jsxs("section", { className: "card form-card", children: [_jsx("h2", { children: "Add Expense" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("label", { children: ["Amount", _jsx("input", { type: "number", step: "0.01", min: "0.01", value: amount, onChange: (e) => setAmount(e.target.value), required: true })] }), _jsxs("label", { children: ["Category", _jsx("input", { value: category, onChange: (e) => setCategory(e.target.value), required: true })] }), _jsxs("label", { children: ["Description (optional)", _jsx("input", { value: description, onChange: (e) => setDescription(e.target.value) })] }), _jsx("button", { className: "button", type: "submit", children: "Save Expense" })] }), message && _jsx("p", { className: "success-text", children: message }), error && _jsx("p", { className: "error-text", children: error })] }));
}
