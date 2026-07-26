import { IntakeStates } from '@ati/intake';
import { IntakeHarness } from './intake-harness';

describe('API IntakeHarness (WP-3.1)', () => {
  it('maps missing parser to accepted_pending_parser', async () => {
    const h = IntakeHarness.create();
    const record = await h.submit({
      source: {
        sourceIdentity: 'doc-1',
        sourceVersion: '1',
        checksum: 'sum',
        declaredFormat: 'prd',
      },
      payload: 'opaque',
      tenantId: 't1',
    });
    expect(record.state).toBe(IntakeStates.ACCEPTED_PENDING_PARSER);
  });
});
