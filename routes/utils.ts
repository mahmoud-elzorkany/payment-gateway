import type * as express from 'express'
import { type PaymentError } from '../services/errors/paymentError'

export function respondToError (error: any, res: express.Response): void {
  if (error.name === 'ValidationError') {
    res.status(400).send({ error: error.name, message: error.message })
  } else if (error.name === 'PaymentError') {
    res.status((error as PaymentError).code).send({ error: error.name, message: error.message })
  } else {
    res.status(500).send({ error: error.name, message: error.message, stack: error.stack })
  }
}
