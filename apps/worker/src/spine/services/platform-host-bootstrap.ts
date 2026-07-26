import { applicationModuleShells } from '../../modules/module-shell-catalog';
import { AiRuntimeHost } from '../ai-runtime/ai-runtime-host';
import { AiRuntimeError } from '../ai-runtime/types';
import { PlatformStartupCoordinator } from '../registration/platform-startup-coordinator';
import { platformReadiness } from '../registration/platform-readiness';
import { AuditSupportService } from './audit/audit-support.service';
import { ConfigurationService } from './configuration/configuration.service';
import { DiagnosticsService } from './diagnostics/diagnostics.service';
import { EventPublisherService } from './events/event-publisher.service';
import { FeatureFlagsService } from './feature-flags/feature-flags.service';
import { LoggerService } from './logging/logger.service';
import { SchedulerService } from './scheduling/scheduler.service';
import { SharedServiceRegistry } from './shared-service-registry';
import { SharedServiceError } from './types';

export interface PlatformHostBootstrapOptions {
  host: 'api' | 'worker';
  env?: NodeJS.ProcessEnv;
}

export interface PlatformHostBootstrapResult {
  registry: SharedServiceRegistry;
  aiRuntimeHost: AiRuntimeHost;
  port: number;
}

/**
 * Mandatory WP-1.4 boot sequence:
 * Configuration → Logger → Module Registration → Shared Service Registry →
 * Diagnostics → Feature Flags → Audit Support → Event Publisher → Scheduler →
 * Platform AI Runtime Host → Platform READY
 */
export class PlatformHostBootstrap {
  async start(options: PlatformHostBootstrapOptions): Promise<PlatformHostBootstrapResult> {
    platformReadiness.setReady(false);
    const env = options.env ?? process.env;

    // 1. Configuration
    const configuration = new ConfigurationService({ host: options.host, env });
    let config;
    try {
      config = configuration.initialize();
    } catch (error) {
      platformReadiness.setReady(false);
      throw error;
    }

    // 2. Logger
    const logger = new LoggerService();
    try {
      logger.initialize({
        host: options.host,
        logLevel: config.logLevel,
      });
    } catch (error) {
      platformReadiness.setReady(false);
      throw error;
    }

    logger.info('Configuration and logger initialized', {
      host: options.host,
      nodeEnv: config.nodeEnv,
    });

    // 3. Module Registration (WP-1.2)
    const registration = new PlatformStartupCoordinator({
      host: options.host,
      platformVersion: config.platformVersion,
      moduleShells: applicationModuleShells,
      logger: {
        log: (message: string) => logger.info(message),
        error: (message: string) => logger.error(message),
      },
    });

    try {
      await registration.start();
    } catch (error) {
      platformReadiness.setReady(false);
      throw error;
    }

    // 4. Shared Service Registry
    const registry = new SharedServiceRegistry();
    registry.registerConfiguration(configuration);
    registry.registerLogger(logger);

    try {
      // 5. Diagnostics
      const diagnostics = new DiagnosticsService();
      diagnostics.initialize(
        config,
        registration.getStartupReport().registeredModules.length,
      );
      registry.registerDiagnostics(diagnostics);

      // 6. Feature Flags
      const featureFlags = new FeatureFlagsService();
      featureFlags.initialize(config.featureFlags);
      registry.registerFeatureFlags(featureFlags);

      // 7. Audit Support
      const auditSupport = new AuditSupportService();
      auditSupport.initialize();
      registry.registerAuditSupport(auditSupport);
      auditSupport.record('platform.shared_services.initialized', { host: options.host });

      // 8. Event Publisher (in-process only)
      const eventPublisher = new EventPublisherService();
      eventPublisher.initialize();
      registry.registerEventPublisher(eventPublisher);
      eventPublisher.publish('platform', 'shared_services.ready', { host: options.host });

      // 9. Scheduler (no Redis/BullMQ)
      const scheduler = new SchedulerService();
      scheduler.initialize();
      registry.registerScheduler(scheduler);

      registry.seal();
    } catch (error) {
      platformReadiness.setReady(false);
      logger.error('Shared service initialization failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof SharedServiceError
        ? error
        : new SharedServiceError(
            error instanceof Error ? error.message : String(error),
            'SHARED_SERVICE_INIT_FAILED',
          );
    }

    // 10. Platform AI Runtime Host (register only — no invoke)
    const aiRuntimeHost = new AiRuntimeHost();
    try {
      aiRuntimeHost.initialize(registration.getRegistry().extensions);
      aiRuntimeHost.registerPlatformNoop();
      logger.info('Platform AI Runtime Host initialized', {
        host: options.host,
        registeredEngines: aiRuntimeHost.listManifests().map((m) => m.engineId),
      });
    } catch (error) {
      platformReadiness.setReady(false);
      logger.error('AI Runtime Host initialization failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AiRuntimeError
        ? error
        : new AiRuntimeError(
            error instanceof Error ? error.message : String(error),
            'AI_RUNTIME_INIT_FAILED',
          );
    }

    // 11. Platform READY
    platformReadiness.setReady(true);
    logger.info('Platform READY', {
      host: options.host,
      registeredModules: registration.getStartupReport().registeredModules.length,
      aiEngines: aiRuntimeHost.listManifests().length,
      port: config.port,
    });

    return { registry, aiRuntimeHost, port: config.port };
  }
}
