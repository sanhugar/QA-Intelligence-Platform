/** Module lifecycle states (Spine registration). */
export type ModuleLifecycleState =
  | 'DISCOVERED'
  | 'VALIDATED'
  | 'REGISTERED'
  | 'INITIALIZED'
  | 'READY'
  | 'DRAINING'
  | 'STOPPED';

/** Platform startup FSM states. */
export type PlatformStartupState =
  | 'BOOTING'
  | 'DISCOVERING'
  | 'VALIDATING'
  | 'REGISTERING'
  | 'READY'
  | 'FAILED';

export type ModuleType = 'application';

export type ExtensionKind = 'workflow' | 'ai-engine' | 'connector';

export interface ModuleLifecycleHooks {
  onRegister(): void | Promise<void>;
  onInit(): void | Promise<void>;
  onReady(): void | Promise<void>;
  onDrain(): void | Promise<void>;
  onStop(): void | Promise<void>;
}

/**
 * Module registration descriptor — WP-1.2 contract.
 * Platform owns registration; modules never self-register.
 */
export interface ModuleRegistrationDescriptor {
  moduleId: string;
  moduleName: string;
  moduleVersion: string;
  moduleType: ModuleType;
  enabled: boolean;
  /** Bootstrap registration dependencies only (see PLATFORM_REGISTRATION_DEPENDENCY_MATRIX). */
  dependencies: readonly string[];
  /** Tie-break only; dependency order always takes precedence. Lower runs first. */
  registrationPriority: number;
  hooks: ModuleLifecycleHooks;
}

export interface ExtensionRegistrationDescriptor {
  extensionId: string;
  kind: ExtensionKind;
  version: string;
  enabled: boolean;
}

export interface RegisteredModuleRecord {
  descriptor: ModuleRegistrationDescriptor;
  lifecycle: ModuleLifecycleState;
}

export interface ValidationFailure {
  moduleId?: string;
  code: string;
  message: string;
}
