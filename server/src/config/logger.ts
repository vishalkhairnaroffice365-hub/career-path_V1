type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatMessage(level: LogLevel, message: string, meta?: any): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (!meta) {
    return `${prefix} ${message}`;
  }

  // Redact potential sensitive keys from logs
  const sanitizedMeta = sanitizeLogData(meta);
  return `${prefix} ${message} ${JSON.stringify(sanitizedMeta)}`;
}

function sanitizeLogData(data: any): any {
  if (!data || typeof data !== 'object') return data;

  const SENSITIVE_KEYS = ['password', 'token', 'jwt', 'secret', 'authorization', 'cookie', 'credentials'];

  if (Array.isArray(data)) {
    return data.map(sanitizeLogData);
  }

  const copy: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive))) {
      copy[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      copy[key] = sanitizeLogData(value);
    } else {
      copy[key] = value;
    }
  }
  return copy;
}

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(formatMessage('info', message, meta));
  },
  warn: (message: string, meta?: any) => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message: string, meta?: any) => {
    console.error(formatMessage('error', message, meta));
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};
