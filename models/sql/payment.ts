/**
 * This class contains the Sequelize model for the Payment entity.
 * It defines the schema of the Payment table in the database.
 *
 * Possible improvements:
 * Add a type safe way where the id, createdAt, and updatedAt fields do not need to be specified since they are automatically added by Sequelize.
 * Adjust the model to support the storage of the card holder name, card number, and other sensitive information in an encrypted form.
 */

import Sequelize, { Model } from "sequelize";

import {
  type PaymentStatus,
  type PaymentStatusCode,
} from "../api/payment/params";

export class PaymentModel extends Model {
  declare id: number;
  declare paymentId: string;
  declare cardHolderName: string;
  declare cardNumber: string;
  declare cardExpirationDate: string;
  declare cvv: string;
  declare amount: number;
  declare currency: string;
  declare status: PaymentStatus;
  declare statusCode: PaymentStatusCode;

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
      paymentId: {
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
        // Maximum amount is 99999999.99
        // This is an assumption of the maximum amount that can be paid.
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
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      indexes: [
        // Index to find a payment by its UUID for fast retrieval of the payment records.
        { name: "FIND_PAYMENTS_BY_UUID", fields: ["paymentId"] },
      ],
    },
  );
}
