/**
 * This is the router for the payment API endpoints.
 * It contains the routes for creating a payment and getting the status of a payment.
 *
 * Each route validates the request parameters using the PaymentParamsValidator class.
 * The routes then call the corresponding functions from the PaymentService.
 * If an error occurs, the error is caught and sent as a response.
 *
 * Possible improvements:
 * Implement authentication and authorization middleware to secure the payment API.
 * Secure the payment API using HTTPS to encrypt the data in transit.
 * Reduce the duplication in the error handling code by using a wrapper function
 * that accepts as an input a function  of type (req, res) => void, runs the function within a try-catch block,
 * and sends the error response if an error occurs.
 *
 * Cloud architecture consideration:
 * In a cloud environment, an API gateway can be used to manage the payment API endpoints.
 * Based on the request, the API gateway can route the requests to the appropriate load balancer.
 * The load balancer can then distribute the requests to the available servers that host the payment service.
 *
 * A choice for the API gateway could be AWS API Gateway as it provides security features like authentication with external identity providers,
 * HTTPS support encryption for data in transit, request validation, and rate limiting to protect the payment API from abuse,
 * caching responses to reduce latency, also it is auto scalable
 * and elastic, so it can handle high traffic and scale down when the traffic decreases.
 *
 * Note that the API gateway can perform load balancing, however the usages of dedicated load balancers removes the overhead of having to handle service discovery and health checks.
 * Also, the load balancer can be configured to distribute the traffic based on different algorithms like round-robin, minimum connections, ring hash, etc.
 *
 *
 */

import * as express from "express";
import PaymentParamsValidator from "../models/api/payment/paymentParamsValidator";
import {
  type CreatePaymentRequestParams,
  type GetPaymentRequestParams,
} from "../models/api/payment/params";
import PaymentService from "../services/paymentService/index";
import { respondToError } from "./utils";

const router = express.Router();

/**
 * @api {post} /payments
 * @apiName CreatePayment
 * @apiGroup Payment
 * @apiDescription Create a new payment.
 *
 * @apiUse CreatePaymentRequestParams
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP 201 Created
 *  {
 *   "paymentId": "d1506dc0-7fbc-484c-ad45-1aed64c71b0f",
 *   "cardHolderName": "John Doe",
 *   "cardNumber": "**** **** **** 4444",
 *   "cardExpirationDate": "**\/24",
 *   "cvv": "***",
 *   "amount": 100
 *   "currency": "USD",
 *   "status": "success",
 *   "code": "payment_success"
 * }
 */

router.post("/", function (req: express.Request, res: express.Response) {
  void (async () => {
    try {
      const paymentRequest: CreatePaymentRequestParams =
        PaymentParamsValidator.validateCreatePaymentRequestParams(req.body);
      const paymentResponse =
        await PaymentService.createPayment(paymentRequest);
      res.status(201).send(paymentResponse);
    } catch (error) {
      respondToError(error, res);
    }
  })();
});

/**
 * @api {get} /payments/:paymentId
 * @apiName GetPayment
 * @apiGroup Payment
 * @apiDescription Get the status of a payment.
 *
 * @apiUse GetPaymentRequestParams
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP 200 OK
 * {
 *   "paymentId": "d1506dc0-7fbc-484c-ad45-1aed64c71b0f",
 *   "cardHolderName": "john doe",
 *   "cardNumber": "**** **** **** 4444",
 *   "cardExpirationDate": "**\/24",
 *   "cvv": "***",
 *   "amount": 405.63,
 *   "currency": "EUR",
 *   "status": "failed",
 *   "code": "card_velocity_exceeded"
 * }
 */
router.get(
  "/:paymentId",
  function (req: express.Request, res: express.Response) {
    void (async () => {
      try {
        const getPaymentStatusRequest: GetPaymentRequestParams =
          PaymentParamsValidator.validateGetPaymentRequestParams(req.params);
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
