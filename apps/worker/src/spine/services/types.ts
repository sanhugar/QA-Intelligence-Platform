export type PlatformEventKind =
  | 'platform'
  | 'operational'
  | 'module'
  | 'diagnostic';

export interface PlatformEvent {
  kind: PlatformEventKind;
  name: string;
  timestamp: string;
  payload?: Record<string, unknown>;
}

export interface AuditRecord {
  action: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface ScheduleIntent {
  name: string;
  runAt: string;
  payload?: Record<string, unknown>;
}

export interface HostConfiguration {
  host: 'api' | 'worker';
  platformVersion: string;
  nodeEnv: string;
  logLevel: string;
  port: number;
  featureFlags: Record<string, boolean>;
}

export class SharedServiceError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'SharedServiceError';
  }
}
