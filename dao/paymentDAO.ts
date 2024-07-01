import DatabaseService from '../services/databaseService/index'
import { type PaymentModel } from '../models/sql/payment'
import { type CreatePaymentRequestParams, type PaymentStatus } from '../models/api/payment/params'

interface CreatePaymentAttributes extends CreatePaymentRequestParams {
  status: PaymentStatus
}

export class PaymentDAO {
  async createPayment (paymentRequest: CreatePaymentAttributes): Promise<PaymentModel> {
    return await DatabaseService.paymentModel.create({
      ...paymentRequest

    })
  }

  async getPaymentById (id: number): Promise<PaymentModel | null> {
    return await DatabaseService.paymentModel.findOne({ where: { id } })
  }
}
export default new PaymentDAO()
