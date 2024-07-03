import {
  type PaymentStatus,
  type PaymentStatusCode,
  REJECTION_CODES,
} from "../../models/api/payment/params";
import EventService from "../eventService";
import { generateRandomIndex } from "./utils";
import LoggerService from "../loggerService";

export interface PaymentResult {
  status: PaymentStatus;
  code: PaymentStatusCode;
  bankTransactionId: string;
}

export class AcquiringBankService {
  private static readonly acceptedCardsList: string[] = [
    "378734493671000",
    "5610591081018250",
    "4111111111111111",
    "30569309025904",
  ];

  private static readonly declinedCardsList: string[] = [
    "378282246310005",
    "371449635398431",
    "5200828282828210",
    "2223003122003222",
  ];

  processPayment(cardNumber: string): PaymentResult {
    const transactionId = crypto.randomUUID();
    const paymentResult: PaymentResult = {
      code: "processing_payment",
      status: "pending",
      bankTransactionId: transactionId,
    };
    if (AcquiringBankService.acceptedCardsList.includes(cardNumber)) {
      paymentResult.status = "success";
      paymentResult.code = "successful_payment";
    } else if (AcquiringBankService.declinedCardsList.includes(cardNumber)) {
      paymentResult.status = "failed";
      paymentResult.code =
        REJECTION_CODES[generateRandomIndex(REJECTION_CODES.length)];
    } else {
      paymentResult.status = "pending";
      paymentResult.code = "processing_payment";
      this.simulatePendingPayment(transactionId);
    }
    return paymentResult;
  }

  private simulatePendingPayment(transactionId: string): void {
    const paymentStatusList: PaymentStatus[] = ["success", "failed"];
    const randomStatus =
      paymentStatusList[generateRandomIndex(paymentStatusList.length)];

    const paymentPayload: PaymentResult = {
      status: randomStatus,
      code:
        randomStatus === "success"
          ? "successful_payment"
          : REJECTION_CODES[generateRandomIndex(REJECTION_CODES.length)],
      bankTransactionId: transactionId,
    };

    setTimeout(() => {
      LoggerService.logInfo(`Status update for transaction ${transactionId}`);
      EventService.emit("paymentStatusUpdate", paymentPayload);
    }, 30000);
  }
}

export default new AcquiringBankService();
