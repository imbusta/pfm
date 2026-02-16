import { DatabaseError } from 'pg';

interface DbErrorResponse {
  statusCode: number;
  message: string;
}

/**
 * Maps PostgreSQL error codes to HTTP status codes and user-friendly messages
 */
export function handleDbError(error: any): DbErrorResponse {
  // Check if it's a PostgreSQL error
  if (error.code) {
    switch (error.code) {
      // Unique violation (e.g., duplicate key)
      case '23505':
        return {
          statusCode: 409,
          message: 'A record with this value already exists',
        };

      // Foreign key violation
      case '23503':
        return {
          statusCode: 400,
          message: 'Referenced record does not exist',
        };

      // Not null violation
      case '23502':
        return {
          statusCode: 400,
          message: `Required field '${error.column}' cannot be null`,
        };

      // Invalid text representation (e.g., invalid UUID, invalid number format)
      case '22P02':
        return {
          statusCode: 400,
          message: 'Invalid data format provided',
        };

      // Check violation
      case '23514':
        return {
          statusCode: 400,
          message: 'Data does not meet validation requirements',
        };

      // String data right truncation
      case '22001':
        return {
          statusCode: 400,
          message: 'Input value is too long',
        };

      // Numeric value out of range
      case '22003':
        return {
          statusCode: 400,
          message: 'Numeric value is out of range',
        };

      default:
        return {
          statusCode: 500,
          message: 'Database error occurred',
        };
    }
  }

  // Default error response
  return {
    statusCode: 500,
    message: error.message || 'Internal server error',
  };
}

/**
 * Checks if an error is a PostgreSQL database error
 */
export function isDatabaseError(error: any): error is DatabaseError {
  return error && typeof error.code === 'string' && error.code.length === 5;
}
