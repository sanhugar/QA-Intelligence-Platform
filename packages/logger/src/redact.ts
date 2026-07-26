const SENSITIVE_KEY = /(password|secret|token|authorization|api[_-]?key)/i;
const JWT_LIKE =
  /^Bearer\s+[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/i;
const RAW_JWT_LIKE = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;

function redactValue(value: unknown): unknown {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (JWT_LIKE.test(trimmed) || RAW_JWT_LIKE.test(trimmed)) {
      return '[REDACTED]';
    }
    return value;
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return redact(value as Record<string, unknown>);
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }
  return value;
}

/** Recursively redact sensitive field names and bearer/JWT-shaped values. */
export function redact(fields: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (SENSITIVE_KEY.test(key)) {
      out[key] = '[REDACTED]';
    } else {
      out[key] = redactValue(value);
    }
  }
  return out;
}
