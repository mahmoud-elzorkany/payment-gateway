/**
 * Utility functions for the acquiring bank service.
 */

/**
 * Generates a random index within the specified length.
 */
export function generateRandomIndex(length: number): number {
  if (length <= 0) {
    throw new Error("Length must be greater than 0");
  }
  if (length === 1) {
    return 0;
  }
  return Math.floor(Math.random() * length);
}
