import { describe, it, expect } from '@jest/globals';
import {
  isValidCommunityId,
  resolveCommunityIdFromHost,
  normalizeCommunityId,
  getAuthForCommunity,
  COMMUNITY_IDS,
} from '../runtime-auth';

describe('runtime-auth', () => {
  describe('isValidCommunityId', () => {
    it('should return true for valid community IDs', () => {
      COMMUNITY_IDS.forEach(id => {
        expect(isValidCommunityId(id)).toBe(true);
      });
    });

    it('should return false for invalid community IDs', () => {
      expect(isValidCommunityId('invalid')).toBe(false);
      expect(isValidCommunityId('')).toBe(false);
      expect(isValidCommunityId(null)).toBe(false);
      expect(isValidCommunityId(undefined)).toBe(false);
      expect(isValidCommunityId(123)).toBe(false);
    });
  });

  describe('resolveCommunityIdFromHost', () => {
    it('should resolve production domains correctly', () => {
      expect(resolveCommunityIdFromHost('www.neo88.app')).toBe('neo88');
      expect(resolveCommunityIdFromHost('kibotcha.civicship.jp')).toBe('kibotcha');
      expect(resolveCommunityIdFromHost('dais.civicship.jp')).toBe('dais');
      expect(resolveCommunityIdFromHost('kotohira.civicship.app')).toBe('kotohira');
      expect(resolveCommunityIdFromHost('himeji-ymca.civicship.jp')).toBe('himeji-ymca');
      expect(resolveCommunityIdFromHost('izu.civicship.app')).toBe('izu');
    });

    it('should resolve dev domains correctly', () => {
      expect(resolveCommunityIdFromHost('dev.neo88.app')).toBe('neo88');
      expect(resolveCommunityIdFromHost('dev-kibotcha.civicship.jp')).toBe('kibotcha');
      expect(resolveCommunityIdFromHost('dev-dais.civicship.jp')).toBe('dais');
      expect(resolveCommunityIdFromHost('dev-kotohira.civicship.app')).toBe('kotohira');
      expect(resolveCommunityIdFromHost('dev-himeji-ymca.civicship.jp')).toBe('himeji-ymca');
      expect(resolveCommunityIdFromHost('dev-izu.civicship.app')).toBe('izu');
    });

    it('should resolve localhost to neo88', () => {
      expect(resolveCommunityIdFromHost('localhost')).toBe('neo88');
      expect(resolveCommunityIdFromHost('localhost:3000')).toBe('neo88');
    });

    it('should fallback to neo88 for unknown hosts', () => {
      expect(resolveCommunityIdFromHost('unknown.example.com')).toBe('neo88');
      expect(resolveCommunityIdFromHost('192.168.1.1')).toBe('neo88');
    });
  });

  describe('normalizeCommunityId', () => {
    it('should prioritize valid env community ID', () => {
      expect(normalizeCommunityId('kibotcha', 'www.neo88.app')).toBe('kibotcha');
      expect(normalizeCommunityId('dais', 'localhost')).toBe('dais');
    });

    it('should fallback to host resolution when env ID is null', () => {
      expect(normalizeCommunityId(null, 'www.neo88.app')).toBe('neo88');
      expect(normalizeCommunityId(null, 'kibotcha.civicship.jp')).toBe('kibotcha');
    });

    it('should fallback to host resolution when env ID is invalid', () => {
      expect(normalizeCommunityId('invalid', 'www.neo88.app')).toBe('neo88');
      expect(normalizeCommunityId('', 'kibotcha.civicship.jp')).toBe('kibotcha');
    });
  });

  describe('getAuthForCommunity', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
      delete process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID;
      delete process.env.NEXT_PUBLIC_LIFF_ID;
      delete process.env.NEXT_PUBLIC_LINE_CLIENT;
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return env config when all env vars are set', () => {
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID = 'env-tenant';
      process.env.NEXT_PUBLIC_LIFF_ID = 'env-liff';
      process.env.NEXT_PUBLIC_LINE_CLIENT = 'env-line';

      const config = getAuthForCommunity('neo88');
      expect(config.tenantId).toBe('env-tenant');
      expect(config.liffId).toBe('env-liff');
      expect(config.lineClient).toBe('env-line');
    });

    it('should fallback to registry when env vars are missing', () => {
      const config = getAuthForCommunity('neo88');
      expect(config.tenantId).toBe('dummy-tenant-id');
      expect(config.liffId).toBe('dummy-liff-id');
      expect(config.lineClient).toBe('dummy-line-client');
    });

    it('should handle partial env config', () => {
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID = 'env-tenant';
      
      const config = getAuthForCommunity('neo88');
      expect(config.tenantId).toBe('env-tenant');
      expect(config.liffId).toBe('dummy-liff-id');
      expect(config.lineClient).toBe('dummy-line-client');
    });

    it('should work for all valid community IDs', () => {
      COMMUNITY_IDS.forEach(id => {
        const config = getAuthForCommunity(id);
        expect(config).toHaveProperty('tenantId');
        expect(config).toHaveProperty('liffId');
        expect(config).toHaveProperty('lineClient');
      });
    });

    it('should fallback to neo88 for invalid community ID', () => {
      const config = getAuthForCommunity('invalid');
      expect(config.tenantId).toBe('dummy-tenant-id');
      expect(config.liffId).toBe('dummy-liff-id');
      expect(config.lineClient).toBe('dummy-line-client');
    });
  });
});
