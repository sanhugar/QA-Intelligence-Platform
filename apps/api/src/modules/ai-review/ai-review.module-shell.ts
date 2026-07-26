import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.10 AI Review */
export const aiReviewModuleShell = createModuleShell({
  moduleId: 'ai-review',
  moduleName: 'AI Review',
  registrationPriority: 100,
  dependencies: [],
});
