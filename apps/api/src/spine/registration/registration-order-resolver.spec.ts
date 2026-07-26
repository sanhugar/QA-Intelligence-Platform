import { createModuleShell } from '../../modules/create-module-shell';
import { RegistrationOrderResolver } from './registration-order-resolver';

describe('RegistrationOrderResolver', () => {
  const resolver = new RegistrationOrderResolver();

  it('orders by registrationPriority when there are no dependencies', () => {
    const shells = [
      createModuleShell({ moduleId: 'b', moduleName: 'B', registrationPriority: 20 }),
      createModuleShell({ moduleId: 'a', moduleName: 'A', registrationPriority: 10 }),
      createModuleShell({ moduleId: 'c', moduleName: 'C', registrationPriority: 30 }),
    ];
    expect(resolver.resolve(shells)).toEqual(['a', 'b', 'c']);
  });

  it('places dependencies before dependents regardless of priority', () => {
    const shells = [
      createModuleShell({
        moduleId: 'child',
        moduleName: 'Child',
        registrationPriority: 1,
        dependencies: ['parent'],
      }),
      createModuleShell({
        moduleId: 'parent',
        moduleName: 'Parent',
        registrationPriority: 100,
        dependencies: [],
      }),
    ];
    expect(resolver.resolve(shells)).toEqual(['parent', 'child']);
  });

  it('is deterministic for equal priority (moduleId lexicographic)', () => {
    const shells = [
      createModuleShell({ moduleId: 'm-b', moduleName: 'B', registrationPriority: 10 }),
      createModuleShell({ moduleId: 'm-a', moduleName: 'A', registrationPriority: 10 }),
    ];
    expect(resolver.resolve(shells)).toEqual(['m-a', 'm-b']);
  });
});
