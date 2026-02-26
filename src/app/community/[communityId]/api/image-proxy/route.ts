import { NextRequest, NextResponse } from 'next/server';
import serverLogger from '@/lib/logging/server';

const ALLOWED_BUCKETS = [
  'prod-civicship-storage-public',
  'kyoso-dev-civicship-storage-public',
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url || !url.startsWith('https://storage.googleapis.com/')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const bucketMatch = url.match(/^https:\/\/storage\.googleapis\.com\/([^\/]+)/);
  if (!bucketMatch || !ALLOWED_BUCKETS.includes(bucketMatch[1])) {
    serverLogger.warn('Rejected image-proxy request for disallowed bucket', { url });
    return NextResponse.json({ error: 'Bucket not allowed' }, { status: 403 });
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
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept',
      }
    });
  } catch (error) {
    serverLogger.error('Image proxy error', {
      error: error instanceof Error ? error.message : String(error),
      url,
      component: 'ImageProxyAPI'
    });
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
