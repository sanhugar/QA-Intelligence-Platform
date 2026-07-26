import { FeatureVersionStatuses } from '@ati/feature-version';
import { FeatureVersionHarness } from './feature-version-harness';

describe('Worker FeatureVersionHarness (WP-3.3)', () => {
  it('resolves allow-listed input deterministically', () => {
    const h = FeatureVersionHarness.create({
      now: () => '2026-07-26T12:00:00.000Z',
    });
    const result = h.resolveFeatureVersion({
      intakeId: 'in-worker-1',
      correlationId: 'corr-worker-1',
      intakeState: 'accepted_pending_parser',
      sourceIdentity: 'src-worker',
      sourceVersion: '1',
      checksum: 'sum-worker',
    });
    expect(result.schemaVersion).toBe('1.0');
    expect(result.status).toBe(FeatureVersionStatuses.ACTIVE);
  });
});
