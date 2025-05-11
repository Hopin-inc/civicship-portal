'use client';

import React, { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useHeader } from '@/components/providers/HeaderProvider';
import { matchPaths } from '@/utils/path';

interface PathHierarchy {
  [path: string]: string;
}

const pathHierarchy: PathHierarchy = {
  '/activities': '/',
  '/search': '/activities',
  '/activities?q=': '/activities',
  '/activities/[id]': '/activities',
  '/activities/[id]/slots': '/activities/[id]',
  '/activities/[id]/confirm': '/activities/[id]/slots',
  '/activities/[id]/complete': '/activities/[id]',
  '/places': '/',
  '/places/[id]': '/places',
  '/users/me': '/',
  '/wallets': '/users/me',
  '/wallets/[id]': '/wallets',
  '/tickets': '/users/me',
  '/tickets/receive': '/',
};

export const PAGE_TYPES = {
  ACTIVITIES: "activities",
  SEARCH: "search",
  PLACES: "places",
  USER: "user",
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
  const { config, lastVisitedUrls } = useHeader() as any;

  const getPathPattern = useCallback((path: string): string => {
    const pathWithoutQuery = path.split('?')[0];
    
    const patterns = Object.keys(pathHierarchy);
    for (const pattern of patterns) {
      if (!pattern.includes('?') && matchPaths(pathWithoutQuery, pattern)) {
        return pattern;
      }
    }
    
    const segments = pathWithoutQuery.split('/');
    for (let i = 0; i < segments.length; i++) {
      if (/^[a-z0-9]{10,}$/i.test(segments[i])) {
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
    } else if (path.startsWith('/places')) {
      return PAGE_TYPES.PLACES;
    } else if (path.startsWith('/users') || path.startsWith('/wallets') || path.startsWith('/tickets')) {
      return PAGE_TYPES.USER;
    }
    return PAGE_TYPES.HOME;
  }, []);

  const isSearchResultPath = useCallback((path: string): boolean => {
    return path.startsWith('/activities') && path.includes('?q=');
  }, []);

  const getParentPath = useCallback((): string => {
    if (searchParams.has('back')) {
      const backRoute = searchParams.get('back');
      if (backRoute) {
        return backRoute;
      }
    }
    
    if (config.backTo) {
      return config.backTo;
    }
    
    if (isSearchResultPath(pathname)) {
      const previousSearchResults = Object.keys(lastVisitedUrls)
        .filter(key => lastVisitedUrls[key].startsWith('/activities') && 
                      lastVisitedUrls[key].includes('?q=') && 
                      lastVisitedUrls[key] !== pathname);
      
      if (previousSearchResults.length > 0) {
        return lastVisitedUrls[previousSearchResults[0]];
      }
    }
    
    const pathPattern = getPathPattern(pathname);
    
    if (searchParams.toString()) {
      const basePathWithQuery = `${pathPattern}?${searchParams.toString()}`;
      
      const queryPatterns = Object.keys(pathHierarchy).filter(p => p.includes('?'));
      for (const pattern of queryPatterns) {
        if (matchPaths(basePathWithQuery, pattern)) {
          return pathHierarchy[pattern];
        }
      }
      
      if (searchParams.has('q')) {
        const qPattern = `${pathPattern}?q=`;
        if (pathHierarchy[qPattern]) {
          return pathHierarchy[qPattern];
        }
      }
    }
    
    const patterns = Object.keys(pathHierarchy).filter(p => !p.includes('?'));
    for (const pattern of patterns) {
      if (matchPaths(pathPattern, pattern)) {
        return pathHierarchy[pattern];
      }
    }
    
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      segments.pop();
      return segments.length === 0 ? '/' : `/${segments.join('/')}`;
    }
    
    return '/';
  }, [pathname, config.backTo, getPathPattern, searchParams, lastVisitedUrls, getPageType, isSearchResultPath, matchPaths]);

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
