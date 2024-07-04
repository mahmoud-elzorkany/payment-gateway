/**
 * This file contains the DatabaseService class which is responsible for handling the database connection
 * and initializing the database models. It uses Sequelize as the ORM to interact with the database.
 *
 * Note: The database is initialized with an SQLite database for simplicity.
 * In a production environment, a more robust database like MYSQL should be used.
 *
 * Possible improvements:
 * - Implement a more robust database connection using credential.
 * - Add support for multiple database types (e.g., MySQL, PostgreSQL).
 * - Implement a database update system to manage database schema changes.
 * - Initialize the models dynamically based on the models/sql directory.
 *
 * Cloud architecture consideration:
 * In a cloud environment, for applications that requires transactional data like payments, a relational database is recommended for consistency and ACID compliance.
 * A managed database service like Amazon Aurora can be used as it is compatible with MySQL and PostgreSQL.
 * Since relational database are not horizontally scalable, a read replica can be used to offload read queries from the primary database.
 * Also, we can use a cache like Amazon ElastiCache to cache read queries and reduce the load on the database.
 */

import { Sequelize } from "sequelize";
import initPaymentModel, { type PaymentModel } from "../../models/sql/payment";
import { DATA_DIR } from "../../constants";
import { LoggerService } from "../loggerService/index";
import * as Path from "path";
import { castError, printErrorWithStack } from "../errors/errorUtils";

export class DatabaseService {
  private readonly sequelize: Sequelize;
  readonly paymentModel: typeof PaymentModel;
  private readonly logger;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: Path.resolve(DATA_DIR + "/database/database.sqlite"),
      logging: false,
    });

    this.paymentModel = initPaymentModel(this.sequelize);

    this.logger = new LoggerService();
  }

  async initializeDatabase(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      this.logger.logInfo(
        "Connection to the database has been established successfully",
      );

      await this.sequelize.sync();
      this.logger.logInfo("Database successfully synchronized");
    } catch (error: unknown) {
      const castedError = castError(error);
      this.logger.logError(
        `Unable to connect to the database: ${printErrorWithStack(castedError)}`,
      );
      throw error;
    }
  }

  async closeDatabase(): Promise<void> {
    await this.sequelize.close();
    this.logger.logInfo("Database connection closed");
  }
}
// The service is exported as a singleton instance.
export default new DatabaseService();
