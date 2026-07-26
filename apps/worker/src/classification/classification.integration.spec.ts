import {
  ClassificationCategories,
  KnowledgeRoles,
} from '@ati/classification';
import { ClassificationHarness } from './classification-harness';

describe('Worker ClassificationHarness (WP-3.2)', () => {
  it('classifies allow-listed input deterministically', () => {
    const h = ClassificationHarness.create({
      now: () => '2026-07-26T12:00:00.000Z',
    });
    const result = h.classify({
      intakeId: 'in-worker-1',
      correlationId: 'corr-worker-1',
      intakeState: 'accepted_pending_parser',
      declaredFormat: 'user_story',
      hasSourceIdentity: true,
      hasSourceVersion: true,
      hasChecksum: true,
    });
    expect(result.schemaVersion).toBe('1.0');
    expect(result.classification).toBe(ClassificationCategories.FUNCTIONAL);
    expect(result.knowledgeRole).toBe(KnowledgeRoles.SUPPORTING);
  });
});
