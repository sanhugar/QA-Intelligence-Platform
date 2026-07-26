import type { FeatureVersionResult } from './model';

/**
 * Optional process-local registry for deterministic predecessor lookup (D6).
 * Not a product source of truth — emit-only; never rewrites historical results.
 */
export class FeatureVersionRegistry {
  private readonly byVersion = new Map<string, FeatureVersionResult>();
  private readonly byFeature = new Map<string, string[]>();

  remember(result: FeatureVersionResult): void {
    if (!this.byVersion.has(result.versionIdentifier)) {
      this.byVersion.set(result.versionIdentifier, result);
      const list = this.byFeature.get(result.featureId) ?? [];
      list.push(result.versionIdentifier);
      this.byFeature.set(result.featureId, list);
    }
  }

  getByVersion(versionIdentifier: string): FeatureVersionResult | undefined {
    return this.byVersion.get(versionIdentifier);
  }

  /** Most recently remembered version for a feature (insertion order). */
  latestForFeature(featureId: string): FeatureVersionResult | undefined {
    const list = this.byFeature.get(featureId);
    if (!list || list.length === 0) {
      return undefined;
    }
    return this.byVersion.get(list[list.length - 1]!);
  }

  clear(): void {
    this.byVersion.clear();
    this.byFeature.clear();
  }
}
