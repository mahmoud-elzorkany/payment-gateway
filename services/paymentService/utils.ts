import { PaymentError } from '../errors/paymentError'
import type { PaymentModel } from '../../models/sql/payment'
import type { PaymentResponse } from '../../models/api/payment/params'

export function assertCardNotExpired (cardExpirationDate: string): void {
  const currentDate = new Date()
  const currentYear = String(currentDate.getFullYear()).slice(-2)
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')

  const expirationYear = cardExpirationDate.split('/')[1]
  const expirationMonth = cardExpirationDate.split('/')[0]

  if (expirationYear < currentYear || (expirationYear === currentYear && expirationMonth < currentMonth)) {
    throw new PaymentError(422, 'Unable to process payment: card has expired')
  }
}

export function toPaymentResponse (paymentModel: PaymentModel): PaymentResponse {
  return {
    id: paymentModel.id,
    cardHolderFirstName: paymentModel.cardHolderFirstName,
    cardHolderLastName: paymentModel.cardHolderLastName,
    cardNumber: paymentModel.cardNumber,
    cardExpirationDate: paymentModel.cardExpirationDate,
    cvv: paymentModel.cvv,
    amount: paymentModel.amount,
    currency: paymentModel.currency,
    status: paymentModel.status
  }
}
