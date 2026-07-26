import { createModuleShell } from '../../modules/create-module-shell';
import { ModuleRegistrationValidator } from './module-registration-validator';
import type { ModuleRegistrationDescriptor } from './types';

describe('ModuleRegistrationValidator', () => {
  const validator = new ModuleRegistrationValidator();

  it('accepts a valid descriptor set', () => {
    const shells = [
      createModuleShell({ moduleId: 'a', moduleName: 'A', registrationPriority: 10 }),
      createModuleShell({
        moduleId: 'b',
        moduleName: 'B',
        registrationPriority: 20,
        dependencies: ['a'],
      }),
    ];
    expect(validator.validate(shells)).toEqual([]);
  });

  it('rejects duplicate module ids', () => {
    const shells = [
      createModuleShell({ moduleId: 'a', moduleName: 'A', registrationPriority: 10 }),
      createModuleShell({ moduleId: 'a', moduleName: 'A2', registrationPriority: 20 }),
    ];
    const failures = validator.validate(shells);
    expect(failures.some((f) => f.code === 'DUPLICATE_MODULE_ID')).toBe(true);
  });

  it('rejects invalid descriptors', () => {
    const invalid = {
      ...createModuleShell({ moduleId: 'a', moduleName: 'A', registrationPriority: 10 }),
      moduleName: '',
    } as ModuleRegistrationDescriptor;
    const failures = validator.validate([invalid]);
    expect(failures.some((f) => f.code === 'INVALID_DESCRIPTOR')).toBe(true);
  });

  it('rejects missing dependencies', () => {
    const shells = [
      createModuleShell({
        moduleId: 'a',
        moduleName: 'A',
        registrationPriority: 10,
        dependencies: ['missing'],
      }),
    ];
    const failures = validator.validate(shells);
    expect(failures.some((f) => f.code === 'MISSING_DEPENDENCY')).toBe(true);
  });

  it('detects circular dependencies', () => {
    const shells = [
      createModuleShell({
        moduleId: 'a',
        moduleName: 'A',
        registrationPriority: 10,
        dependencies: ['b'],
      }),
      createModuleShell({
        moduleId: 'b',
        moduleName: 'B',
        registrationPriority: 20,
        dependencies: ['a'],
      }),
    ];
    const failures = validator.validate(shells);
    expect(failures.some((f) => f.code === 'CIRCULAR_DEPENDENCY')).toBe(true);
  });
});
