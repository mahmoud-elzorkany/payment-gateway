import * as express from 'express'
import { paymentRequestSchema } from '../models/api/payment/validators'
import { type CreatePaymentRequestParams } from '../models/api/payment/params'

const router = express.Router()

router.post('/', function (req: express.Request, res: express.Response) {
  const paymentRequest: CreatePaymentRequestParams = paymentRequestSchema.validateSync(req.body, { abortEarly: false, stripUnknown: false })
  res.status(200).send(paymentRequest)
})

router.get(
  '/:id/status',
  function (req: express.Request, res: express.Response) {
    res.send('inside payments route')
  })

export = router
