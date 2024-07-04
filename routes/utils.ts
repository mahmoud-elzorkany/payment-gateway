/**
 * This file contains utility functions for the routes.
 * It includes a function to respond to errors with the appropriate status code and message.
 */

import type * as express from "express";
import { GatewayError } from "../services/errors/gatewayError";
import { ValidationError } from "yup";
import { castError } from "../services/errors/errorUtils";

/**
 * Responds to an error by sending an appropriate response with the error details.
 */
export function respondToError(error: unknown, res: express.Response): void {
  // If the error is due to bad request parameters
  if (isValidationError(error)) {
    res.status(400).send({ error: error.name, message: error.message });

    // If the error comes from the payment service
  } else if (isGatewayError(error)) {
    res.status(error.code).send({ error: error.key, message: error.message });
    // Any other unexpected error
  } else {
    const castedError = castError(error);
    res.status(500).send({
      error: castedError.name,
      message: castedError.message,
      stack: castedError.stack,
    });
  }
}

// Type guards for the error types
function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

function isGatewayError(error: unknown): error is GatewayError {
  return error instanceof GatewayError;
}
