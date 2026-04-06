import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import financeRouter from "./routes/financeRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api", financeRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
