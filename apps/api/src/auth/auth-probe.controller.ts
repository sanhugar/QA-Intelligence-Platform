import { Controller, Get, Req } from '@nestjs/common';
import type { RequestWithPrincipal } from './auth-request';
import { ATI_PRINCIPAL_REQUEST_KEY } from './auth-request';

/**
 * Minimal platform auth probe (not Domain). Requires authentication when enabled.
 */
@Controller('platform/auth')
export class AuthProbeController {
  @Get('probe')
  probe(@Req() req: RequestWithPrincipal): { ok: true; subject: string; roles: string[] } {
    const principal = req[ATI_PRINCIPAL_REQUEST_KEY];
    return {
      ok: true,
      subject: principal?.subject ?? 'anonymous',
      roles: principal?.roles ?? [],
    };
  }
}
