import * as yup from 'yup'

export const paymentRequestSchema = yup.object({
  cardHolderFirstName: yup.string().min(1).required(),
  cardHolderLastName: yup.string().min(1).required(),
  cardNumber: yup.number().required().positive().test((value: number) => {
    return value.toString().length === 16
  }),
  cardExpirationDate: yup.string().required().matches(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, 'expiration date must be in the format MM/YY'),
  cvv: yup.string().required().matches(/^[0-9]{3,4}$/, 'cvv must be 3 or 4 digits'),
  amount: yup.number().positive().min(1).required(),
  currency: yup.string().required().length(3)
}).noUnknown(true)

export const getPaymentStatusSchema = yup.object({
  id: yup.string().min(1).required().test('isNumber', 'id must be a number', (value) => {
    const parsedValue = parseInt(value)
    return !isNaN(parsedValue) && parsedValue > 0
  })
}).noUnknown(true)
