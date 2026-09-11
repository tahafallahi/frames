export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404)
  }
}

export class ValidationError extends AppError {
  details: unknown;

  constructor(message = "Invalid request parameters", details?: unknown) {
    super(message, 400)
    this.details = details;
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("Access denied", 401);
  }
}