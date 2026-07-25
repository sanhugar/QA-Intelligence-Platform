import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

/**
 * Host liveness and readiness probes for the API process.
 * Route paths follow NestJS controller conventions for this host only —
 * not an architectural contract for other hosts or future modules.
 */
@Controller('health')
export class HealthController {
  @Get('live')
  @HttpCode(HttpStatus.OK)
  live(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('ready')
  @HttpCode(HttpStatus.OK)
  ready(): { status: 'ok' } {
    return { status: 'ok' };
  }
}
