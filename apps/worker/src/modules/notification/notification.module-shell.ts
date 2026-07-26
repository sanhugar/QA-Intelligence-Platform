import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.15 Notification */
export const notificationModuleShell = createModuleShell({
  moduleId: 'notification',
  moduleName: 'Notification',
  registrationPriority: 150,
  dependencies: [],
});
