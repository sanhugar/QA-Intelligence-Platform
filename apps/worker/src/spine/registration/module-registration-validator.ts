import type { ModuleRegistrationDescriptor, ValidationFailure } from './types';

const REQUIRED_STRING_FIELDS: Array<keyof ModuleRegistrationDescriptor> = [
  'moduleId',
  'moduleName',
  'moduleVersion',
  'moduleType',
];

/**
 * Validates module registration descriptors before ordering/registration.
 */
export class ModuleRegistrationValidator {
  validate(descriptors: readonly ModuleRegistrationDescriptor[]): ValidationFailure[] {
    const failures: ValidationFailure[] = [];
    const seen = new Set<string>();
    const byId = new Map<string, ModuleRegistrationDescriptor>();

    for (const descriptor of descriptors) {
      for (const field of REQUIRED_STRING_FIELDS) {
        const value = descriptor[field];
        if (typeof value !== 'string' || value.trim() === '') {
          failures.push({
            moduleId: descriptor.moduleId || undefined,
            code: 'INVALID_DESCRIPTOR',
            message: `Missing or invalid field: ${String(field)}`,
          });
        }
      }

      if (descriptor.moduleType !== 'application') {
        failures.push({
          moduleId: descriptor.moduleId,
          code: 'INVALID_DESCRIPTOR',
          message: `Invalid moduleType: ${String(descriptor.moduleType)}`,
        });
      }

      if (typeof descriptor.enabled !== 'boolean') {
        failures.push({
          moduleId: descriptor.moduleId,
          code: 'INVALID_DESCRIPTOR',
          message: 'enabled must be a boolean',
        });
      }

      if (!Array.isArray(descriptor.dependencies)) {
        failures.push({
          moduleId: descriptor.moduleId,
          code: 'INVALID_DESCRIPTOR',
          message: 'dependencies must be an array',
        });
      }

      if (
        typeof descriptor.registrationPriority !== 'number' ||
        !Number.isFinite(descriptor.registrationPriority)
      ) {
        failures.push({
          moduleId: descriptor.moduleId,
          code: 'INVALID_DESCRIPTOR',
          message: 'registrationPriority must be a finite number',
        });
      }

      if (!descriptor.hooks) {
        failures.push({
          moduleId: descriptor.moduleId,
          code: 'INVALID_DESCRIPTOR',
          message: 'hooks are required',
        });
      }

      if (!descriptor.moduleId?.trim()) {
        continue;
      }

      if (seen.has(descriptor.moduleId)) {
        failures.push({
          moduleId: descriptor.moduleId,
          code: 'DUPLICATE_MODULE_ID',
          message: `Duplicate moduleId: ${descriptor.moduleId}`,
        });
      } else {
        seen.add(descriptor.moduleId);
        byId.set(descriptor.moduleId, descriptor);
      }
    }

    for (const descriptor of byId.values()) {
      if (!Array.isArray(descriptor.dependencies)) {
        continue;
      }
      for (const dep of descriptor.dependencies) {
        if (!byId.has(dep)) {
          failures.push({
            moduleId: descriptor.moduleId,
            code: 'MISSING_DEPENDENCY',
            message: `Missing dependency: ${dep}`,
          });
        }
      }
    }

    const cycle = this.findCycle(byId);
    if (cycle) {
      failures.push({
        code: 'CIRCULAR_DEPENDENCY',
        message: `Circular dependency detected: ${cycle.join(' -> ')}`,
      });
    }

    return failures;
  }

  private findCycle(
    byId: Map<string, ModuleRegistrationDescriptor>,
  ): string[] | null {
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const stack: string[] = [];

    const dfs = (id: string): string[] | null => {
      if (visiting.has(id)) {
        const start = stack.indexOf(id);
        return [...stack.slice(start), id];
      }
      if (visited.has(id)) {
        return null;
      }
      visiting.add(id);
      stack.push(id);
      const descriptor = byId.get(id);
      for (const dep of descriptor?.dependencies ?? []) {
        if (!byId.has(dep)) {
          continue;
        }
        const cycle = dfs(dep);
        if (cycle) {
          return cycle;
        }
      }
      stack.pop();
      visiting.delete(id);
      visited.add(id);
      return null;
    };

    for (const id of byId.keys()) {
      const cycle = dfs(id);
      if (cycle) {
        return cycle;
      }
    }
    return null;
  }
}
