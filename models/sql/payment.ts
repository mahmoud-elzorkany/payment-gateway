import Sequelize, { Model } from 'sequelize'

import { type PaymentStatus } from '../api/payment/params'

export class PaymentModel extends Model {
  declare cardHolderFirstName: string
  declare cardHolderLastName: string
  declare cardNumber: number
  declare cardExpirationDate: string
  declare cvv: string
  declare amount: number
  declare currency: string
  declare status: PaymentStatus
}

export default function (sequelize: Sequelize.Sequelize): typeof PaymentModel {
  return PaymentModel.init({
    cardHolderFirstName: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    cardHolderLastName: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    cardNumber: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cardExpirationDate: {
      type: Sequelize.STRING(5),
      allowNull: false
    },
    cvv: {
      type: Sequelize.STRING(3),
      allowNull: false
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING(3),
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments'
  })
}
