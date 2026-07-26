import { Controller, Get, Req } from '@nestjs/common';
import type { RequestWithPrincipal } from '../auth/auth-request';
import { ATI_PRINCIPAL_REQUEST_KEY } from '../auth/auth-request';
import {
  ATI_EXECUTION_CONTEXT_KEY,
  type RequestWithExecutionContext,
} from './context-request';

/**
 * Minimal platform context probe (not Domain admin).
 * Surfaces bound execution context for isolation verification.
 */
@Controller('platform/context')
export class ContextProbeController {
  @Get('probe')
  probe(
    @Req() req: RequestWithPrincipal & RequestWithExecutionContext,
  ): {
    ok: true;
    subject: string | null;
    tenantId: string | null;
    workspaceId: string | null;
  } {
    const principal = req[ATI_PRINCIPAL_REQUEST_KEY];
    const ctx = req[ATI_EXECUTION_CONTEXT_KEY];
    return {
      ok: true,
      subject: principal?.subject ?? null,
      tenantId: ctx?.tenantId ?? null,
      workspaceId: ctx?.workspaceId ?? null,
    };
  }
}
