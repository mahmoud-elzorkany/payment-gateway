export class PaymentError extends Error {
  readonly code: number
  readonly name: string

  constructor (code: number, message: string) {
    super(message)
    this.name = 'PaymentError'
    this.code = code
  }
}
