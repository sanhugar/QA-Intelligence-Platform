import { SchedulerService } from './scheduler.service';
import { SharedServiceError } from '../types';

describe('SchedulerService', () => {
  it('accepts schedule intents', () => {
    const service = new SchedulerService();
    service.initialize();
    service.schedule('job', new Date('2030-01-01T00:00:00.000Z'));
    expect(service.list()).toHaveLength(1);
  });

  it('rejects invalid runAt', () => {
    const service = new SchedulerService();
    service.initialize();
    expect(() => service.schedule('job', 'not-a-date')).toThrow(SharedServiceError);
  });
});
