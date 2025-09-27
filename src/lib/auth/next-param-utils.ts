export function validateNextParam(next: string | null): string {
  if (!next) return '/';
  
  if (next.startsWith('http') || next.startsWith('//')) {
    return '/';
  }
  
  if (next.length > 500) {
    return '/';
  }
  
  if (!next.startsWith('/')) {
    return '/';
  }
  
  if (next.startsWith('/login') || next.startsWith('/sign-up')) {
    return '/';
  }
  
  return next;
}

export function preserveNextParam(currentNext: string | null, newNext: string): string {
  return currentNext ? '' : `?next=${encodeURIComponent(newNext)}`;
}

export function getNextParamFromUrl(searchParams: URLSearchParams): string {
  const next = searchParams.get('next') || searchParams.get('liff.state');
  return validateNextParam(next);
}
