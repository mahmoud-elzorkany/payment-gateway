/**
 * This file contains the types for the payment API.
 * It includes the request and response types for the payment gateway.
 * It also includes the possible payment status and rejection codes.
 */

/**
 * The parameters for creating a payment request.
 * @property {string} cardHolderName      - The full name of the card owner.
 * @property {string} cardNumber          - The card number as a string with no spaces.
 * @property {string} cardExpirationDate  - The expiration date of the card with MM/YY format.
 * @property {string} cvv                 - The three digits representing the CVV of the card.
 * @property {number} amount              - The amount to be paid.
 * @property {string} currency            - The currency of the payment (ex "EUR").
 */
export interface CreatePaymentRequestParams {
  cardHolderName: string;
  cardNumber: string;
  cardExpirationDate: string;
  cvv: string;
  amount: number;
  currency: string;
}

/**
 * The parameters for getting the details of a payment.
 * @property {string} paymentId   - The unique identifier of the payment.
 */
export interface GetPaymentRequestParams {
  paymentId: string;
}

/**
 * The response for a payment request.
 * @property {string} paymentId           - The unique identifier of the payment.
 * @property {string} cardHolderName      - The full name of the card owner.
 * @property {string} cardNumber          - The obfuscated card number.
 * @property {string} cardExpirationDate  - The obfuscated expiration date of the card with MM/YY format.
 * @property {string} cvv                 - The obfuscated CVV of the card.
 * @property {number} amount              - The amount paid.
 * @property {string} currency            - The currency of the payment.
 * @property {string} status              - The status of the payment (success, failed, pending).
 * @property {string} code                - The status code of the payment.
 *
 */
export interface PaymentResponse extends CreatePaymentRequestParams {
  paymentId: string;
  status: PaymentStatus;
  code: PaymentStatusCode;
}

/**
 * The possible status of a payment.
 * This is not an exhaustive list of all possible statuses.
 * This is an assumption of the possible statuses for a payment.
 */
export type PaymentStatus = "success" | "failed" | "pending";

/**
 * The corresponding status code for a payment status.
 */
export type PaymentStatusCode =
  | SuccessCode
  | PendingCode
  | (typeof REJECTION_CODES)[number];

/**
 * The success status code for a payment.
 * This is an assumption of the possible success status codes for a payment.
 */
type SuccessCode = "successful_payment";

/**
 * The pending status code for a payment.
 * This is an assumption of the possible pending status codes for a payment.
 */
type PendingCode = "processing_payment";

/**
 * The possible rejection codes for a failed payment.
 * This is an assumption of the possible rejection codes for a payment.
 */
export const REJECTION_CODES = [
  "insufficient_funds",
  "lost_card",
  "stolen_card",
  "card_velocity_exceeded",
] as const;
