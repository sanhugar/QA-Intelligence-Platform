import { PlatformStartupError } from './errors';
import { ModuleRegistrationValidator } from './module-registration-validator';
import { PlatformRegistry } from './platform-registry';
import { platformReadiness } from './platform-readiness';
import { RegistrationOrderResolver } from './registration-order-resolver';
import { createEmptyStartupReport, type StartupReport } from './startup-report';
import type { ModuleRegistrationDescriptor } from './types';

export interface PlatformStartupCoordinatorOptions {
  host: string;
  platformVersion: string;
  /** Declared module shells for discovery (platform-owned list). */
  moduleShells: readonly ModuleRegistrationDescriptor[];
  logger?: Pick<Console, 'log' | 'error'>;
}

/**
 * Deterministic platform startup FSM:
 * BOOTING → DISCOVERING → VALIDATING → REGISTERING → READY | FAILED
 */
export class PlatformStartupCoordinator {
  private readonly registry = new PlatformRegistry();
  private readonly validator = new ModuleRegistrationValidator();
  private readonly orderResolver = new RegistrationOrderResolver();
  private lastReport: StartupReport;

  constructor(private readonly options: PlatformStartupCoordinatorOptions) {
    this.lastReport = createEmptyStartupReport(options.host, options.platformVersion);
  }

  getRegistry(): PlatformRegistry {
    return this.registry;
  }

  getStartupReport(): StartupReport {
    return this.lastReport;
  }

  async start(): Promise<StartupReport> {
    const startedAt = Date.now();
    const registrationStartedAt = { value: 0 };
    this.registry.clearForStartup();
    platformReadiness.setReady(false);
    this.registry.setStartupState('BOOTING');

    const log = this.options.logger ?? console;

    try {
      this.registry.setStartupState('DISCOVERING');
      for (const shell of this.options.moduleShells) {
        this.registry.addDiscovered(shell);
      }

      this.registry.setStartupState('VALIDATING');
      const discovered = this.registry.getDiscovered();
      const failures = this.validator.validate(discovered);
      for (const failure of failures) {
        this.registry.addFailure(failure);
      }
      if (failures.length > 0) {
        throw new PlatformStartupError('Module registration validation failed', 'VALIDATION_FAILED');
      }

      const enabled = discovered.filter((d) => d.enabled);
      const skipped = discovered.filter((d) => !d.enabled).map((d) => d.moduleId);
      this.registry.setValidated(enabled);

      this.registry.setStartupState('REGISTERING');
      registrationStartedAt.value = Date.now();
      const order = this.orderResolver.resolve(enabled);
      this.registry.setRegistrationOrder(order);

      const byId = new Map(enabled.map((d) => [d.moduleId, d]));
      for (const moduleId of order) {
        const descriptor = byId.get(moduleId)!;
        await descriptor.hooks.onRegister();
        this.registry.markRegistered(descriptor, 'REGISTERED');
        await descriptor.hooks.onInit();
        this.registry.updateLifecycle(moduleId, 'INITIALIZED');
        await descriptor.hooks.onReady();
        this.registry.updateLifecycle(moduleId, 'READY');
      }

      this.registry.setStartupState('READY');
      platformReadiness.setReady(true);

      this.lastReport = this.buildReport({
        startedAt,
        registrationStartedAt: registrationStartedAt.value,
        skipped,
        failedModules: [],
      });
      log.log(
        JSON.stringify({
          message: 'Platform startup complete',
          host: this.options.host,
          platformReady: true,
          registeredCount: this.lastReport.registeredModules.length,
          registrationOrder: this.lastReport.registrationOrder,
        }),
      );
      return this.lastReport;
    } catch (error) {
      this.registry.setStartupState('FAILED');
      platformReadiness.setReady(false);
      const failedModules = [
        ...new Set(
          this.registry
            .getFailures()
            .map((f) => f.moduleId)
            .filter((id): id is string => Boolean(id)),
        ),
      ];
      this.lastReport = this.buildReport({
        startedAt,
        registrationStartedAt: registrationStartedAt.value || startedAt,
        skipped: this.registry.getDiscovered().filter((d) => !d.enabled).map((d) => d.moduleId),
        failedModules,
      });
      log.error(
        JSON.stringify({
          message: 'Platform startup failed',
          host: this.options.host,
          platformReady: false,
          validationFailures: this.lastReport.validationFailures,
          error: error instanceof Error ? error.message : String(error),
        }),
      );
      throw error;
    }
  }

  private buildReport(input: {
    startedAt: number;
    registrationStartedAt: number;
    skipped: string[];
    failedModules: string[];
  }): StartupReport {
    const endedAt = Date.now();
    return {
      platformVersion: this.options.platformVersion,
      host: this.options.host,
      startupTimestamp: new Date(input.startedAt).toISOString(),
      startupDurationMs: endedAt - input.startedAt,
      registrationDurationMs:
        this.registry.getStartupState() === 'FAILED' && input.registrationStartedAt === input.startedAt
          ? 0
          : endedAt - input.registrationStartedAt,
      platformReady: this.registry.isReady(),
      startupState: this.registry.getStartupState(),
      registeredModules: [...this.registry.getRegisteredIds()],
      skippedModules: input.skipped,
      failedModules: input.failedModules,
      registrationOrder: [...this.registry.getRegistrationOrder()],
      validationFailures: [...this.registry.getFailures()],
    };
  }
}
