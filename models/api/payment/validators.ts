import * as yup from "yup";
import * as cardValidator from "card-validator";

export const paymentRequestSchema = yup
  .object({
    cardHolderName: yup.string().min(1).required(),

    cardNumber: yup
      .string()
      .required()
      .test((value: string) => {
        return cardValidator.number(value).isValid;
      }),

    cardExpirationDate: yup
      .string()
      .required()
      .test((value: string) => {
        return cardValidator.expirationDate(value).isValid;
      }),

    cvv: yup
      .string()
      .required()
      .test((value: string) => {
        return cardValidator.cvv(value, 3).isValid;
      }),

    amount: yup.number().positive().min(1).required(),
    currency: yup.string().required().length(3).uppercase(),
  })
  .noUnknown(true);

export const getPaymentStatusSchema = yup
  .object({
    paymentId: yup.string().required().uuid(),
  })
  .noUnknown(true);
