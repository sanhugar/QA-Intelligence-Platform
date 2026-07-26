import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.6 Requirement Management */
export const requirementManagementModuleShell = createModuleShell({
  moduleId: 'requirement-management',
  moduleName: 'Requirement Management',
  registrationPriority: 60,
  dependencies: [],
});
