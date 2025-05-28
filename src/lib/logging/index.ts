import clientLogger from './client';

let logger = clientLogger;

if (typeof window === 'undefined') {
  try {
    import('./server').then((module) => {
      logger = module.default;
    }).catch(() => {
      console.warn('Failed to load server logger, using client logger instead');
    });
  } catch (error) {
    console.warn('Error importing server logger, using client logger instead', error);
  }
}

export default logger;
