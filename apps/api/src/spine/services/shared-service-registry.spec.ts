import { AuditSupportService } from './audit/audit-support.service';
import { ConfigurationService } from './configuration/configuration.service';
import { DiagnosticsService } from './diagnostics/diagnostics.service';
import { EventPublisherService } from './events/event-publisher.service';
import { FeatureFlagsService } from './feature-flags/feature-flags.service';
import { LoggerService } from './logging/logger.service';
import { SchedulerService } from './scheduling/scheduler.service';
import { SharedServiceRegistry } from './shared-service-registry';
import { SharedServiceError } from './types';

describe('SharedServiceRegistry', () => {
  it('seals only when all required services are registered', () => {
    const registry = new SharedServiceRegistry();
    const configuration = new ConfigurationService({
      host: 'api',
      env: {
        ATI_API_PORT: '3000',
        ATI_NODE_ENV: 'test',
        ATI_LOG_LEVEL: 'info',
      },
    });
    configuration.initialize();
    const logger = new LoggerService();
    logger.initialize({ host: 'api', logLevel: 'info', sink: { log: jest.fn(), error: jest.fn(), warn: jest.fn() } });
    const diagnostics = new DiagnosticsService();
    diagnostics.initialize(configuration.getConfig(), 0);
    const featureFlags = new FeatureFlagsService();
    featureFlags.initialize({});
    const auditSupport = new AuditSupportService();
    auditSupport.initialize();
    const eventPublisher = new EventPublisherService();
    eventPublisher.initialize();
    const scheduler = new SchedulerService();
    scheduler.initialize();

    registry.registerConfiguration(configuration);
    registry.registerLogger(logger);
    registry.registerDiagnostics(diagnostics);
    registry.registerFeatureFlags(featureFlags);
    registry.registerAuditSupport(auditSupport);
    registry.registerEventPublisher(eventPublisher);
    expect(() => registry.seal()).toThrow(SharedServiceError);

    registry.registerScheduler(scheduler);
    registry.seal();
    expect(registry.isSealed()).toBe(true);
    expect(() => registry.registerScheduler(scheduler)).toThrow(SharedServiceError);
  });
});
