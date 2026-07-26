import type { AuditSupportService } from './audit/audit-support.service';
import type { ConfigurationService } from './configuration/configuration.service';
import type { DiagnosticsService } from './diagnostics/diagnostics.service';
import type { EventPublisherService } from './events/event-publisher.service';
import type { FeatureFlagsService } from './feature-flags/feature-flags.service';
import type { LoggerService } from './logging/logger.service';
import type { SchedulerService } from './scheduling/scheduler.service';
import { SharedServiceError } from './types';

/**
 * Holds initialized shared service shells after module registration.
 */
export class SharedServiceRegistry {
  private configuration?: ConfigurationService;
  private logger?: LoggerService;
  private diagnostics?: DiagnosticsService;
  private featureFlags?: FeatureFlagsService;
  private auditSupport?: AuditSupportService;
  private eventPublisher?: EventPublisherService;
  private scheduler?: SchedulerService;
  private sealed = false;

  registerConfiguration(service: ConfigurationService): void {
    this.ensureOpen();
    this.configuration = service;
  }

  registerLogger(service: LoggerService): void {
    this.ensureOpen();
    this.logger = service;
  }

  registerDiagnostics(service: DiagnosticsService): void {
    this.ensureOpen();
    this.diagnostics = service;
  }

  registerFeatureFlags(service: FeatureFlagsService): void {
    this.ensureOpen();
    this.featureFlags = service;
  }

  registerAuditSupport(service: AuditSupportService): void {
    this.ensureOpen();
    this.auditSupport = service;
  }

  registerEventPublisher(service: EventPublisherService): void {
    this.ensureOpen();
    this.eventPublisher = service;
  }

  registerScheduler(service: SchedulerService): void {
    this.ensureOpen();
    this.scheduler = service;
  }

  seal(): void {
    if (
      !this.configuration ||
      !this.logger ||
      !this.diagnostics ||
      !this.featureFlags ||
      !this.auditSupport ||
      !this.eventPublisher ||
      !this.scheduler
    ) {
      throw new SharedServiceError(
        'Cannot seal SharedServiceRegistry: missing required services',
        'REGISTRY_INCOMPLETE',
      );
    }
    this.sealed = true;
  }

  isSealed(): boolean {
    return this.sealed;
  }

  getConfiguration(): ConfigurationService {
    return this.require(this.configuration, 'configuration');
  }

  getLogger(): LoggerService {
    return this.require(this.logger, 'logger');
  }

  getDiagnostics(): DiagnosticsService {
    return this.require(this.diagnostics, 'diagnostics');
  }

  getFeatureFlags(): FeatureFlagsService {
    return this.require(this.featureFlags, 'featureFlags');
  }

  getAuditSupport(): AuditSupportService {
    return this.require(this.auditSupport, 'auditSupport');
  }

  getEventPublisher(): EventPublisherService {
    return this.require(this.eventPublisher, 'eventPublisher');
  }

  getScheduler(): SchedulerService {
    return this.require(this.scheduler, 'scheduler');
  }

  private ensureOpen(): void {
    if (this.sealed) {
      throw new SharedServiceError('SharedServiceRegistry is sealed', 'REGISTRY_SEALED');
    }
  }

  private require<T>(value: T | undefined, name: string): T {
    if (!value) {
      throw new SharedServiceError(`Shared service not registered: ${name}`, 'SERVICE_MISSING');
    }
    return value;
  }
}
