// Enterprise Secret Masking and Sanitization


/**
 * Mask sensitive credentials and tokens within a string (command, log, error, prompt).
 */
export function maskSecrets(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  let sanitized = input;

  // Mask private keys first
  sanitized = sanitized.replace(
    /-----BEGIN\s+[A-Z\s]+PRIVATE\s+KEY-----[\s\S]*?-----END\s+[A-Z\s]+PRIVATE\s+KEY-----/gi,
    '-----BEGIN [MASKED PRIVATE KEY]-----'
  );

  // Mask user password assignment
  sanitized = sanitized.replace(
    /(password\s*=\s*)([^\s"]+)/gi,
    '$1"********"'
  );

  // Mask general password=, token=, secret=
  sanitized = sanitized.replace(
    /(password|passwd|pass|pwd|secret|api[_-]?key|token)\s*([=:])\s*["']?([^'"\s]+)["']?/gi,
    '$1$2"********"'
  );

  // Mask Bearer tokens
  sanitized = sanitized.replace(
    /(bearer\s+)[a-zA-Z0-9_\-\.]{15,}/gi,
    '$1[MASKED_TOKEN]'
  );

  return sanitized;
}

/**
 * Deep-sanitize object properties recursively for logs, audit trail, and AI context.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return maskSecrets(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('password') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('privatekey') ||
        lowerKey.includes('token') ||
        lowerKey.includes('apikey')
      ) {
        result[key] = '********';
      } else {
        result[key] = sanitizeObject(value);
      }
    }
    return result as T;
  }

  return obj;
}
