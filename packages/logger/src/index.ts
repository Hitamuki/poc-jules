import winston from 'winston';
import 'winston-mongodb'; // Required for MongoDB transport

const { format, transports, createLogger } = winston;
const { combine, timestamp, printf, colorize, errors, json, metadata } = format;

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const MONGO_LOG_URI = process.env.MONGO_LOG_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

const consoleFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  // Remove service from meta for console display if it's the default one to reduce noise
  const { service, ...restMeta } = meta;
  let log = `${ts} ${level}: ${stack || message}`;
  // Check if restMeta has any keys and is not just an empty object or only contains 'message'
  if (restMeta && Object.keys(restMeta).length > 0 && !(restMeta.hasOwnProperty('message') && Object.keys(restMeta).length === 1)) {
    const metaString = JSON.stringify(restMeta, null, NODE_ENV === 'development' ? 2 : 0);
    if (metaString !== '{}') {
       log += ` ${metaString}`; // Print meta on the same line for console for brevity
    }
  }
  return log;
});

const loggerTransports: winston.transport[] = [
  new transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      metadata({ fillExcept: ['message', 'level', 'timestamp', 'service'] }), // Capture all other keys in metadata
      consoleFormat
    ),
    handleExceptions: true,
    handleRejections: true,
  }),
];

if (MONGO_LOG_URI) {
  loggerTransports.push(
    new transports.MongoDB({
      level: LOG_LEVEL, // Log level for this transport
      db: MONGO_LOG_URI,
      options: {
        useUnifiedTopology: true,
      },
      collection: 'logs',
      format: combine(
        errors({ stack: true }),
        timestamp(),
        metadata(), // Capture all metadata
        json()
      ),
      // metaKey: 'meta', // Not strictly needed with metadata() formatter and modern winston-mongodb
      handleExceptions: true,
      handleRejections: true,
    } as any)
  );
} else {
  if (NODE_ENV !== 'test') { // Do not write log files during tests
    const logDir = 'logs'; // Or use an absolute path via an env variable
    // Ensure log directory exists or winston might fail silently or error out
    // import fs from 'fs';
    // if (!fs.existsSync(logDir)) {
    //   fs.mkdirSync(logDir, { recursive: true });
    // }
    loggerTransports.push(
      new transports.File({
        filename: `${logDir}/error.log`,
        level: 'error',
        format: combine(timestamp(), errors({ stack: true }), json()),
        handleExceptions: true,
        handleRejections: true,
      })
    );
    loggerTransports.push(
      new transports.File({
        filename: `${logDir}/combined.log`,
        format: combine(timestamp(), errors({ stack: true }), json()),
        handleExceptions: true,
        handleRejections: true,
      })
    );
  }
}

const logger = createLogger({
  level: LOG_LEVEL, // Default log level for the logger
  format: combine(
    timestamp(),
    errors({ stack: true }),
    metadata(), // Ensure metadata is captured globally
    json() // Default format if not overridden by transport
  ),
  defaultMeta: { service: 'application' }, // Default metadata for all logs
  transports: loggerTransports,
  exitOnError: false,
});

export default logger;
