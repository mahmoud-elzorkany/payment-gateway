/**
 * The payment data access object (DAO) interacts with the database to create and retrieve and update payment records.
 */

import DatabaseService from "../services/databaseService/index";
import { type PaymentModel } from "../models/sql/payment";
import {
  type CreatePaymentRequestParams,
  type PaymentStatus,
  type PaymentStatusCode,
} from "../models/api/payment/params";

interface CreatePaymentAttributes extends CreatePaymentRequestParams {
  paymentId: string;
  status: PaymentStatus;
  statusCode: PaymentStatusCode;
}

export class PaymentDAO {
  async createPayment(
    paymentRequest: CreatePaymentAttributes,
  ): Promise<PaymentModel> {
    return await DatabaseService.paymentModel.create({
      ...paymentRequest,
    });
  }

  async getPaymentById(paymentId: string): Promise<PaymentModel | null> {
    return await DatabaseService.paymentModel.findOne({
      where: { paymentId },
    });
  }

  async updatePaymentStatusById(
    paymentId: string,
    status: PaymentStatus,
    statusCode: PaymentStatusCode,
  ): Promise<void> {
    await DatabaseService.paymentModel.update(
      { status, statusCode },
      { where: { paymentId } },
    );
  }
}

export default new PaymentDAO();
