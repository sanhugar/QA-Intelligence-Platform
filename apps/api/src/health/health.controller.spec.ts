import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { platformReadiness } from '../spine/registration/platform-readiness';
import { HealthController } from './health.controller';

describe('HealthController (api)', () => {
  let controller: HealthController;

  beforeEach(async () => {
    platformReadiness.setReady(false);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get(HealthController);
  });

  it('reports liveness', () => {
    expect(controller.live()).toEqual({ status: 'ok' });
  });

  it('reports readiness when platform is ready', () => {
    platformReadiness.setReady(true);
    expect(controller.ready()).toEqual({ status: 'ok' });
  });

  it('rejects readiness when platform is not ready', () => {
    expect(() => controller.ready()).toThrow(ServiceUnavailableException);
  });
});
