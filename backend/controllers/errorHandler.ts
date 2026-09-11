import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Something went wrong";

  if (!err.isOperational) {
    console.error("UNEXPECTED ERROR", err);
  }

  res.status(statusCode).json({ error: message });
};
