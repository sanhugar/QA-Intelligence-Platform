import { createModuleShell } from '../create-module-shell';

/** Empty shell — Application Architecture §2.16 Workflow Orchestration (application module) */
export const workflowOrchestrationModuleShell = createModuleShell({
  moduleId: 'workflow-orchestration',
  moduleName: 'Workflow Orchestration (application module)',
  registrationPriority: 160,
  dependencies: [],
});
