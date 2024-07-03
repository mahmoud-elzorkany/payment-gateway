import * as express from "express";
import {
  getPaymentStatusSchema,
  paymentRequestSchema,
} from "../models/api/payment/validators";
import {
  type CreatePaymentRequestParams,
  type GetPaymentStatusParams,
} from "../models/api/payment/params";
import PaymentService from "../services/paymentService/index";
import { respondToError } from "./utils";

const router = express.Router();

router.post("/", function (req: express.Request, res: express.Response) {
  void (async () => {
    try {
      const paymentRequest: CreatePaymentRequestParams =
        paymentRequestSchema.validateSync(req.body, {
          abortEarly: true,
          stripUnknown: false,
        });
      const paymentResponse =
        await PaymentService.createPayment(paymentRequest);
      res.status(201).send(paymentResponse);
    } catch (error) {
      respondToError(error, res);
    }
  })();
});

router.get(
  "/:paymentId",
  function (req: express.Request, res: express.Response) {
    void (async () => {
      try {
        const getPaymentStatusRequest: GetPaymentStatusParams =
          getPaymentStatusSchema.validateSync(req.params, {
            abortEarly: true,
            stripUnknown: false,
          });
        const payment = await PaymentService.getPaymentStatus(
          getPaymentStatusRequest.paymentId,
        );
        res.status(200).send(payment);
      } catch (error) {
        respondToError(error, res);
      }
    })();
  },
);

export = router;
