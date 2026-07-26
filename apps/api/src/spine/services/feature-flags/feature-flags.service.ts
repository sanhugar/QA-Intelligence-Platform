import { SharedServiceError } from '../types';

/**
 * Feature flag reader shell. Flags are not Domain invariants.
 */
export class FeatureFlagsService {
  private initialized = false;
  private flags: Record<string, boolean> = {};

  initialize(flags: Record<string, boolean>): void {
    if (flags === null || typeof flags !== 'object' || Array.isArray(flags)) {
      throw new SharedServiceError('Feature flags source invalid', 'FEATURE_FLAGS_INVALID');
    }
    this.flags = { ...flags };
    this.initialized = true;
  }

  isEnabled(flag: string): boolean {
    this.ensureInitialized();
    return this.flags[flag] === true;
  }

  list(): Record<string, boolean> {
    this.ensureInitialized();
    return { ...this.flags };
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new SharedServiceError('Feature flags not initialized', 'FEATURE_FLAGS_NOT_INITIALIZED');
    }
  }
}
