/**
 * This file contains the main entry point of the application.
 * It initializes the data folder where logs and database files are stored,
 * Then it initializes the database and starts the server.
 *
 * Possible improvements:
 * Refactor the functions into a web service to allow better extendability and maintainability.
 */

import * as express from "express";
import * as fs from "fs-extra";
import * as paymentsRouter from "./routes/payments";
import DatabaseService from "./services/databaseService";
import LoggerService from "./services/loggerService";
import * as Path from "path";
import { DATA_DIR, PORT_NUMBER } from "./constants";
import { castError, printErrorWithStack } from "././services/errors/errorUtils";

const app = express();

// Start the payment gateway
// The main entry point of the application
startGateway()
  .then(() => {
    LoggerService.logInfo("Payment gateway started successfully");
  })
  .catch((error: unknown) => {
    const castedError = castError(error);
    LoggerService.logError(
      `Failed to start payment gateway: ${printErrorWithStack(castedError)}`,
    );
  });

// Handle SIGINT and SIGTERM signals
process.on("SIGINT", () => {
  void stopGateway();
});
process.on("SIGTERM", () => {
  void stopGateway();
});

/**
 * Initialize the data folder, database and server
 */
async function startGateway(): Promise<void> {
  initializeDataFolder();
  await initializeDatabase();
  initializeServer();
}

/**
 * Stop the payment gateway
 * Close the database connection and exit the process
 */
async function stopGateway(): Promise<void> {
  try {
    LoggerService.logInfo("Stopping payment gateway");
    await DatabaseService.closeDatabase();
  } catch (error) {
    const castedError = castError(error);
    LoggerService.logError(
      `Error while stopping the payment gateway: ${printErrorWithStack(castedError)}`,
    );
  }
  process.exit(0);
}

/**
 * Initialize the data folder for the payment gateway to store logs and database files
 * If the folder does not exist, it will be created
 */
function initializeDataFolder(): void {
  fs.ensureDirSync(Path.resolve(DATA_DIR));
  LoggerService.logInfo("Data folder initialized");
}

/**
 * Initialize the database for the payment gateway to store payment records
 */
async function initializeDatabase(): Promise<void> {
  await DatabaseService.initializeDatabase();
}

/**
 * Initialize the server by configuring middleware and loading routes and listen on the specified port
 */
function initializeServer(): void {
  configureServer();
  loadRoutes();
  listen();
}

/**
 * Configure the middleware for the server.
 */
function configureServer(): void {
  app.use(express.json());
  app.use((req: express.Request, res: express.Response, next) => {
    LoggerService.logInfo(
      `Server request:${req.method}, Request route:${req.hostname}${req.path}`,
    );
    next();
  });
}

/**
 * Load the routes
 * Improve the function by adding a dynamic way to load routes from the routes directory
 */
function loadRoutes(): void {
  app.use("/payments", paymentsRouter);
  LoggerService.logInfo("Routes loaded");
}

/**
 * Starts the server and listen on the specified port
 */
function listen(): void {
  app.listen(PORT_NUMBER);
  LoggerService.logInfo(`Server is listening on port ${PORT_NUMBER}`);
}
