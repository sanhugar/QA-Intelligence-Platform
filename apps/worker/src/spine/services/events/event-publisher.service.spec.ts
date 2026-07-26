import { EventPublisherService } from './event-publisher.service';
import { SharedServiceError } from '../types';

describe('EventPublisherService', () => {
  it('publishes in-process events', () => {
    const service = new EventPublisherService();
    service.initialize();
    service.publish('platform', 'boot', { ok: true });
    expect(service.list()).toHaveLength(1);
  });

  it('fails when not initialized', () => {
    expect(() => new EventPublisherService().publish('platform', 'x')).toThrow(SharedServiceError);
  });
});
