import type { ModuleLifecycleHooks } from '../spine/registration/types';

/** No-op lifecycle hooks for empty module shells (WP-1.2). */
export function createNoopLifecycleHooks(): ModuleLifecycleHooks {
  return {
    onRegister() {},
    onInit() {},
    onReady() {},
    onDrain() {},
    onStop() {},
  };
}
