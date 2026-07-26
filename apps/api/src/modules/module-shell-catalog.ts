import { accessModuleShell } from './access/access.module-shell';
import { administrationModuleShell } from './administration/administration.module-shell';
import { aiReasoningModuleShell } from './ai-reasoning/ai-reasoning.module-shell';
import { aiReviewModuleShell } from './ai-review/ai-review.module-shell';
import { automationModuleShell } from './automation/automation.module-shell';
import { configurationModuleShell } from './configuration/configuration.module-shell';
import { documentManagementModuleShell } from './document-management/document-management.module-shell';
import { executionManagementModuleShell } from './execution-management/execution-management.module-shell';
import { integrationFacadeModuleShell } from './integration-facade/integration-facade.module-shell';
import { knowledgeIntakeCoordinationModuleShell } from './knowledge-intake-coordination/knowledge-intake-coordination.module-shell';
import { knowledgeManagementModuleShell } from './knowledge-management/knowledge-management.module-shell';
import { notificationModuleShell } from './notification/notification.module-shell';
import { releaseManagementModuleShell } from './release-management/release-management.module-shell';
import { reportingModuleShell } from './reporting/reporting.module-shell';
import { requirementManagementModuleShell } from './requirement-management/requirement-management.module-shell';
import { testDesignModuleShell } from './test-design/test-design.module-shell';
import { workflowOrchestrationModuleShell } from './workflow-orchestration/workflow-orchestration.module-shell';
import type { ModuleRegistrationDescriptor } from '../spine/registration/types';

/**
 * Platform-owned discovery list for WP-1.2.
 * Bootstrap dependencies: docs/engineering/PLATFORM_REGISTRATION_DEPENDENCY_MATRIX.md
 */
export const applicationModuleShells: readonly ModuleRegistrationDescriptor[] = [
  administrationModuleShell,
  accessModuleShell,
  configurationModuleShell,
  documentManagementModuleShell,
  knowledgeIntakeCoordinationModuleShell,
  requirementManagementModuleShell,
  knowledgeManagementModuleShell,
  testDesignModuleShell,
  aiReasoningModuleShell,
  aiReviewModuleShell,
  automationModuleShell,
  executionManagementModuleShell,
  releaseManagementModuleShell,
  reportingModuleShell,
  notificationModuleShell,
  workflowOrchestrationModuleShell,
  integrationFacadeModuleShell,
];
