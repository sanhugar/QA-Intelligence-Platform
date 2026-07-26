import { AiRuntimeError } from '../types';
import { PlatformNoopEngine } from './platform-noop.engine';

describe('PlatformNoopEngine', () => {
  it('completes with a valid envelope', () => {
    const engine = new PlatformNoopEngine();
    const result = engine.invoke({
      reasoningRunId: 'run-1',
      correlationId: 'corr-1',
      engineId: 'platform-noop',
    });
    expect(result.status).toBe('completed');
    expect(result.engineId).toBe('platform-noop');
    expect(result.engineVersion).toBe('0.0.0');
  });

  it('rejects invalid envelope', () => {
    const engine = new PlatformNoopEngine();
    expect(() =>
      engine.invoke({
        reasoningRunId: '',
        correlationId: 'corr-1',
        engineId: 'platform-noop',
      }),
    ).toThrow(AiRuntimeError);
  });
});
