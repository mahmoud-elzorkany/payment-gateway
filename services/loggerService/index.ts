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
        // Console transport
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(), // Colorize console output
            this.logFormat,
          ),
        }),
        // File transport
        new winston.transports.File({
          filename: Path.resolve(DATA_DIR + "/logs/paymentGateway.log"),
        }),
      ],
      exceptionHandlers: [
        // exceptions log file appender
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.colorize(), // Colorize console output
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
