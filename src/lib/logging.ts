import logger from './logging/index';
import type { Logger } from './logging/client';

const typedLogger: Logger = logger as Logger;
export default typedLogger;
