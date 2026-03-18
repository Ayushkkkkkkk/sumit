import { Link, NavLink } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuth } from "../context/AuthContext";

export function Layout({ children }: PropsWithChildren) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Expense Tracker
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/add-expense">Add Expense</NavLink>
          <NavLink to="/add-income">Add Income</NavLink>
        </nav>
        <div className="user-actions">
          <span>{user?.name}</span>
          <button onClick={logout} className="button small danger" type="button">
            Logout
          </button>
        </div>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
