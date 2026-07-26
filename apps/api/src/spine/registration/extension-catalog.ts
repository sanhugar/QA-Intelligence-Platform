import { RegistrationError } from './errors';
import type { ExtensionKind, ExtensionRegistrationDescriptor } from './types';

/**
 * Empty-capable extension catalogs (workflow / AI engine / connector).
 * No runtime execution in WP-1.2.
 */
export class ExtensionCatalog {
  private readonly byKind: Record<ExtensionKind, Map<string, ExtensionRegistrationDescriptor>> = {
    workflow: new Map(),
    'ai-engine': new Map(),
    connector: new Map(),
  };

  register(descriptor: ExtensionRegistrationDescriptor): void {
    if (!descriptor.extensionId?.trim()) {
      throw new RegistrationError('extensionId is required', 'EXTENSION_INVALID');
    }
    const catalog = this.byKind[descriptor.kind];
    if (!catalog) {
      throw new RegistrationError(`Unknown extension kind: ${String(descriptor.kind)}`, 'EXTENSION_INVALID');
    }
    if (catalog.has(descriptor.extensionId)) {
      throw new RegistrationError(
        `Duplicate extensionId: ${descriptor.extensionId}`,
        'EXTENSION_DUPLICATE',
      );
    }
    catalog.set(descriptor.extensionId, descriptor);
  }

  list(kind: ExtensionKind): readonly ExtensionRegistrationDescriptor[] {
    return [...this.byKind[kind].values()];
  }

  count(kind: ExtensionKind): number {
    return this.byKind[kind].size;
  }

  totalCount(): number {
    return (Object.keys(this.byKind) as ExtensionKind[]).reduce(
      (sum, kind) => sum + this.byKind[kind].size,
      0,
    );
  }
}
