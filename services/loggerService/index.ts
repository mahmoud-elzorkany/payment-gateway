/**
 * Logger service is a simple logger that logs messages regarding different events in the system
 * to the console and to a file.
 * Exceptions are logged to a separate file.
 * It uses the winston library to log messages.
 *
 *  The main use cases of logging errors and information messages are being able to debug and troubleshoot the system.
 *  Also logs can be helpful in tracking the system's behavior and performance and extracting useful insights.
 *
 * Improvements:
 * Implement a log rotation strategy to manage log file rotation and prevent the log file from growing indefinitely.
 *
 * Cloud architecture consideration:
 * In a cloud environment, logs can be sent to a centralized logging service like AWS CloudWatch.
 * Which allows for easy monitoring of logs across multiple services and instances.
 *
 */

import * as winston from "winston";
import { DATA_DIR } from "../../constants";
import * as Path from "path";

export class LoggerService {
  private readonly logFormat = winston.format.printf(
    ({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    },
  );

  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        this.logFormat,
      ),
      transports: [
        // Log to console
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            this.logFormat,
          ),
        }),
        // Log to file
        new winston.transports.File({
          filename: Path.resolve(DATA_DIR + "/logs/paymentGateway.log"),
        }),
      ],
      exceptionHandlers: [
        // Log exceptions to a separate file
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.colorize(),
            this.logFormat,
          ),
          filename: Path.resolve(
            DATA_DIR + "/logs/paymentGateway.exceptions.log",
          ),
        }),
      ],
    });
  }

  logInfo(message: string): void {
    this.logger.log("info", message);
  }

  logError(message: string): void {
    this.logger.log("error", message);
  }

  logWarn(message: string): void {
    this.logger.log("warn", message);
  }

  logDebug(message: string): void {
    this.logger.log("debug", message);
  }
}

export default new LoggerService();
