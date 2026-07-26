import { RequirementEngineErrorCodes } from '@ati/requirement-engine';
import { WorkerRequirementEngineHarness } from './requirement-engine-harness';

describe('Worker RequirementEngineHarness', () => {
  it('fail-closes unregistered formats', async () => {
    const harness = WorkerRequirementEngineHarness.create({
      config: { enabled: true, registerStubParser: false },
    });
    const result = await harness.run({
      format: 'fdd',
      payload: 'Feature: ...',
      source: { sourceId: 'fdd-1' },
      correlationId: 'w-corr',
    });
    expect(result.status).toBe('failed');
    if (result.status === 'failed') {
      expect(result.code).toBe(RequirementEngineErrorCodes.PARSER_NOT_REGISTERED);
      expect(result.correlationId).toBe('w-corr');
    }
  });

  it('runs stub pipeline when registered', async () => {
    const harness = WorkerRequirementEngineHarness.create({
      config: { enabled: true, registerStubParser: true },
    });
    const result = await harness.run({
      format: 'stub',
      payload: 'one',
      source: { sourceId: 's1' },
      tenantId: 'tenant-w',
    });
    expect(result.status).toBe('completed');
    if (result.status === 'completed') {
      expect(result.tenantId).toBe('tenant-w');
    }
  });
});
