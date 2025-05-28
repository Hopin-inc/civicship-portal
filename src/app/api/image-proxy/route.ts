import { NextRequest, NextResponse } from 'next/server';
import logger from "@/lib/logging";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url || !url.startsWith('https://storage.googleapis.com/')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
  
  try {
    const response = await fetch(url, {
      headers: {
        'Origin': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.neo88.app',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    logger.error('Image proxy error', {
      component: 'ImageProxy',
      url,
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
