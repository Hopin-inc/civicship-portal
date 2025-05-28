import { NextRequest, NextResponse } from 'next/server';
import logger from "../../../lib/logging";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level = 'info', message, meta = {} } = body;
    
    if (!message) {
      return NextResponse.json({ error: 'Missing log message' }, { status: 400 });
    }
    
    if (!['debug', 'info', 'warn', 'error'].includes(level)) {
      return NextResponse.json({ error: 'Invalid log level' }, { status: 400 });
    }
    
    const enrichedMeta = {
      ...meta,
      source: 'client',
      timestamp: new Date().toISOString(),
    };
    
    switch (level) {
      case 'debug':
        logger.debug(message, enrichedMeta);
        break;
      case 'info':
        logger.info(message, enrichedMeta);
        break;
      case 'warn':
        logger.warn(message, enrichedMeta);
        break;
      case 'error':
        logger.error(message, enrichedMeta);
        break;
    }
    
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    logger.error('Client log API error', {
      component: 'ClientLogAPI',
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json({ error: 'Failed to process log' }, { status: 500 });
  }
}
