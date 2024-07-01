import { type CreatePaymentRequestParams, type PaymentResponse } from '../../models/api/payment/params'
import { PaymentError } from '../errors/paymentError'
import PaymentDAO from '../../dao/paymentDAO'
import { assertCardNotExpired, toPaymentResponse } from './utils'

export class PaymentService {
  async createPayment (paymentRequest: CreatePaymentRequestParams): Promise<PaymentResponse> {
    assertCardNotExpired(paymentRequest.cardExpirationDate)
    const paymentModel = await PaymentDAO.createPayment({
      ...paymentRequest,
      status: 'pending'
    })

    return toPaymentResponse(paymentModel)
  }

  async getPaymentStatus (id: number): Promise<PaymentResponse> {
    const paymentModel = await PaymentDAO.getPaymentById(id)

    if (paymentModel === null) {
      throw new PaymentError(404, `Payment with id ${id} was not found.`)
    }

    return toPaymentResponse(paymentModel)
  }
}
export default new PaymentService()
