import {
  ClassificationCategories,
  DesignationKeys,
  KnowledgeRoles,
} from '@ati/classification';
import { ClassificationHarness } from './classification-harness';

describe('API ClassificationHarness (WP-3.2)', () => {
  it('classifies allow-listed input deterministically', () => {
    const h = ClassificationHarness.create({
      now: () => '2026-07-26T12:00:00.000Z',
    });
    const result = h.classify({
      intakeId: 'in-api-1',
      correlationId: 'corr-api-1',
      intakeState: 'accepted_pending_parser',
      declaredFormat: 'prd',
      hasSourceIdentity: true,
      hasSourceVersion: true,
      hasChecksum: true,
    });
    expect(result.schemaVersion).toBe('1.0');
    expect(result.classification).toBe(ClassificationCategories.BUSINESS);
    expect(result.designation).toBe(DesignationKeys.UNKNOWN);
    expect(result.knowledgeRole).toBe(KnowledgeRoles.SUPPORTING);
  });
});
