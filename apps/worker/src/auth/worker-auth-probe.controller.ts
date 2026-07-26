import { Controller, Get, Req } from '@nestjs/common';
import type { RequestWithPrincipal } from './auth-request';
import { ATI_PRINCIPAL_REQUEST_KEY } from './auth-request';

/** Service-principal auth probe for worker host (no user propagation). */
@Controller('platform/auth')
export class WorkerAuthProbeController {
  @Get('probe')
  probe(@Req() req: RequestWithPrincipal): { ok: true; subject: string; kind: string } {
    const principal = req[ATI_PRINCIPAL_REQUEST_KEY];
    return {
      ok: true,
      subject: principal?.subject ?? 'anonymous',
      kind: principal?.kind ?? 'none',
    };
  }
}
