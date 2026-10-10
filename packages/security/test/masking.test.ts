import { describe, it, expect } from 'vitest';
import { maskSecrets } from '../src/masking.js';

describe('maskSecrets Security Module', () => {
  it('should mask plain text passwords in CLI command strings', () => {
    const raw = '/user add name=admin password=MySecretPassword123 group=full';
    const masked = maskSecrets(raw);
    expect(masked).not.toContain('MySecretPassword123');
    expect(masked).toContain('password="********"');
  });

  it('should mask PEM private keys', () => {
    const rawKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0Y1+xyz123fakekeydata456
abcdefghijklmnopqrstuvwxyz==
-----END RSA PRIVATE KEY-----`;
    const masked = maskSecrets(rawKey);
    expect(masked).not.toContain('fakekeydata');
    expect(masked).toContain('-----BEGIN [MASKED PRIVATE KEY]-----');
  });

  it('should mask bearer tokens and API keys', () => {
    const raw = 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secret';
    const masked = maskSecrets(raw);
    expect(masked).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secret');
    expect(masked).toContain('Bearer [MASKED_TOKEN]');
  });

  it('should handle empty or non-string inputs safely', () => {
    expect(maskSecrets('')).toBe('');
    // @ts-expect-error test non-string
    expect(maskSecrets(null)).toBe(null);
  });
});
