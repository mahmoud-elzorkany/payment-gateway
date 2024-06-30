export interface CreatePaymentRequestParams {
  cardHolderFirstName: string
  cardHolderLastName: string
  cardNumber: number
  cardExpirationDate: string
  cvv: string
  amount: number
  currency: string
}

export interface CreatePaymentResponseParams extends CreatePaymentRequestParams {
  id: number
  status: PaymentStatus
}

export type PaymentStatus = 'success' | 'failed' | 'pending'
