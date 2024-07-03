import { Sequelize } from "sequelize";
import initPaymentModel, { type PaymentModel } from "../../models/sql/payment";
import { DATA_DIR } from "../../constants";
import { LoggerService } from "../loggerService/index";
import * as Path from "path";
import { castError } from "../../lib/utils";

export class DatabaseService {
  private readonly sequelize: Sequelize;
  public readonly paymentModel: typeof PaymentModel;
  private readonly logger;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: Path.resolve(DATA_DIR + "/database/database.sqlite"),
      logging: false,
    });

    // Todo: initialize the models dynamically based on the models/sql directory
    this.paymentModel = initPaymentModel(this.sequelize);

    this.logger = new LoggerService();
  }

  public async initializeDatabase(): Promise<void> {
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
        `Unable to connect to the database: ${castedError.message}`,
      );
      throw error;
    }
  }

  async closeDatabase(): Promise<void> {
    await this.sequelize.close();
    this.logger.logInfo("Database connection closed");
  }
}

export default new DatabaseService();
