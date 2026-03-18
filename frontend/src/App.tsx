import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { AddExpensePage } from "./pages/AddExpensePage";
import { AddIncomePage } from "./pages/AddIncomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

function ProtectedRoutes() {
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

export default function App() {
  const { token } = useAuth();
  if (!token) {
    return <LoginPage />;
  }
  return <ProtectedRoutes />;
}
