import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.3 Configuration */
export const configurationModuleShell = createModuleShell({
  moduleId: 'configuration',
  moduleName: 'Configuration',
  registrationPriority: 30,
  dependencies: [],
});
