import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.1 Administration */
export const administrationModuleShell = createModuleShell({
  moduleId: 'administration',
  moduleName: 'Administration',
  registrationPriority: 10,
  dependencies: [],
});
