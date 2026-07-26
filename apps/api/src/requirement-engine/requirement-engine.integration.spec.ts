import { RequirementEngineErrorCodes } from '@ati/requirement-engine';
import { RequirementEngineHarness } from './requirement-engine-harness';

describe('API RequirementEngineHarness', () => {
  it('fail-closes unregistered production format keys', async () => {
    const harness = RequirementEngineHarness.create({
      config: { enabled: true, registerStubParser: false },
    });
    const result = await harness.run({
      format: 'prd',
      payload: 'As a user...',
      source: { sourceId: 'doc-1' },
      correlationId: 'c-1',
      tenantId: 't-1',
    });
    expect(result.status).toBe('failed');
    if (result.status === 'failed') {
      expect(result.code).toBe(RequirementEngineErrorCodes.PARSER_NOT_REGISTERED);
      expect(result.correlationId).toBe('c-1');
      expect(result.tenantId).toBe('t-1');
    }
  });

  it('runs stub pipeline when stub registered (test-only)', async () => {
    const harness = RequirementEngineHarness.create({
      config: { enabled: true, registerStubParser: true },
      createRequirementId: () => 'api-req-1',
    });
    const result = await harness.run({
      format: 'stub',
      payload: 'A\nB',
      source: { sourceId: 's1' },
      workspaceId: 'ws-1',
    });
    expect(result.status).toBe('completed');
    if (result.status === 'completed') {
      expect(result.requirement.requirementId).toBe('api-req-1');
      expect(result.workspaceId).toBe('ws-1');
    }
  });
});
