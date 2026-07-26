import { Body, Controller, Post, Req } from '@nestjs/common';
import type { TrustedContextEnvelope } from '@ati/context';
import { WorkerContextRuntime } from './worker-context-runtime';
import {
  ATI_EXECUTION_CONTEXT_KEY,
  type RequestWithExecutionContext,
} from './context-request';

/**
 * Worker context harness probe — accepts trusted envelopes only.
 * Not a Domain/admin API.
 */
@Controller('platform/context')
export class WorkerContextProbeController {
  constructor(private readonly runtime: WorkerContextRuntime) {}

  @Post('bind')
  bind(
    @Body() body: TrustedContextEnvelope,
    @Req() req: RequestWithExecutionContext,
  ): {
    ok: true;
    tenantId: string;
    workspaceId: string | null;
  } {
    // Prefer middleware-bound context; re-resolve from body if needed for harness.
    const ctx =
      req[ATI_EXECUTION_CONTEXT_KEY] ?? this.runtime.bindFromTrustedEnvelope(body);
    return {
      ok: true,
      tenantId: ctx.tenantId,
      workspaceId: ctx.workspaceId ?? null,
    };
  }
}
