/**
 * unit test for the acquiring bank service
 *
 * Possible improvements:
 * Add a test case for emitting the paymentStatusUpdate event
 */

import * as assert from "assert";
import AcquiringBankService from "../../services/acquiringBank";

describe("acquiringBank", () => {
  describe("processPayment", () => {
    it("should return a successful payment result when the payment is successful", () => {
      const cardNumber = "378734493671000";
      const result = AcquiringBankService.processPayment(cardNumber);
      assert.strictEqual(result.status, "success");
    });

    it("should return a failed payment result when the payment fails", () => {
      const cardNumber = "371449635398431";
      const result = AcquiringBankService.processPayment(cardNumber);
      assert.strictEqual(result.status, "failed");
    });

    it("should return a pending payment result when the payment is pending", () => {
      const cardNumber = "4242424242424242";
      const result = AcquiringBankService.processPayment(cardNumber, false);
      assert.strictEqual(result.status, "pending");
    });
  });
});
