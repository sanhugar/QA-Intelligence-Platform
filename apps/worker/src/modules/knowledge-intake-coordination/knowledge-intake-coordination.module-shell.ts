import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.5 Knowledge Intake Coordination */
export const knowledgeIntakeCoordinationModuleShell = createModuleShell({
  moduleId: 'knowledge-intake-coordination',
  moduleName: 'Knowledge Intake Coordination',
  registrationPriority: 50,
  dependencies: [],
});
