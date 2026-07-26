import { ExtensionCatalog } from './extension-catalog';
import type {
  ModuleLifecycleState,
  ModuleRegistrationDescriptor,
  PlatformStartupState,
  RegisteredModuleRecord,
  ValidationFailure,
} from './types';

/**
 * Platform-owned registry. Modules never self-register.
 */
export class PlatformRegistry {
  private startupState: PlatformStartupState = 'BOOTING';
  private readonly discovered: ModuleRegistrationDescriptor[] = [];
  private readonly validated: ModuleRegistrationDescriptor[] = [];
  private readonly registered = new Map<string, RegisteredModuleRecord>();
  private readonly failed: ValidationFailure[] = [];
  private registrationOrder: string[] = [];
  private ready = false;

  readonly extensions = new ExtensionCatalog();

  getStartupState(): PlatformStartupState {
    return this.startupState;
  }

  setStartupState(state: PlatformStartupState): void {
    this.startupState = state;
    this.ready = state === 'READY';
  }

  isReady(): boolean {
    return this.ready;
  }

  clearForStartup(): void {
    this.startupState = 'BOOTING';
    this.discovered.length = 0;
    this.validated.length = 0;
    this.registered.clear();
    this.failed.length = 0;
    this.registrationOrder = [];
    this.ready = false;
  }

  addDiscovered(descriptor: ModuleRegistrationDescriptor): void {
    this.discovered.push(descriptor);
  }

  getDiscovered(): readonly ModuleRegistrationDescriptor[] {
    return this.discovered;
  }

  setValidated(descriptors: readonly ModuleRegistrationDescriptor[]): void {
    this.validated.length = 0;
    this.validated.push(...descriptors);
  }

  getValidated(): readonly ModuleRegistrationDescriptor[] {
    return this.validated;
  }

  addFailure(failure: ValidationFailure): void {
    this.failed.push(failure);
  }

  getFailures(): readonly ValidationFailure[] {
    return this.failed;
  }

  setRegistrationOrder(order: readonly string[]): void {
    this.registrationOrder = [...order];
  }

  getRegistrationOrder(): readonly string[] {
    return this.registrationOrder;
  }

  markRegistered(descriptor: ModuleRegistrationDescriptor, lifecycle: ModuleLifecycleState): void {
    this.registered.set(descriptor.moduleId, { descriptor, lifecycle });
  }

  updateLifecycle(moduleId: string, lifecycle: ModuleLifecycleState): void {
    const record = this.registered.get(moduleId);
    if (record) {
      record.lifecycle = lifecycle;
    }
  }

  getRegistered(): readonly RegisteredModuleRecord[] {
    return [...this.registered.values()];
  }

  getRegisteredIds(): readonly string[] {
    return [...this.registered.keys()];
  }
}
