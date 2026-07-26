import { createNoopLifecycleHooks } from './noop-lifecycle-hooks';
import type { ModuleRegistrationDescriptor } from '../spine/registration/types';

export function createModuleShell(input: {
  moduleId: string;
  moduleName: string;
  registrationPriority: number;
  dependencies?: readonly string[];
  enabled?: boolean;
  moduleVersion?: string;
}): ModuleRegistrationDescriptor {
  return {
    moduleId: input.moduleId,
    moduleName: input.moduleName,
    moduleVersion: input.moduleVersion ?? '0.0.0',
    moduleType: 'application',
    enabled: input.enabled ?? true,
    dependencies: input.dependencies ?? [],
    registrationPriority: input.registrationPriority,
    hooks: createNoopLifecycleHooks(),
  };
}
