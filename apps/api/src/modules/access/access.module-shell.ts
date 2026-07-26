import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.2 User & Access Management */
export const accessModuleShell = createModuleShell({
  moduleId: 'access',
  moduleName: 'User & Access Management',
  registrationPriority: 20,
  dependencies: [],
});
