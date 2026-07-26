import { Controller, Get, HttpCode, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { platformReadiness } from '../spine/registration/platform-readiness';

/**
 * Host liveness and readiness probes for the Worker process.
 * Readiness is a boolean only — registration details are not exposed (WP-1.2).
 */
@Controller('health')
export class HealthController {
  @Get('live')
  @HttpCode(HttpStatus.OK)
  live(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('ready')
  ready(): { status: 'ok' } {
    if (!platformReadiness.isReady()) {
      throw new ServiceUnavailableException({ status: 'not_ready' });
    }
    return { status: 'ok' };
  }
}
