export interface CreatePaymentRequestParams {
  cardHolderName: string;
  cardNumber: string;
  cardExpirationDate: string;
  cvv: string;
  amount: number;
  currency: string;
}

export interface GetPaymentStatusParams {
  paymentId: string;
}

export interface PaymentResponse extends CreatePaymentRequestParams {
  paymentId: string;
  status: PaymentStatus;
  code: PaymentStatusCode;
}

export type PaymentStatus = "success" | "failed" | "pending";

export type PaymentStatusCode =
  | SuccessCode
  | PendingCode
  | (typeof REJECTION_CODES)[number];

type SuccessCode = "successful_payment";

type PendingCode = "processing_payment";

export const REJECTION_CODES = [
  "insufficient_funds",
  "lost_card",
  "stolen_card",
  "card_velocity_exceeded",
] as const;
