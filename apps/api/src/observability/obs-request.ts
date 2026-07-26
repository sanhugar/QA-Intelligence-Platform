export const ATI_CORRELATION_REQUEST_KEY = 'atiCorrelationId';

export interface RequestWithObservability {
  [ATI_CORRELATION_REQUEST_KEY]?: string;
  originalUrl?: string;
  url?: string;
  path?: string;
  headers: Record<string, string | string[] | undefined>;
}

export function getRequestCorrelationId(req: RequestWithObservability): string | undefined {
  return req[ATI_CORRELATION_REQUEST_KEY];
}
