/**
 * Utility functions for the payment service.
 */

import {
  GatewayError,
  PaymentGatewayError,
} from "../../services/errors/gatewayError";
import type { PaymentModel } from "../../models/sql/payment";
import type { PaymentResponse } from "../../models/api/payment/params";

/**
 * Convert a payment model to a payment response.
 */
export function toPaymentResponse(paymentModel: PaymentModel): PaymentResponse {
  return {
    paymentId: paymentModel.paymentId,
    cardHolderName: paymentModel.cardHolderName,
    cardNumber: obfuscateCardNumber(paymentModel.cardNumber.toString()),
    cardExpirationDate: obfuscateExpirationDate(
      paymentModel.cardExpirationDate,
    ),
    cvv: obfuscateCvv(paymentModel.cvv),
    amount: paymentModel.amount,
    currency: paymentModel.currency,
    status: paymentModel.status,
    code: paymentModel.statusCode,
  };
}

/**
 * Obfuscate the card number by replacing all but the last four digits with asterisks.
 */
export function obfuscateCardNumber(cardNumber: string): string {
  if (cardNumber.length < 13) {
    throw new GatewayError(
      PaymentGatewayError.INVALID_CARD_NUMBER,
      "Invalid card number",
    );
  }

  return `**** **** **** ${String(cardNumber).slice(-4)}`;
}

/**
 * Obfuscate the expiration date by replacing the month with asterisks.
 */
export function obfuscateExpirationDate(expirationDate: string): string {
  if (expirationDate.length < 5) {
    throw new GatewayError(
      PaymentGatewayError.INVALID_EXPIRATION_DATE,
      "Invalid expiration date",
    );
  }
  return `**/${String(expirationDate).slice(-2)}`;
}

/**
 * Obfuscate the CVV by replacing all digits with asterisks.
 */
export function obfuscateCvv(cvv: string): string {
  if (cvv.length < 3) {
    throw new GatewayError(PaymentGatewayError.INVALID_CVV, "Invalid CVV");
  }
  return `***`;
}
