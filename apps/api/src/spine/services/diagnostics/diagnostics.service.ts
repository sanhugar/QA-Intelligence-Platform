import type { HostConfiguration } from '../types';
import { SharedServiceError } from '../types';

export interface DiagnosticsSnapshot {
  host: string;
  platformVersion: string;
  nodeEnv: string;
  registeredModuleCount: number;
  timestamp: string;
}

/**
 * In-process diagnostics shell. No secret leakage. Not a monitoring product.
 */
export class DiagnosticsService {
  private initialized = false;
  private config: HostConfiguration | null = null;
  private registeredModuleCount = 0;

  initialize(config: HostConfiguration, registeredModuleCount: number): void {
    if (!config?.host) {
      throw new SharedServiceError('Diagnostics requires configuration', 'DIAGNOSTICS_INVALID');
    }
    this.config = config;
    this.registeredModuleCount = registeredModuleCount;
    this.initialized = true;
  }

  snapshot(): DiagnosticsSnapshot {
    if (!this.initialized || !this.config) {
      throw new SharedServiceError('Diagnostics not initialized', 'DIAGNOSTICS_NOT_INITIALIZED');
    }
    return {
      host: this.config.host,
      platformVersion: this.config.platformVersion,
      nodeEnv: this.config.nodeEnv,
      registeredModuleCount: this.registeredModuleCount,
      timestamp: new Date().toISOString(),
    };
  }
}
