import { AppError } from '@ati/errors';
import type { HostBootConfig } from '@ati/config';

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

/** Host boot configuration (shared shape from @ati/config). */
export type HostConfiguration = HostBootConfig;

/** Host-specific shared-service error wrapping @ati/errors AppError. */
export class SharedServiceError extends AppError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = 'SharedServiceError';
  }
}
