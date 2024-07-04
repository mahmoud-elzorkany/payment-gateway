/**
 * EventService is a simple event emitter that allows to subscribe to payment status updates.
 * It is mainly used by the acquiring bank service to notify the payment service of the update of a payment status that was previously pending.
 *
 * Improvements:
 * Refactor the service to be type generic and allow for multiple event types.
 * Add a method to unsubscribe from an event.
 */

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
