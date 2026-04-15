import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) {
        res.status(401).json({ message: "Missing authentication token" });
        return;
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }
        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
export function requireUser(req, res, next) {
    if (req.user?.role !== "user") {
        res.status(403).json({ message: "Only users can access this route" });
        return;
    }
    next();
}
export function requireAdmin(req, res, next) {
    if (req.user?.role !== "admin") {
        res.status(403).json({ message: "Only admin can access this route" });
        return;
    }
    next();
}
