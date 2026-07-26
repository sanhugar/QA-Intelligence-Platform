import {
  RequirementEngine,
  RequirementEngineErrorCodes,
  createStubParsePort,
} from '@ati/requirement-engine';
import {
  IntakeErrorCodes,
  IntakeStates,
  IntakeWorkflow,
  buildIdempotencyKey,
  mapEngineResultToIntake,
  validateIntakeRequest,
} from './index';

function baseRequest(overrides: Record<string, unknown> = {}) {
  return {
    source: {
      sourceIdentity: 'src-1',
      sourceVersion: '1.0.0',
      checksum: 'abc123',
      declaredFormat: 'markdown',
      ...(overrides.source as object),
    },
    metadata: { actorSubject: 'user-1' },
    payload: '# Title\n\nBody',
    correlationId: 'corr-1',
    tenantId: 'tenant-a',
    workspaceId: 'ws-1',
    ...overrides,
  };
}

describe('@ati/intake', () => {
  describe('validation', () => {
    it('accepts catalog formats without inspecting payload', () => {
      const result = validateIntakeRequest(baseRequest());
      expect(result.ok).toBe(true);
    });

    it('rejects unsupported format', () => {
      const result = validateIntakeRequest(
        baseRequest({
          source: {
            sourceIdentity: 'src-1',
            sourceVersion: '1.0.0',
            checksum: 'abc123',
            declaredFormat: 'docx',
          },
        }),
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe(IntakeErrorCodes.UNSUPPORTED_FORMAT);
      }
    });

    it('rejects stub format on product path', () => {
      const result = validateIntakeRequest(
        baseRequest({
          source: {
            sourceIdentity: 's',
            sourceVersion: '1',
            checksum: 'c',
            declaredFormat: 'stub',
          },
        }),
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe(IntakeErrorCodes.FORBIDDEN_FORMAT);
      }
    });
  });

  describe('idempotency', () => {
    it('builds D8 tuple', () => {
      expect(
        buildIdempotencyKey({
          tenantId: 't',
          workspaceId: 'w',
          sourceIdentity: 's',
          sourceVersion: 'v',
          checksum: 'c',
        }),
      ).toBe('t|w|s|v|c');
    });
  });

  describe('engine mapping', () => {
    it('maps PARSER_NOT_REGISTERED to accepted_pending_parser', () => {
      const mapped = mapEngineResultToIntake({
        status: 'failed',
        code: RequirementEngineErrorCodes.PARSER_NOT_REGISTERED,
        message: 'missing',
      });
      expect(mapped.terminalState).toBe(IntakeStates.ACCEPTED_PENDING_PARSER);
    });
  });

  describe('workflow', () => {
    it('terminates accepted_pending_parser when no production parser', async () => {
      const engine = RequirementEngine.createReady({
        config: { enabled: true, registerStubParser: false },
      });
      const wf = IntakeWorkflow.createReady({
        engine,
        createIntakeId: () => 'intake-1',
        createCorrelationId: () => 'corr-fixed',
      });

      const record = await wf.submit(baseRequest({ correlationId: undefined }));
      expect(record.state).toBe(IntakeStates.ACCEPTED_PENDING_PARSER);
      expect(record.audit.correlationId).toBeTruthy();
      expect(record.engineCode).toBe(RequirementEngineErrorCodes.PARSER_NOT_REGISTERED);
    });

    it('terminates accepted when production-like port is registered', async () => {
      const engine = RequirementEngine.createReady({
        config: { enabled: true, registerStubParser: false },
      });
      // Register a port for markdown that returns empty structure (still a "production" port key)
      engine.registerParsePort({
        format: 'markdown',
        parse() {
          return {
            sections: [{ sectionId: 's1', title: 'S', kind: 'section', fragments: [] }],
          };
        },
      });
      const wf = IntakeWorkflow.createReady({ engine });
      const record = await wf.submit(baseRequest());
      expect(record.state).toBe(IntakeStates.ACCEPTED);
      expect(record.requirementId).toBeTruthy();
    });

    it('fails validation for bad structure', async () => {
      const wf = IntakeWorkflow.createReady();
      const record = await wf.submit({ payload: 'x' });
      expect(record.state).toBe(IntakeStates.FAILED);
      expect(record.failureReason).toBe(IntakeErrorCodes.VALIDATION_ERROR);
    });

    it('returns prior terminal record on duplicate idempotency key', async () => {
      const wf = IntakeWorkflow.createReady({
        createIntakeId: (() => {
          let n = 0;
          return () => `intake-${++n}`;
        })(),
      });
      const first = await wf.submit(baseRequest());
      const second = await wf.submit(baseRequest());
      expect(second.intakeId).toBe(first.intakeId);
      expect(second.state).toBe(first.state);
    });

    it('does not treat stub registration as product acceptance for markdown', async () => {
      const engine = RequirementEngine.createReady({
        config: { enabled: true, registerStubParser: true },
      });
      expect(engine.listRegisteredFormats()).toContain('stub');
      const wf = IntakeWorkflow.createReady({ engine });
      const record = await wf.submit(baseRequest());
      // markdown still has no port → pending parser
      expect(record.state).toBe(IntakeStates.ACCEPTED_PENDING_PARSER);
    });

    it('rejects stub declared format even if stub port exists', async () => {
      const engine = RequirementEngine.createReady({
        config: { enabled: true, registerStubParser: true },
      });
      engine.registerParsePort(createStubParsePort());
      const wf = IntakeWorkflow.createReady({ engine });
      const record = await wf.submit(
        baseRequest({
          source: {
            sourceIdentity: 's',
            sourceVersion: '1',
            checksum: 'c',
            declaredFormat: 'stub',
          },
        }),
      );
      expect(record.state).toBe(IntakeStates.FAILED);
      expect(record.failureReason).toBe(IntakeErrorCodes.FORBIDDEN_FORMAT);
    });

    it('fails when requireTenant and tenant missing', async () => {
      const wf = IntakeWorkflow.createReady({ requireTenant: true });
      const record = await wf.submit(baseRequest({ tenantId: undefined }));
      expect(record.state).toBe(IntakeStates.FAILED);
      expect(record.failureReason).toBe(IntakeErrorCodes.AUTH_FAILED);
    });
  });
});
