/**
 * Utility functions for error handling.
 */

/**
 * Casts an unknown error to an Error object.
 */
export function castError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  if (error !== null && typeof error === "object") {
    const errorObject = error as Record<string, unknown>;
    if (
      typeof errorObject.name === "string" &&
      typeof errorObject.message === "string"
    ) {
      return error as Error;
    } else if (typeof errorObject.message === "string") {
      return new Error((error as Error).message);
    }
  }

  return new Error(`Unknown error: ${JSON.stringify(error)}`);
}

/**
 * Prints an error message with its stack trace.
 */
export function printErrorWithStack(error: Error): string {
  let errorMessage = error.message;

  if (error.stack !== undefined) {
    errorMessage = errorMessage + "\n" + error.stack;
  }

  return errorMessage;
}
