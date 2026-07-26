import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.7 Knowledge Management */
export const knowledgeManagementModuleShell = createModuleShell({
  moduleId: 'knowledge-management',
  moduleName: 'Knowledge Management',
  registrationPriority: 70,
  dependencies: [],
});
