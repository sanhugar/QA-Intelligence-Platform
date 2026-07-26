import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.4 Document Management */
export const documentManagementModuleShell = createModuleShell({
  moduleId: 'document-management',
  moduleName: 'Document Management',
  registrationPriority: 40,
  dependencies: [],
});
