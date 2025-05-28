const isBrowser = typeof window !== 'undefined';

interface Logger {
  debug: (message: string, meta?: Record<string, any>) => void;
  info: (message: string, meta?: Record<string, any>) => void;
  warn: (message: string, meta?: Record<string, any>) => void;
  error: (message: string, meta?: Record<string, any>) => void;
}

const createBrowserLogger = (): Logger => {
  const formatMeta = (meta?: Record<string, any>): string => {
    if (!meta) return '';
    try {
      return ` ${JSON.stringify(meta)}`;
    } catch (e) {
      return ' [Meta formatting error]';
    }
  };

  return {
    debug: (message: string, meta?: Record<string, any>) => {
      console.debug(`[DEBUG] ${message}${formatMeta(meta)}`);
    },
    info: (message: string, meta?: Record<string, any>) => {
      console.info(`[INFO] ${message}${formatMeta(meta)}`);
    },
    warn: (message: string, meta?: Record<string, any>) => {
      console.warn(`[WARN] ${message}${formatMeta(meta)}`);
    },
    error: (message: string, meta?: Record<string, any>) => {
      console.error(`[ERROR] ${message}${formatMeta(meta)}`);
    }
  };
};

const createServerLogger = (): Logger => {
  const winston = require('winston');
  const { LoggingWinston } = require('@google-cloud/logging-winston');
  
  const isLocal = process.env.ENV === "LOCAL";

  const severity = winston.format((log: any) => {
    log.severity = log.level.toUpperCase();
    return log;
  });

  const errorReport = winston.format((log: any) => {
    if (log instanceof Error) {
      log.err = {
        name: log.name,
        message: log.message,
        stack: log.stack,
      };
    }
    return log;
  });

  const format: any[] = [
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

  const transports: any[] = [];
  if (isLocal) {
    transports.push(new winston.transports.Console());
  } else {
    transports.push(new LoggingWinston());
  }

  const winstonLogger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(...format),
    transports,
  });

  return {
    debug: (message: string, meta?: Record<string, any>) => winstonLogger.debug(message, meta),
    info: (message: string, meta?: Record<string, any>) => winstonLogger.info(message, meta),
    warn: (message: string, meta?: Record<string, any>) => winstonLogger.warn(message, meta),
    error: (message: string, meta?: Record<string, any>) => winstonLogger.error(message, meta)
  };
};

let logger: Logger;

try {
  logger = isBrowser ? createBrowserLogger() : createServerLogger();
} catch (error) {
  console.warn('Failed to initialize server logger, falling back to browser logger', error);
  logger = createBrowserLogger();
}

export default logger;
