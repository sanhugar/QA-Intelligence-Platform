import type { PlatformStartupState, ValidationFailure } from './types';

export interface StartupReport {
  platformVersion: string;
  host: string;
  startupTimestamp: string;
  startupDurationMs: number;
  registrationDurationMs: number;
  platformReady: boolean;
  startupState: PlatformStartupState;
  registeredModules: string[];
  skippedModules: string[];
  failedModules: string[];
  registrationOrder: string[];
  validationFailures: ValidationFailure[];
}

export function createEmptyStartupReport(host: string, platformVersion: string): StartupReport {
  return {
    platformVersion,
    host,
    startupTimestamp: new Date(0).toISOString(),
    startupDurationMs: 0,
    registrationDurationMs: 0,
    platformReady: false,
    startupState: 'BOOTING',
    registeredModules: [],
    skippedModules: [],
    failedModules: [],
    registrationOrder: [],
    validationFailures: [],
  };
}
