/**
 * Unit tests for the payment service utility functions
 */

import * as assert from "assert";
import {
  obfuscateCardNumber,
  obfuscateCvv,
  obfuscateExpirationDate,
  toPaymentResponse,
} from "../../services/paymentService/utils";
import { type PaymentModel } from "../../models/sql/payment";
import {
  GatewayError,
  PaymentGatewayError,
} from "../../services/errors/gatewayError";

describe("paymentServiceUtils", () => {
  describe("toPaymentResponse", () => {
    it("should return a payment response object with the correct properties", () => {
      const paymentModel = {
        paymentId: "123",
        cardHolderName: "John Doe",
        cardNumber: "1234567890123456",
        cardExpirationDate: "12/23",
        cvv: "123",
        amount: 100,
        currency: "USD",
        status: "success",
        statusCode: "200",
      } as unknown as PaymentModel;
      const result = toPaymentResponse(paymentModel);
      assert.deepStrictEqual(result, {
        paymentId: "123",
        cardHolderName: "John Doe",
        cardNumber: "**** **** **** 3456",
        cardExpirationDate: "**/23",
        cvv: "***",
        amount: 100,
        currency: "USD",
        status: "success",
        code: "200",
      });
    });
  });
  describe("obfuscateCardNumber", () => {
    it("should return a string with all but the last four digits replaced with asterisks", () => {
      const result = obfuscateCardNumber("1234567890123456");
      assert.strictEqual(result, "**** **** **** 3456");
    });
    it("should throw an error when the card number is less than 13 characters", () => {
      assert.throws(
        () => {
          obfuscateCardNumber("123456789012");
        },
        new GatewayError(
          PaymentGatewayError.INVALID_CARD_NUMBER,
          "Invalid card number",
        ),
      );
    });
  });
  describe("obfuscateExpirationDate", () => {
    it("should return a string with the month replaced with asterisks", () => {
      const result = obfuscateExpirationDate("12/23");
      assert.strictEqual(result, "**/23");
    });
    it("should throw an error when the expiration date is less than 5 characters", () => {
      assert.throws(
        () => {
          obfuscateExpirationDate("12/");
        },
        new GatewayError(
          PaymentGatewayError.INVALID_EXPIRATION_DATE,
          "Invalid expiration date",
        ),
      );
    });
  });
  describe("obfuscateCvv", () => {
    it("should return a string with all digits replaced with asterisks", () => {
      const result = obfuscateCvv("123");
      assert.strictEqual(result, "***");
    });
    it("should throw an error when the CVV is less than 3 characters", () => {
      assert.throws(
        () => {
          obfuscateCvv("12");
        },
        new GatewayError(PaymentGatewayError.INVALID_CVV, "Invalid CVV"),
      );
    });
  });
});
