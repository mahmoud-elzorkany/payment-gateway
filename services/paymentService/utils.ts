import {
  GatewayError,
  PaymentGatewayError,
} from "../../services/errors/gatewayError";
import type { PaymentModel } from "../../models/sql/payment";
import type { PaymentResponse } from "../../models/api/payment/params";

export function toPaymentResponse(paymentModel: PaymentModel): PaymentResponse {
  return {
    paymentId: paymentModel.uuid,
    cardHolderName: paymentModel.cardHolderName,
    cardNumber: obfuscateCardNumber(paymentModel.cardNumber),
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

export function obfuscateCardNumber(cardNumber: string): string {
  if (cardNumber.length < 13) {
    throw new GatewayError(
      PaymentGatewayError.INVALID_CARD_NUMBER,
      "Invalid card number",
    );
  }

  return `**** **** **** ${String(cardNumber).slice(-4)}`;
}

export function obfuscateExpirationDate(expirationDate: string): string {
  if (expirationDate.length < 5) {
    throw new GatewayError(
      PaymentGatewayError.INVALID_EXPIRATION_DATE,
      "Invalid expiration date",
    );
  }
  return `**/${String(expirationDate).slice(-2)}`;
}

export function obfuscateCvv(cvv: string): string {
  if (cvv.length < 3) {
    throw new GatewayError(PaymentGatewayError.INVALID_CVV, "Invalid CVV");
  }
  return `***`;
}
