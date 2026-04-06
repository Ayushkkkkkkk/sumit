import { Router } from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(requireAdmin);
adminRouter.get("/overview", asyncHandler(getAdminOverview));

export default adminRouter;
