/**
 * Payment service is responsible for handling payment requests and updating the payment status.
 * It interacts with the acquiring bank service to process the payment and updates the payment status in the database.
 * It also subscribes to the payment status update event to update the payment status when the acquiring bank service emits the event.
 *
 * Possible improvements:
 * - Implement a more robust payment processing logic with error handling and retries.
 * - Implement a retry mechanism for updating the payment status in case of failure.
 * - Add an adapter layer to handle the communication between the payment service and the acquiring bank service.
 * - Add a cache layer to store the payment status and reduce the number of database queries.
 *
 * Cloud architecture consideration:
 * In a cloud environment, the payment service can be deployed as serverless functions using AWS Lambda.
 * This allows for automatic scaling based on the number of requests. Also AWS lambdas are event-driven and can be triggered by events from other services.
 * Which makes it suitable for handling payment status updates from the acquiring bank service.
 * A lambda function can be triggered by an SQS message from the acquiring bank service and update the payment status in the database.
 */

import {
  type CreatePaymentRequestParams,
  type PaymentResponse,
  type PaymentStatus,
  type PaymentStatusCode,
} from "../../models/api/payment/params";
import {
  GatewayError,
  PaymentGatewayError,
} from "../../services/errors/gatewayError";
import PaymentDAO from "../../dao/paymentDAO";
import { toPaymentResponse } from "./utils";
import AcquiringBankService, { type PaymentResult } from "../acquiringBank";
import EventService from "../eventService";
import { castError, printErrorWithStack } from "../errors/errorUtils";
import LoggerService from "../loggerService";

export class PaymentService {
  constructor() {
    EventService.subscribe(
      "paymentStatusUpdate",
      this.paymentStatusUpdateHandler.bind(this),
    );
  }

  /**
   * Handler for payment status update event.
   */
  private paymentStatusUpdateHandler(paymentResult: PaymentResult): void {
    void (async () => {
      try {
        await this.updatePaymentStatusById(
          paymentResult.paymentId,
          paymentResult.status,
          paymentResult.code,
        );
        LoggerService.logInfo(
          `Payment status updated for transaction id ${paymentResult.paymentId}`,
        );
      } catch (error) {
        const castedError = castError(error);
        LoggerService.logError(
          `Error while updating the status of a payment request with transaction ${printErrorWithStack(castedError)}`,
        );
      }
    })();
  }

  /**
   * Create a payment request.
   * This function processes the payment request by calling the acquiring bank service to process the payment.
   * It then creates a payment record in the database with the payment status and bank payment id.
   */
  async createPayment(
    paymentRequest: CreatePaymentRequestParams,
  ): Promise<PaymentResponse> {
    const paymentResult = AcquiringBankService.processPayment(
      paymentRequest.cardNumber,
    );

    const paymentModel = await PaymentDAO.createPayment({
      ...paymentRequest,
      paymentId: paymentResult.paymentId,
      status: paymentResult.status,
      statusCode: paymentResult.code,
    });

    return toPaymentResponse(paymentModel);
  }

  /**
   * Get the payment status by payment id.
   * This function retrieves the payment record from the database and returns the payment status.
   * If the payment record is not found, it throws an error.
   *
   * We rely on UUID to make sure that we always retrieve the correct payment record.
   * example: the payment record can have a database table id of 1 but after a database migration, the id can be different.
   */
  async getPaymentStatus(uuid: string): Promise<PaymentResponse> {
    const paymentModel = await PaymentDAO.getPaymentById(uuid);
    if (paymentModel === null) {
      throw new GatewayError(
        PaymentGatewayError.PAYMENT_RECORD_NOT_FOUND,
        `Payment with id ${uuid} was not found.`,
      );
    }
    return toPaymentResponse(paymentModel);
  }

  /**
   * Update the payment status by bank payment id.
   * This function updates the payment status in the database based on the bank payment id.
   */
  async updatePaymentStatusById(
    paymentId: string,
    status: PaymentStatus,
    statusCode: PaymentStatusCode,
  ): Promise<void> {
    await PaymentDAO.updatePaymentStatusById(paymentId, status, statusCode);
  }
}
export default new PaymentService();
