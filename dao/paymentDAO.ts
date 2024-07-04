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
  uuid: string;
  status: PaymentStatus;
  statusCode: PaymentStatusCode;
  bankTransactionId: string;
}

export class PaymentDAO {
  async createPayment(
    paymentRequest: CreatePaymentAttributes,
  ): Promise<PaymentModel> {
    return await DatabaseService.paymentModel.create({
      ...paymentRequest,
    });
  }

  async getPaymentById(uuid: string): Promise<PaymentModel | null> {
    return await DatabaseService.paymentModel.findOne({
      where: { uuid },
    });
  }

  async updatePaymentStatusByBankTransactionId(
    transactionId: string,
    status: PaymentStatus,
    statusCode: PaymentStatusCode,
  ): Promise<void> {
    await DatabaseService.paymentModel.update(
      { status, statusCode },
      { where: { bankTransactionId: transactionId } },
    );
  }
}

export default new PaymentDAO();
