import type { IntakeRecord } from './model';
import { IntakeTerminalStates } from './types';

/**
 * Process-local in-memory intake registry (D6). No persistence.
 */
export class IntakeRegistry {
  private readonly byId = new Map<string, IntakeRecord>();
  private readonly byIdempotency = new Map<string, string>();

  getById(intakeId: string): IntakeRecord | undefined {
    return this.byId.get(intakeId);
  }

  getByIdempotencyKey(key: string): IntakeRecord | undefined {
    const id = this.byIdempotency.get(key);
    return id ? this.byId.get(id) : undefined;
  }

  put(record: IntakeRecord): void {
    this.byId.set(record.intakeId, record);
    this.byIdempotency.set(record.idempotencyKey, record.intakeId);
  }

  /** Return prior terminal record for duplicate submits (D8). */
  findTerminalByIdempotency(key: string): IntakeRecord | undefined {
    const existing = this.getByIdempotencyKey(key);
    if (!existing) {
      return undefined;
    }
    if ((IntakeTerminalStates as readonly string[]).includes(existing.state)) {
      return existing;
    }
    return undefined;
  }

  clear(): void {
    this.byId.clear();
    this.byIdempotency.clear();
  }

  size(): number {
    return this.byId.size;
  }
}
