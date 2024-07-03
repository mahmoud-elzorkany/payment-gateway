import * as express from "express";
import { type Express } from "express";
import LoggerService from "../loggerService/index";
import DatabaseService from "../../services/databaseService/index";
import * as fs from "fs-extra";
import * as Path from "path";
import { DATA_DIR, PORT_NUMBER } from "../../constants";
import * as paymentsRouter from "../../routes/payments";
import { castError } from "../../lib/utils";

export class WebServer {
  private readonly app: Express;

  constructor() {
    this.app = express();
  }

  /**
   * Start the payment gateway
   */
  async start(): Promise<void> {
    this.initializeDataFolder();
    await this.initializeDatabase();
    this.initializeServer();
  }

  /**
   * Stop the payment gateway
   */
  stop(): void {
    void (async () => {
      try {
        LoggerService.logInfo("Stopping payment gateway");
        await DatabaseService.closeDatabase();
      } catch (error: unknown) {
        const castedError = castError(error);
        LoggerService.logError(
          `Error while stopping the payment gateway: ${castedError.message}`,
        );
      }
    })();
    process.exit(0);
  }

  /**
   * Initialize the data folder
   */
  private initializeDataFolder(): void {
    fs.ensureDirSync(Path.resolve(DATA_DIR));
    LoggerService.logInfo("Data folder initialized");
  }

  /**
   * Initialize the database
   */
  private async initializeDatabase(): Promise<void> {
    await DatabaseService.initializeDatabase();
  }

  /**
   * Initialize the server
   */
  private initializeServer(): void {
    this.configureServer();
    this.loadRoutes();
    this.startServer();
  }

  private configureServer(): void {
    this.app.use(express.json());
  }

  /**
   * Load the routes
   */
  private loadRoutes(): void {
    this.app.use("/payments", paymentsRouter);
    LoggerService.logInfo("Routes loaded");
  }

  private startServer(): void {
    this.app.listen(PORT_NUMBER);
    LoggerService.logInfo(`Server is listening on port ${PORT_NUMBER}`);
  }
}
