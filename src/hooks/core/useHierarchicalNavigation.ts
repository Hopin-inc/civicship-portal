'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useHeader } from '@/contexts/HeaderContext';
import { useCallback } from 'react';

interface PathHierarchy {
  [path: string]: string;
}

const pathHierarchy: PathHierarchy = {
  '/activities/[id]': '/activities',
  '/search': '/',
};

export const PAGE_TYPES = {
  ACTIVITIES: "activities",
  SEARCH: "search",
  HOME: "home",
};

/**
 * 階層ナビゲーションを管理するカスタムフック
 * 現在のパスから親階層のパスを特定します
 */
export const useHierarchicalNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { config, lastVisitedUrls } = useHeader();

  const getPathPattern = useCallback((path: string): string => {
    const segments = path.split('/');
    
    for (let i = 0; i < segments.length; i++) {
      if (/^\d+$/.test(segments[i])) {
        segments[i] = '[id]';
      }
    }
    
    return segments.join('/');
  }, []);

  const getPageType = useCallback((path: string): string => {
    if (path.startsWith('/activities')) {
      return PAGE_TYPES.ACTIVITIES;
    } else if (path.startsWith('/search')) {
      return PAGE_TYPES.SEARCH;
    }
    return PAGE_TYPES.HOME;
  }, []);

  const getParentPath = useCallback((): string => {
    if (config.backTo) {
      return config.backTo;
    }
    
    const currentPageType = getPageType(pathname);
    const previousPageTypes = Object.keys(PAGE_TYPES).filter(
      key => PAGE_TYPES[key as keyof typeof PAGE_TYPES] !== currentPageType
    );
    
    for (const typeKey of previousPageTypes) {
      const type = PAGE_TYPES[typeKey as keyof typeof PAGE_TYPES];
      if (lastVisitedUrls[type]) {
        return lastVisitedUrls[type];
      }
    }
    
    const pathPattern = getPathPattern(pathname);
    if (pathHierarchy[pathPattern]) {
      return pathHierarchy[pathPattern];
    }
    
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      segments.pop();
      return segments.length === 0 ? '/' : `/${segments.join('/')}`;
    }
    
    return '/';
  }, [pathname, config.backTo, getPathPattern, lastVisitedUrls, getPageType]);

  const isChildOf = useCallback((parentPath: string): boolean => {
    return pathname.startsWith(parentPath) && pathname !== parentPath;
  }, [pathname]);

  const navigateBack = useCallback(() => {
    const parentPath = getParentPath();
    router.push(parentPath);
  }, [getParentPath, router]);

  return {
    pathname,
    searchParams,
    getParentPath,
    isChildOf,
    navigateBack,
    getPageType
  };
};

export default useHierarchicalNavigation;
