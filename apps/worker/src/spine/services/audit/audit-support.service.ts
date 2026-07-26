import type { AuditRecord } from '../types';
import { SharedServiceError } from '../types';

/**
 * Audit support shell — emits audit intents only.
 * Does not grant Domain Approvals (Decision Framework remains authoritative).
 */
export class AuditSupportService {
  private initialized = false;
  private readonly records: AuditRecord[] = [];

  initialize(): void {
    this.initialized = true;
  }

  record(action: string, details?: Record<string, unknown>): AuditRecord {
    if (!this.initialized) {
      throw new SharedServiceError('Audit support not initialized', 'AUDIT_NOT_INITIALIZED');
    }
    if (!action?.trim()) {
      throw new SharedServiceError('Audit action is required', 'AUDIT_INVALID');
    }
    const record: AuditRecord = {
      action: action.trim(),
      timestamp: new Date().toISOString(),
      details,
    };
    this.records.push(record);
    return record;
  }

  list(): readonly AuditRecord[] {
    if (!this.initialized) {
      throw new SharedServiceError('Audit support not initialized', 'AUDIT_NOT_INITIALIZED');
    }
    return this.records;
  }
}
