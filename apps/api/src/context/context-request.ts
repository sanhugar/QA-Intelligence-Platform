import type { AtiExecutionContext } from '@ati/context';

export const ATI_EXECUTION_CONTEXT_KEY = 'atiExecutionContext';

export type RequestWithExecutionContext = {
  method?: string;
  url?: string;
  path?: string;
  originalUrl?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  [ATI_EXECUTION_CONTEXT_KEY]?: AtiExecutionContext;
};

export function getHeaderValue(
  headers: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const raw = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(raw)) {
    return raw[0];
  }
  return raw;
}
