import { NextRequest, NextResponse } from 'next/server';
import serverLogger from '@/lib/logging/server';

const ALLOWED_BUCKETS = [
  'prod-civicship-storage-public',
  'kyoso-dev-civicship-storage-public',
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  let safeUrl: string;
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== 'https:' || parsed.hostname !== 'storage.googleapis.com') {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Extract bucket name from first path segment and validate against allow-list
    const pathSegments = parsed.pathname.split('/').filter(Boolean);
    const bucketName = pathSegments[0];

    if (!bucketName || !ALLOWED_BUCKETS.includes(bucketName)) {
      serverLogger.warn('Rejected image-proxy request for disallowed bucket', { url });
      return NextResponse.json({ error: 'Bucket not allowed' }, { status: 403 });
    }

    const objectPath = pathSegments.slice(1).join('/');
    const normalizedPath = objectPath ? `/${bucketName}/${objectPath}` : `/${bucketName}`;

    safeUrl = `https://storage.googleapis.com${normalizedPath}${parsed.search}`;
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const response = await fetch(safeUrl, {
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
