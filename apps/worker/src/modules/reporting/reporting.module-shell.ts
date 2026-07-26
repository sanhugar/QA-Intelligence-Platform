import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.14 Reporting */
export const reportingModuleShell = createModuleShell({
  moduleId: 'reporting',
  moduleName: 'Reporting',
  registrationPriority: 140,
  dependencies: [],
});
