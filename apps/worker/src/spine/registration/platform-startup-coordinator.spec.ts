import { applicationModuleShells } from '../../modules/module-shell-catalog';
import { createModuleShell } from '../../modules/create-module-shell';
import { PlatformStartupError } from './errors';
import { PlatformStartupCoordinator } from './platform-startup-coordinator';
import { platformReadiness } from './platform-readiness';

describe('PlatformStartupCoordinator', () => {
  const silentLogger = { log: jest.fn(), error: jest.fn() };

  beforeEach(() => {
    platformReadiness.setReady(false);
  });

  it('registers all application module shells successfully', async () => {
    const coordinator = new PlatformStartupCoordinator({
      host: 'api',
      platformVersion: '0.0.0',
      moduleShells: applicationModuleShells,
      logger: silentLogger,
    });

    const report = await coordinator.start();

    expect(report.platformReady).toBe(true);
    expect(report.startupState).toBe('READY');
    expect(report.registeredModules).toHaveLength(17);
    expect(report.registrationOrder).toEqual([
      'administration',
      'access',
      'configuration',
      'document-management',
      'knowledge-intake-coordination',
      'requirement-management',
      'knowledge-management',
      'test-design',
      'ai-reasoning',
      'ai-review',
      'automation',
      'execution-management',
      'release-management',
      'reporting',
      'notification',
      'workflow-orchestration',
      'integration-facade',
    ]);
    expect(platformReadiness.isReady()).toBe(true);
    expect(coordinator.getRegistry().extensions.totalCount()).toBe(0);
  });

  it('generates a startup report with diagnostic fields', async () => {
    const coordinator = new PlatformStartupCoordinator({
      host: 'api',
      platformVersion: '0.0.0',
      moduleShells: applicationModuleShells,
      logger: silentLogger,
    });
    const report = await coordinator.start();
    expect(report.host).toBe('api');
    expect(report.platformVersion).toBe('0.0.0');
    expect(report.startupTimestamp).toBeTruthy();
    expect(report.startupDurationMs).toBeGreaterThanOrEqual(0);
    expect(report.validationFailures).toEqual([]);
  });

  it('fails startup on duplicate registration and stays not ready', async () => {
    const shells = [
      createModuleShell({ moduleId: 'a', moduleName: 'A', registrationPriority: 10 }),
      createModuleShell({ moduleId: 'a', moduleName: 'A2', registrationPriority: 20 }),
    ];
    const coordinator = new PlatformStartupCoordinator({
      host: 'api',
      platformVersion: '0.0.0',
      moduleShells: shells,
      logger: silentLogger,
    });

    await expect(coordinator.start()).rejects.toBeInstanceOf(PlatformStartupError);
    expect(platformReadiness.isReady()).toBe(false);
    expect(coordinator.getStartupReport().startupState).toBe('FAILED');
    expect(coordinator.getStartupReport().platformReady).toBe(false);
  });

  it('supports empty extension catalogs that accept registrations', async () => {
    const coordinator = new PlatformStartupCoordinator({
      host: 'api',
      platformVersion: '0.0.0',
      moduleShells: [
        createModuleShell({ moduleId: 'a', moduleName: 'A', registrationPriority: 10 }),
      ],
      logger: silentLogger,
    });
    await coordinator.start();
    const catalog = coordinator.getRegistry().extensions;
    expect(catalog.totalCount()).toBe(0);
    catalog.register({
      extensionId: 'ext-1',
      kind: 'workflow',
      version: '0.0.0',
      enabled: false,
    });
    expect(catalog.count('workflow')).toBe(1);
    expect(catalog.count('ai-engine')).toBe(0);
    expect(catalog.count('connector')).toBe(0);
  });
});
