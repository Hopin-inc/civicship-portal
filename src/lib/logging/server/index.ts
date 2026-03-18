import winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";
import { ILogger } from "@/lib/logging/type";
import { isLocal } from "@/lib/environment";

const LOG_LEVELS: Record<string, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const AUTH_MIN_LOG_LEVEL = "info";

const severity = winston.format((log) => {
  log.severity = log.level.toUpperCase();
  return log;
});

const authLevelFilter = winston.format((log) => {
  const isAuthLog = log.authType && log.authType !== "general";
  if (isAuthLog && (LOG_LEVELS[log.level] ?? 0) < (LOG_LEVELS[AUTH_MIN_LOG_LEVEL] ?? 1)) {
    return false;
  }
  return log;
});

const errorReport = winston.format((log) => {
  if (log instanceof Error) {
    log.err = {
      name: log.name,
      message: log.message,
      stack: log.stack,
    };
  }
  return log;
});

const format: winston.Logform.Format[] = [
  authLevelFilter(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  severity(),
  errorReport(),
];

if (!isLocal) {
  format.push(winston.format.json());
} else {
  format.push(winston.format.simple());
}

const transports: winston.transport[] = [];
if (isLocal) {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new LoggingWinston({
      redirectToStdout: true,
    }),
  );
  transports.push(new winston.transports.Console());
}

const winstonLogger = winston.createLogger({
  level: process.env.NEXT_PUBLIC_LOG_LEVEL || "info",
  format: winston.format.combine(...format),
  transports,
});

const serverLogger: ILogger = {
  debug: (message: string, meta?: Record<string, any>) => winstonLogger.debug(message, meta),
  info: (message: string, meta?: Record<string, any>) => winstonLogger.info(message, meta),
  warn: (message: string, meta?: Record<string, any>) => winstonLogger.warn(message, meta),
  error: (message: string, meta?: Record<string, any>) => winstonLogger.error(message, meta),
};

export default serverLogger;
