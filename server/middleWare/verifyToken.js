import AppError from "../utility/error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
      throw new AppError(403, "Not authenticated")
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return next(new AppError(403, "Invalid or expired token"));
    }

    req.userId = payload.id;
    req.role = payload.role;

    next();
  });
};
