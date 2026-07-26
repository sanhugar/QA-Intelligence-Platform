import { FeatureVersionStatuses } from '@ati/feature-version';
import { FeatureVersionHarness } from './feature-version-harness';

describe('API FeatureVersionHarness (WP-3.3)', () => {
  it('resolves allow-listed input deterministically', () => {
    const h = FeatureVersionHarness.create({
      now: () => '2026-07-26T12:00:00.000Z',
    });
    const result = h.resolveFeatureVersion({
      intakeId: 'in-api-1',
      correlationId: 'corr-api-1',
      intakeState: 'accepted_pending_parser',
      sourceIdentity: 'src-api',
      sourceVersion: '1',
      checksum: 'sum-api',
      designation: 'feature',
      knowledgeRole: 'supporting',
      classificationEvaluatedAt: '2026-07-26T11:00:00.000Z',
    });
    expect(result.schemaVersion).toBe('1.0');
    expect(result.status).toBe(FeatureVersionStatuses.ACTIVE);
    expect(result.featureId.startsWith('fvf_')).toBe(true);
    expect(result.versionIdentifier.startsWith('fvv_')).toBe(true);
    expect(result.lineageIdentifier.startsWith('fvl_')).toBe(true);
  });
});
