import { EventEmitter } from "node:events";
import { type PaymentResult } from "../acquiringBank";

type PaymentStatusUpdateEvent = "paymentStatusUpdate";

export class EventService extends EventEmitter {
  private readonly eventEmitter = new EventEmitter();

  emit(event: PaymentStatusUpdateEvent, paymentResult: PaymentResult): boolean {
    return this.eventEmitter.emit(event, paymentResult);
  }

  subscribe(
    eventType: PaymentStatusUpdateEvent,
    handler: (paymentResult: PaymentResult) => void,
  ): void {
    this.eventEmitter.on(eventType, handler);
  }
}

export default new EventService();
