import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function Layout({ children }) {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === "admin";
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("header", { className: "topbar", children: [_jsx(Link, { to: "/", className: "brand", children: "Expense Tracker" }), _jsx("nav", { className: "nav-links", children: isAdmin ? (_jsx(NavLink, { to: "/admin", children: "Admin Panel" })) : (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: "/", children: "Dashboard" }), _jsx(NavLink, { to: "/add-expense", children: "Add Expense" }), _jsx(NavLink, { to: "/add-income", children: "Add Income" })] })) }), _jsxs("div", { className: "user-actions", children: [_jsxs("span", { children: [user?.name, " (", user?.role, ")"] }), _jsx("button", { onClick: logout, className: "button small danger", type: "button", children: "Logout" })] })] }), _jsx("main", { className: "content", children: children })] }));
}
