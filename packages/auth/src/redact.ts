/** Redact Authorization header values for logs/errors. */
export function redactAuthorizationHeader(value: string | undefined | null): string {
  if (!value) {
    return '[REDACTED]';
  }
  return '[REDACTED]';
}

/** Never log raw JWT material. */
export function redactJwt(token: string | undefined | null): string {
  if (!token) {
    return '[REDACTED]';
  }
  return '[REDACTED]';
}
