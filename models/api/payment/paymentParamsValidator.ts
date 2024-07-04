/**
 * This class contains the validation functions for the params of the payment API requests.
 * We use Yup to define the schemas of the requests and validate them.
 * We also use card-validator to validate the card number, expiration date, and CVV.
 *
 * Possible improvements:
 * - Have a dedicated validation class for each request type.
 * - Refactor the validation functions to be more modular and reusable.
 * - Use a more specific error messages for the validation errors.
 * - Figure out a way to validate the currency field against a list of valid currencies.
 *
 */

import * as yup from "yup";
import * as cardValidator from "card-validator";
import {
  type CreatePaymentRequestParams,
  type GetPaymentRequestParams,
} from "./params";

export class PaymentParamsValidator {
  /**
   * Validates the parameters for creating a payment request.
   */
  validateCreatePaymentRequestParams(
    params: unknown,
  ): CreatePaymentRequestParams {
    return (
      yup
        .object({
          // The card holder name is a string with at least one character. It is required.
          cardHolderName: yup.string().min(1).required(),

          // The card number is a string without any spaces between the digits.
          // It is required and must be a valid card number.
          cardNumber: yup
            .string()
            .required()
            .test((value: string) => {
              return cardValidator.number(value).isValid;
            }),

          // The card expiration date is a string with the format MM/YY.
          // It is required and must be a valid expiration date.
          cardExpirationDate: yup
            .string()
            .required()
            .test((value: string) => {
              return cardValidator.expirationDate(value).isValid;
            }),

          // The CVV is a string with exactly three digits.
          // It is a required field
          cvv: yup
            .string()
            .required()
            .test((value: string) => {
              return cardValidator.cvv(value, 3).isValid;
            }),

          // The amount is a positive number greater than 0
          // It is a required field.
          amount: yup.number().positive().min(1).required(),

          // The currency is a string with exactly three characters.
          // It is a required field ans must be in uppercase. ex "USD"
          currency: yup.string().required().length(3).uppercase(),
        })
        // We don't allow any unknown fields in the request.
        .noUnknown(true)
        .validateSync(params, { abortEarly: true, stripUnknown: false })
    );
  }

  /**
   * Validates the parameters for getting the status of a payment.
   */
  validateGetPaymentRequestParams(params: unknown): GetPaymentRequestParams {
    return (
      yup
        .object({
          // The paymentId is a string with a valid UUID format.
          // It is a required field.
          paymentId: yup.string().required().uuid(),
        })
        // We don't allow any unknown fields in the request.
        .noUnknown(true)
        .validateSync(params, { abortEarly: true, stripUnknown: false })
    );
  }
}

// The class is exported as a singleton.
export default new PaymentParamsValidator();
