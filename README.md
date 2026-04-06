# Expense Tracker and Budget Alert System

A beginner-friendly full-stack web app built with:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + Prisma + JWT auth
- Database: SQLite (via Prisma)

## Project Summary

This project is a full-stack personal finance tracker where authenticated users can manage income and expenses, set a monthly budget, and monitor financial health from a dashboard.

### What is included

- Secure authentication (register/login) using JWT
- Simple admin login and admin panel
- Expense tracking with categories
- Income tracking with source and description
- Monthly budget setup and updates
- Dashboard cards for:
  - total income
  - total expense
  - remaining balance
  - monthly budget
- Category-wise expense totals table
- Budget alert status (`normal`, `near_limit`, `over_budget`)
- Recent expenses and incomes tables
- Admin overview cards for users, total income, total expense, and total budgets

### Main folders

- `backend/`
  - `src/controllers/`: auth and finance business logic
  - `src/routes/`: REST API routes
  - `src/middleware/`: auth, validation, and error handling
  - `src/algorithms/`: required algorithm files
  - `prisma/schema.prisma`: database models (`User`, `Expense`, `Income`, `Budget`)
- `frontend/`
  - `src/pages/`: `LoginPage`, `DashboardPage`, `AddExpensePage`, `AddIncomePage`
  - `src/components/`: reusable cards/layout/table
  - `src/context/`: auth state management
  - `src/api/client.ts`: API request helper

## Features

- User registration and login
- Add income records
- Add expense records with categories
- Set monthly budget
- Dashboard for:
  - total income
  - total spending
  - remaining balance
  - category-wise expense totals
  - budget warning status (normal / near limit / over budget)

## Project Structure

- `backend`: Express API, Prisma models, auth, validation, algorithms
- `frontend`: React app with login and dashboard pages

## Two Required Algorithms

### Algorithm 1: Category-wise total calculation

File: `backend/src/algorithms/categoryTotals.ts`

- takes all expense records
- groups by category
- calculates total amount for each category

### Algorithm 2: Budget alert detection

File: `backend/src/algorithms/budgetAlert.ts`

- calculates total expense
- compares with monthly budget
- returns one of: `normal`, `near_limit`, `over_budget`

## Backend API (Simple REST)

Base URL: `http://localhost:4000/api`

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/admin-login`
- `POST /expenses` (auth)
- `POST /incomes` (auth)
- `PUT /budget` (auth)
- `GET /dashboard` (auth)
- `GET /expenses` (auth)
- `GET /incomes` (auth)
- `GET /admin/overview` (admin auth)

Admin overview now includes:
- overall platform totals (users, income, expense, budgets, net flow)
- budget health breakdown (normal, near limit, over budget, without budget)
- top expense categories
- recent unified activity feed

## Setup

### 1) Backend

```bash
cd backend
npm install
cp env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend runs on: `http://localhost:4000`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Notes

- CORS is enabled in backend for local frontend usage.
- Validation uses `zod`.
- Passwords are hashed using `bcryptjs`.
- JWT token is required for protected finance routes.
# sumit
# sumit
