import { RegistrationError } from './errors';
import type { ModuleRegistrationDescriptor } from './types';

/**
 * Deterministic dependency-first topological ordering.
 * registrationPriority resolves ties only; never overrides dependencies.
 */
export class RegistrationOrderResolver {
  resolve(descriptors: readonly ModuleRegistrationDescriptor[]): string[] {
    const byId = new Map(descriptors.map((d) => [d.moduleId, d]));
    const indegree = new Map<string, number>();
    const dependents = new Map<string, string[]>();

    for (const d of descriptors) {
      indegree.set(d.moduleId, 0);
      dependents.set(d.moduleId, []);
    }

    for (const d of descriptors) {
      for (const dep of d.dependencies) {
        if (!byId.has(dep)) {
          throw new RegistrationError(
            `Cannot order: missing dependency ${dep} for ${d.moduleId}`,
            'MISSING_DEPENDENCY',
          );
        }
        indegree.set(d.moduleId, (indegree.get(d.moduleId) ?? 0) + 1);
        dependents.get(dep)!.push(d.moduleId);
      }
    }

    const ready = descriptors
      .filter((d) => (indegree.get(d.moduleId) ?? 0) === 0)
      .sort(compareDescriptors);

    const order: string[] = [];
    while (ready.length > 0) {
      const next = ready.shift()!;
      order.push(next.moduleId);
      for (const childId of dependents.get(next.moduleId) ?? []) {
        const nextDegree = (indegree.get(childId) ?? 0) - 1;
        indegree.set(childId, nextDegree);
        if (nextDegree === 0) {
          const child = byId.get(childId)!;
          ready.push(child);
          ready.sort(compareDescriptors);
        }
      }
    }

    if (order.length !== descriptors.length) {
      throw new RegistrationError(
        'Cannot order: circular dependency remains after validation',
        'CIRCULAR_DEPENDENCY',
      );
    }

    return order;
  }
}

function compareDescriptors(
  a: ModuleRegistrationDescriptor,
  b: ModuleRegistrationDescriptor,
): number {
  if (a.registrationPriority !== b.registrationPriority) {
    return a.registrationPriority - b.registrationPriority;
  }
  return a.moduleId.localeCompare(b.moduleId);
}
