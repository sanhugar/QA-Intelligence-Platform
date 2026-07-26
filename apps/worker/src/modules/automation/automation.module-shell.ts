import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.11 Automation */
export const automationModuleShell = createModuleShell({
  moduleId: 'automation',
  moduleName: 'Automation',
  registrationPriority: 110,
  dependencies: [],
});
