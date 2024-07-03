import type * as express from "express";
import { GatewayError } from "../services/errors/gatewayError";
import { ValidationError } from "yup";
import { castError } from "../lib/utils";

export function respondToError(error: unknown, res: express.Response): void {
  if (isValidationError(error)) {
    res.status(400).send({ error: error.name, message: error.message });
  } else if (isGatewayError(error)) {
    res.status(error.code).send({ error: error.key, message: error.message });
  } else {
    const castedError = castError(error);
    res.status(500).send({
      error: castedError.name,
      message: castedError.message,
      stack: castedError.stack,
    });
  }
}

function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

function isGatewayError(error: unknown): error is GatewayError {
  return error instanceof GatewayError;
}
