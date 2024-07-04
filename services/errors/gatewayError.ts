/**
 * Custom error class for payment gateway errors.
 * It includes a code and a key for the error type.
 * The key is used to identify the error type in the system.
 * The code is used to send the appropriate HTTP status code in the response.
 */

export class GatewayError extends Error {
  readonly code: number;
  readonly key: PaymentGatewayError;

  constructor(key: PaymentGatewayError, message: string) {
    super(message);
    this.key = key;
    this.code = GATEWAY_ERROR_TO_CODE_MAP[key];
  }
}

/**
 * Enum for the payment gateway errors.
 */
export enum PaymentGatewayError {
  INVALID_CARD_NUMBER = "INVALID_CARD_NUMBER",
  INVALID_EXPIRATION_DATE = "INVALID_EXPIRATION_DATE",
  INVALID_CVV = "INVALID_CVV",
  PAYMENT_RECORD_NOT_FOUND = "PAYMENT_RECORD_NOT_FOUND",
}

/**
 * Map the payment gateway errors to the appropriate HTTP status codes.
 */
const GATEWAY_ERROR_TO_CODE_MAP: Record<PaymentGatewayError, number> = {
  INVALID_CARD_NUMBER: 400,
  INVALID_EXPIRATION_DATE: 400,
  INVALID_CVV: 400,
  PAYMENT_RECORD_NOT_FOUND: 404,
};
