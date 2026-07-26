export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function normalizeLogLevel(value: string): LogLevel | null {
  const v = value.trim().toLowerCase();
  if (v === 'debug' || v === 'info' || v === 'warn' || v === 'error') {
    return v;
  }
  return null;
}

export function shouldLog(configured: LogLevel, level: LogLevel): boolean {
  const order: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  return order.indexOf(level) >= order.indexOf(configured);
}
