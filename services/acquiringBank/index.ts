/**
 * The acquiring bank service is responsible for simulating the processing payments.
 * It contains a list of accepted and declined card numbers.
 * It simulates the payment processing by checking if the card number is in the accepted or declined list.
 * If the card number is not in either list, it simulates a pending payment
 * where the pending payment is resolved after 15 seconds with a random status (success or failed).
 * then a response from the acquiring bank is simulated by emitting an event with the payment status update.
 * This event is handled by the payment service to update the payment status in the database using the payment id.
 *
 * Note: The 15 seconds delay for payment resolution is non-blocking for the server.
 *
 * This idea of the simulation is based on the assumption that there are three possible outcomes for a payment:
 * 1. The payment is successful.
 * 2. The payment is declined.
 * 3. The payment is pending and needs further processing to determine the final status, and it will be resolved after a certain amount of time with a success or failed status.
 *
 * Possible improvements:
 * - Add more realistic payment processing logic.
 * - Implement a real connection to a testing account with the acquiring bank to simulate real payment processing.
 * - Add more detailed logging and error handling.
 *
 * Cloud architecture consideration:
 * In real life situations when the application is expected to receive messages from an external service like an acquiring bank,
 * instead of relying on emitting events, a more robust solution like a message queues should be used.
 * this allows for non-blocking asynchronous communication between the acquiring bank and the payment which is more reliable and scalable.
 * A message queue like amazon SQS can be used as it provides automatic and elastic scalability during high traffic periods, durability where messages are stored across multiple data centers,
 * and also retention of messages for up to 14 ensuring that messages are not lost if an error occurs while processing for example.
 */

import {
  type PaymentStatus,
  type PaymentStatusCode,
  REJECTION_CODES,
} from "../../models/api/payment/params";
import EventService from "../eventService";
import { generateRandomIndex } from "./utils";
import LoggerService from "../loggerService";

export interface PaymentResult {
  status: PaymentStatus;
  code: PaymentStatusCode;
  paymentId: string;
}

export class AcquiringBankService {
  private static readonly acceptedCardsList: string[] = [
    "378734493671000",
    "5610591081018250",
    "4111111111111111",
    "30569309025904",
  ];

  private static readonly declinedCardsList: string[] = [
    "378282246310005",
    "371449635398431",
    "5200828282828210",
    "2223003122003222",
  ];

  /**
   * Process a payment request.
   * This function simulates the payment processing by checking if the card number is in the accepted or declined list.
   * If the card number is not in either list, it simulates a pending payment
   * where the pending payment is resolved after 15 seconds with a random status (success or failed).
   * then a response from the acquiring bank is simulated by emitting an event with the payment status update.
   */
  processPayment(cardNumber: string): PaymentResult {
    const paymentId = crypto.randomUUID();
    const paymentResult: PaymentResult = {
      code: "processing_payment",
      status: "pending",
      paymentId,
    };
    if (AcquiringBankService.acceptedCardsList.includes(cardNumber)) {
      paymentResult.status = "success";
      paymentResult.code = "successful_payment";
    } else if (AcquiringBankService.declinedCardsList.includes(cardNumber)) {
      paymentResult.status = "failed";
      paymentResult.code =
        // Randomly select a rejection code
        REJECTION_CODES[generateRandomIndex(REJECTION_CODES.length)];
    } else {
      paymentResult.status = "pending";
      paymentResult.code = "processing_payment";
      this.simulatePendingPayment(paymentId);
    }

    if (paymentResult.status === "success") {
      LoggerService.logInfo(
        `Payment successful for transaction ${paymentId} : ${paymentResult.code}`,
      );
    } else if (paymentResult.status === "failed") {
      LoggerService.logWarn(
        `Payment failed for transaction ${paymentId} : ${paymentResult.code}`,
      );
    } else {
      LoggerService.logInfo(
        `Payment pending for transaction ${paymentId} : ${paymentResult.code}`,
      );
    }

    return paymentResult;
  }

  /**
   * Simulate a pending payment by resolving the payment status after 15 seconds with a random status (success or failed).
   * Note: This function is non-blocking for the server.
   */
  private simulatePendingPayment(paymentId: string): void {
    const paymentStatusList: PaymentStatus[] = ["success", "failed"];
    const randomStatus =
      paymentStatusList[generateRandomIndex(paymentStatusList.length)];

    const paymentPayload: PaymentResult = {
      status: randomStatus,
      code:
        randomStatus === "success"
          ? "successful_payment"
          : REJECTION_CODES[generateRandomIndex(REJECTION_CODES.length)],
      paymentId,
    };

    setTimeout(() => {
      LoggerService.logInfo(`Status update for transaction ${paymentId}`);
      EventService.emit("paymentStatusUpdate", paymentPayload);
      // Time in ms
    }, 15000);
  }
}

export default new AcquiringBankService();
