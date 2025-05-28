let logger;

if (typeof window === 'undefined') {
  try {
    logger = require('./server').default;
  } catch (error) {
    console.warn('Error importing server logger, using client logger instead', error);
    logger = require('./client').default;
  }
} else {
  logger = require('./client').default;
}

export default logger;
