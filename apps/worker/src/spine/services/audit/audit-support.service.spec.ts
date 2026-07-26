import { AuditSupportService } from './audit-support.service';
import { SharedServiceError } from '../types';

describe('AuditSupportService', () => {
  it('records audit intents', () => {
    const service = new AuditSupportService();
    service.initialize();
    service.record('test.action', { a: 1 });
    expect(service.list()).toHaveLength(1);
  });

  it('rejects empty action', () => {
    const service = new AuditSupportService();
    service.initialize();
    expect(() => service.record('')).toThrow(SharedServiceError);
  });
});
