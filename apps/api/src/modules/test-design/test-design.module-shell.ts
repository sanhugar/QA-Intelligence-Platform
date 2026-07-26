import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.8 Test Design */
export const testDesignModuleShell = createModuleShell({
  moduleId: 'test-design',
  moduleName: 'Test Design',
  registrationPriority: 80,
  dependencies: [],
});
