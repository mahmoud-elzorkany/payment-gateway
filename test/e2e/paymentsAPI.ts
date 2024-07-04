/**
 * E2E tests for the payments API
 *
 * Possible improvements:
 * Compute the url of the server dynamically based on the environment.
 * Make the responses more type safe
 *
 */

import axios from "axios";
import * as assert from "assert";

describe("paymentsAPI", () => {
  describe("POST /payments", () => {
    it("should return a successful payment result when the payment is successful", async () => {
      const response = await axios.post("http://localhost:3000/payments", {
        cardHolderName: "John Doe",
        cardNumber: "378734493671000",
        cardExpirationDate: "12/24",
        cvv: "123",
        amount: 100,
        currency: "USD",
      });
      assert.strictEqual(response.status, 201);
      assert.strictEqual(response.data.status, "success");
    });

    it("should return a failed payment result when the payment fails", async () => {
      const response = await axios.post("http://localhost:3000/payments", {
        cardHolderName: "John Doe",
        cardNumber: "378282246310005",
        cardExpirationDate: "12/24",
        cvv: "123",
        amount: 100,
        currency: "USD",
      });
      assert.strictEqual(response.status, 201);
      assert.strictEqual(response.data.status, "failed");
    });

    it("should return a pending payment result when the payment is pending", async () => {
      const response = await axios.post("http://localhost:3000/payments", {
        cardHolderName: "John Doe",
        cardNumber: "4242424242424242",
        cardExpirationDate: "12/24",
        cvv: "123",
        amount: 100,
        currency: "USD",
      });
      assert.strictEqual(response.status, 201);
      assert.strictEqual(response.data.status, "pending");
    });
  });

  describe("GET /payments/:paymentId", () => {
    it("should return the status of a payment", async () => {
      const createPaymentResponse = await axios.post(
        "http://localhost:3000/payments",
        {
          cardHolderName: "John Doe",
          cardNumber: "378734493671000",
          cardExpirationDate: "12/24",
          cvv: "123",
          amount: 100,
          currency: "USD",
        },
      );
      const paymentId = createPaymentResponse.data.paymentId;
      const response = await axios.get(
        `http://localhost:3000/payments/${paymentId}`,
      );
      assert.strictEqual(response.status, 200);
      assert.strictEqual(
        response.data.status,
        createPaymentResponse.data.status,
      );
    });
    it("should return a 404 error when the paymentId is not found", async () => {
      const paymentId = crypto.randomUUID();
      try {
        await axios.get(`http://localhost:3000/payments/${paymentId}`);
      } catch (error) {
        // @ts-expect-error
        assert(error.response.status, 404);
      }
    });
  });

  // This test is commented out since we will have to wait for 15 seconds for the payment to be resolved.
  // it("should see an updated status of the pending payment", async () => {
  //   const createPaymentResponse = await axios.post(
  //     "http://localhost:3000/payments",
  //     {
  //       cardHolderName: "John Doe",
  //       cardNumber: "4242424242424242",
  //       cardExpirationDate: "12/24",
  //       cvv: "123",
  //       amount: 100,
  //       currency: "USD",
  //     },
  //   );
  //
  //   assert.strictEqual(createPaymentResponse.status, 201);
  //   assert.strictEqual(createPaymentResponse.data.status, "pending");
  //
  //   await new Promise((resolve) => setTimeout(resolve, 16000));
  //
  //   const getPaymentResponse = await axios.get(
  //     `http://localhost:3000/payments/${createPaymentResponse.data.paymentId}`,
  //   );
  //
  //   assert.strictEqual(getPaymentResponse.status, 200);
  //   assert.notEqual(getPaymentResponse.data.status, "pending");
  // });
});
