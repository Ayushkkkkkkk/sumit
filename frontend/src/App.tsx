import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { AddExpensePage } from "./pages/AddExpensePage";
import { AddIncomePage } from "./pages/AddIncomePage";
import { AdminPage } from "./pages/AdminPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

function UserRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/add-expense" element={<AddExpensePage />} />
        <Route path="/add-income" element={<AddIncomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function AdminRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  const { token, user } = useAuth();
  if (!token) {
    return <LoginPage />;
  }
  if (user?.role === "admin") {
    return <AdminRoutes />;
  }
  return <UserRoutes />;
}
