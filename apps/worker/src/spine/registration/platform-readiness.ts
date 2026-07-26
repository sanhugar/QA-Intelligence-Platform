/**
 * Process-local readiness flag for health probes.
 * Does not expose registration details.
 */
export class PlatformReadiness {
  private ready = false;

  setReady(value: boolean): void {
    this.ready = value;
  }

  isReady(): boolean {
    return this.ready;
  }
}

/** Singleton for the current host process. */
export const platformReadiness = new PlatformReadiness();
