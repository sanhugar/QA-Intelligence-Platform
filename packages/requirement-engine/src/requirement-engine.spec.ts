import {
  createStubParsePort,
  loadRequirementEngineConfig,
  RequirementEngine,
  RequirementEngineErrorCodes,
  RequirementFormatKeys,
  validateRequirement,
} from './index';

describe('@ati/requirement-engine model', () => {
  it('validates and freezes a Requirement', () => {
    const req = validateRequirement({
      requirementId: 'r1',
      sections: [
        {
          sectionId: 's1',
          title: 'Overview',
          fragments: [{ fragmentId: 'f1', text: 'Must authenticate' }],
        },
      ],
      metadata: { attributes: {} },
      sourceReferences: [{ sourceId: 'doc-1', formatHint: 'stub' }],
    });
    expect(req.requirementId).toBe('r1');
    expect(Object.isFrozen(req)).toBe(true);
    expect(() => {
      (req as { requirementId: string }).requirementId = 'x';
    }).toThrow();
  });

  it('rejects workspace-less incomplete model', () => {
    expect(() =>
      validateRequirement({
        requirementId: 'r1',
        sections: [],
        metadata: { attributes: {} },
        sourceReferences: [],
      }),
    ).toThrow(/Invalid Requirement/);
  });
});

describe('@ati/requirement-engine pipeline contracts', () => {
  it('exposes known format keys without implementing parsers', () => {
    expect(RequirementFormatKeys.MARKDOWN).toBe('markdown');
    expect(RequirementFormatKeys.FDD).toBe('fdd');
    expect(RequirementFormatKeys.PRD).toBe('prd');
    expect(RequirementFormatKeys.USER_STORY).toBe('user_story');
  });

  it('stub parse port is test-only format stub', async () => {
    const port = createStubParsePort();
    expect(port.format).toBe('stub');
    const parsed = await port.parse({
      format: 'stub',
      payload: 'line-a\nline-b',
      source: { sourceId: 's1' },
    });
    expect(parsed.sections[0]?.fragments).toHaveLength(2);
  });
});

describe('@ati/requirement-engine lifecycle', () => {
  it('initialize → ready → shutdown', () => {
    const engine = new RequirementEngine({
      config: { enabled: true, registerStubParser: true },
    });
    expect(engine.getLifecycleState()).toBe('created');
    engine.initialize();
    expect(engine.getLifecycleState()).toBe('initialized');
    expect(engine.listRegisteredFormats()).toContain('stub');
    engine.ready();
    expect(engine.getLifecycleState()).toBe('ready');
    engine.shutdown();
    expect(engine.getLifecycleState()).toBe('shutdown');
  });

  it('loads config from env keys', () => {
    const config = loadRequirementEngineConfig({
      env: {
        ATI_REQUIREMENT_ENGINE_ENABLED: 'true',
        ATI_REQUIREMENT_ENGINE_REGISTER_STUB: 'true',
      },
    });
    expect(config).toEqual({ enabled: true, registerStubParser: true });
  });

  it('fail-closes when format parser is not registered', async () => {
    const engine = RequirementEngine.createReady({
      config: { enabled: true, registerStubParser: false },
    });
    const result = await engine.runFoundationPipeline({
      format: RequirementFormatKeys.MARKDOWN,
      payload: '# Title',
      source: { sourceId: 'doc-1' },
    });
    expect(result.status).toBe('failed');
    if (result.status === 'failed') {
      expect(result.code).toBe(RequirementEngineErrorCodes.PARSER_NOT_REGISTERED);
    }
  });

  it('runs stub pipeline end-to-end and carries context fields', async () => {
    const engine = RequirementEngine.createReady({
      config: { enabled: true, registerStubParser: true },
      createRequirementId: () => 'req-fixed',
    });
    const result = await engine.runFoundationPipeline({
      format: 'stub',
      payload: 'Must login\nMust logout',
      source: { sourceId: 'src-1', sourceVersion: '1' },
      correlationId: 'corr-1',
      tenantId: 'tenant-a',
      workspaceId: 'ws-1',
    });
    expect(result.status).toBe('completed');
    if (result.status === 'completed') {
      expect(result.requirement.requirementId).toBe('req-fixed');
      expect(result.requirement.sections[0]?.fragments).toHaveLength(2);
      expect(result.correlationId).toBe('corr-1');
      expect(result.tenantId).toBe('tenant-a');
      expect(result.workspaceId).toBe('ws-1');
    }
  });

  it('does not implement real markdown parsing via stub', async () => {
    const engine = RequirementEngine.createReady({
      config: { enabled: true, registerStubParser: true },
    });
    const md = await engine.runFoundationPipeline({
      format: 'markdown',
      payload: '# Heading',
      source: { sourceId: 'x' },
    });
    expect(md.status).toBe('failed');
  });
});
