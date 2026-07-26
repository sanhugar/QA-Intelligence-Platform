import type { AtiPrincipal } from '@ati/auth';

export const ATI_PRINCIPAL_REQUEST_KEY = 'atiPrincipal';

export type RequestWithPrincipal = {
  method?: string;
  url?: string;
  path?: string;
  originalUrl?: string;
  headers: Record<string, string | string[] | undefined>;
  [ATI_PRINCIPAL_REQUEST_KEY]?: AtiPrincipal;
};

export function getRequestPath(req: RequestWithPrincipal): string {
  const raw = req.path ?? req.originalUrl ?? req.url ?? '/';
  return raw.split('?')[0] || '/';
}

export function extractBearerToken(
  authorization: string | string[] | undefined,
): string | null {
  const header = Array.isArray(authorization) ? authorization[0] : authorization;
  if (!header) {
    return null;
  }
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1]?.trim() || null;
}
