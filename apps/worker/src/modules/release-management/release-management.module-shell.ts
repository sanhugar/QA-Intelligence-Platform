import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.13 Release Management */
export const releaseManagementModuleShell = createModuleShell({
  moduleId: 'release-management',
  moduleName: 'Release Management',
  registrationPriority: 130,
  dependencies: [],
});
