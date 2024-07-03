import {
  type CreatePaymentRequestParams,
  type PaymentResponse,
} from "../../models/api/payment/params";
import {
  GatewayError,
  PaymentGatewayError,
} from "../../services/errors/gatewayError";
import PaymentDAO from "../../dao/paymentDAO";
import { toPaymentResponse } from "./utils";
import AcquiringBankService, { type PaymentResult } from "../acquiringBank";
import EventService from "../eventService";
import { castError } from "../../lib/utils";
import LoggerService from "../loggerService";

export class PaymentService {
  constructor() {
    EventService.subscribe(
      "paymentStatusUpdate",
      this.paymentStatusUpdateHandler.bind(this),
    );
  }

  private paymentStatusUpdateHandler(paymentResult: PaymentResult): void {
    void (async () => {
      try {
        await PaymentDAO.updatePaymentStatusByBankTransactionId(
          paymentResult.bankTransactionId,
          paymentResult.status,
          paymentResult.code,
        );
        LoggerService.logInfo(
          `Payment status updated for transaction id ${paymentResult.bankTransactionId}`,
        );
      } catch (error) {
        const castedError = castError(error);
        LoggerService.logError(
          `Error while updating the status of a payment request with transaction ${paymentResult.bankTransactionId}, ${castedError.message}`,
        );
      }
    })();
  }

  async createPayment(
    paymentRequest: CreatePaymentRequestParams,
  ): Promise<PaymentResponse> {
    const paymentResult = AcquiringBankService.processPayment(
      paymentRequest.cardNumber,
    );

    const paymentModel = await PaymentDAO.createPayment({
      ...paymentRequest,
      uuid: crypto.randomUUID(),
      status: paymentResult.status,
      statusCode: paymentResult.code,
      bankTransactionId: paymentResult.bankTransactionId,
    });

    return toPaymentResponse(paymentModel);
  }

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
}
export default new PaymentService();
