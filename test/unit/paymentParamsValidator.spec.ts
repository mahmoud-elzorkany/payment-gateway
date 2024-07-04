/**
 * Unit tests for the PaymentParamsValidator class
 *
 * Possible improvements:
 * - Add more test cases to cover all the validation rules.
 * - Improve the by testing the error messages returned by the validation functions.
 */

import { PaymentParamsValidator } from "../../models/api/payment/paymentParamsValidator";
import * as assert from "assert";

describe("PaymentParamsValidator", () => {
  const paymentParamsValidator = new PaymentParamsValidator();

  describe("validateCreatePaymentRequestParams", () => {
    it("should return the validated params when the input is valid", () => {
      const params = {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424242",
        cardExpirationDate: "12/24",
        cvv: "123",
        amount: 100,
        currency: "USD",
      };
      const result =
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      assert.deepStrictEqual(result, params);
    });

    it("should throw an error when the cardHolderName is missing", () => {
      const params = {
        cardNumber: "4242424242424242",
        cardExpirationDate: "12/24",
        cvv: "123",
        amount: 100,
        currency: "USD",
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });

    it("should throw an error when the cardNumber is missing", () => {
      const params = {
        cardHolderName: "John Doe",
        cardExpirationDate: "12/24",
        cvv: "123",
        amount: 100,
        currency: "USD",
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });

    it("should throw an error when the cardExpirationDate is missing", () => {
      const params = {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424242",
        cvv: "123",
        amount: 100,
        currency: "USD",
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });

    it("should throw an error when the cvv is missing", () => {
      const params = {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424242",
        cardExpirationDate: "12/24",
        amount: 100,
        currency: "USD",
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });

    it("should throw an error when the amount is missing", () => {
      const params = {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424242",
        cardExpirationDate: "12/24",
        cvv: "123",
        currency: "USD",
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });

    it("should throw an error when the currency is missing", () => {
      const params = {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424242",
        cardExpirationDate: "12/24",
        cvv: "123",
        amount: 100,
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });

    it("should throw an error when the cardNumber is invalid", () => {
      const params = {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424241",
        cardExpirationDate: "12/24",
        cvv: "123",
        amount: 100,
        currency: "USD",
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });

    it("should throw an error when the cardExpirationDate is invalid", () => {
      const params = {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424242",
        cardExpirationDate: "13/24",
        cvv: "123",
        amount: 100,
        currency: "USD",
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });

    it("should throw an error when the cvv is invalid", () => {
      const params = {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424242",
        cardExpirationDate: "12/24",
        cvv: "12",
        amount: 100,
        currency: "USD",
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });

    it("should throw an error when the amount is negative", () => {
      const params = {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424242",
        cardExpirationDate: "12/24",
        cvv: "123",
        amount: -100,
        currency: "USD",
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });

    it("should throw an error when the currency is not exactly 3 characters long", () => {
      const params = {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424242",
        cardExpirationDate: "12/24",
        cvv: "123",
        amount: 100,
        currency: "US",
      };
      assert.throws(() => {
        paymentParamsValidator.validateCreatePaymentRequestParams(params);
      });
    });
  });

  describe("validateGetPaymentRequestParams", () => {
    it("should return the validated params when the input is valid", () => {
      const params = {
        paymentId: "d1506dc0-7fbc-484c-ad45-1aed64c71b0f",
      };
      const result =
        paymentParamsValidator.validateGetPaymentRequestParams(params);
      assert.deepStrictEqual(result, params);
    });

    it("should throw an error when the paymentId is missing", () => {
      const params = {};
      assert.throws(() => {
        paymentParamsValidator.validateGetPaymentRequestParams(params);
      });
    });

    it("should throw an error when the paymentId is not a valid UUID", () => {
      const params = {
        paymentId: "d1506dc0-7fbc-484c-ad45-1aed64c71b0",
      };
      assert.throws(() => {
        paymentParamsValidator.validateGetPaymentRequestParams(params);
      });
    });
  });
});
