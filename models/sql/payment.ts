import Sequelize, { Model } from "sequelize";

import {
  type PaymentStatus,
  type PaymentStatusCode,
} from "../api/payment/params";

export class PaymentModel extends Model {
  declare id: number;
  declare uuid: string;
  declare cardHolderName: string;
  declare cardNumber: string;
  declare cardExpirationDate: string;
  declare cvv: string;
  declare amount: number;
  declare currency: string;
  declare status: PaymentStatus;
  declare statusCode: PaymentStatusCode;
  declare bankTransactionId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export default function (sequelize: Sequelize.Sequelize): typeof PaymentModel {
  return PaymentModel.init(
    {
      cardHolderName: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      cardNumber: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      cardExpirationDate: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      cvv: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      statusCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bankTransactionId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      indexes: [
        { name: "FIND_PAYMENTS_BY_UUID", fields: ["uuid"] },
        {
          name: "FIND_PAYMENTS_BY_BANK_TRANSACTION_ID",
          fields: ["bankTransactionId"],
        },
      ],
    },
  );
}
