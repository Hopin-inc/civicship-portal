'use client';

export interface Logger {
  debug: (message: string, meta?: Record<string, any>) => void;
  info: (message: string, meta?: Record<string, any>) => void;
  warn: (message: string, meta?: Record<string, any>) => void;
  error: (message: string, meta?: Record<string, any>) => void;
}

const formatMeta = (meta?: Record<string, any>): string => {
  if (!meta) return '';
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch (e) {
    return ' [Meta formatting error]';
  }
};

const logger: Logger = {
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

export default logger;
