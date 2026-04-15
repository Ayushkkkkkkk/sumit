import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { AddExpensePage } from "./pages/AddExpensePage";
import { AddIncomePage } from "./pages/AddIncomePage";
import { AdminPage } from "./pages/AdminPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
function UserRoutes() {
    return (_jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/add-expense", element: _jsx(AddExpensePage, {}) }), _jsx(Route, { path: "/add-income", element: _jsx(AddIncomePage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
function AdminRoutes() {
    return (_jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/admin", element: _jsx(AdminPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/admin", replace: true }) })] }) }));
}
export default function App() {
    const { token, user } = useAuth();
    if (!token) {
        return _jsx(LoginPage, {});
    }
    if (user?.role === "admin") {
        return _jsx(AdminRoutes, {});
    }
    return _jsx(UserRoutes, {});
}
