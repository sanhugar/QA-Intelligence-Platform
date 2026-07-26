import type { ScheduleIntent } from '../types';
import { SharedServiceError } from '../types';

/**
 * Scheduler shell for schedule intents.
 * No Redis, BullMQ, or job processors.
 */
export class SchedulerService {
  private initialized = false;
  private readonly intents: ScheduleIntent[] = [];

  initialize(): void {
    this.initialized = true;
  }

  schedule(name: string, runAt: Date | string, payload?: Record<string, unknown>): ScheduleIntent {
    if (!this.initialized) {
      throw new SharedServiceError('Scheduler not initialized', 'SCHEDULER_NOT_INITIALIZED');
    }
    if (!name?.trim()) {
      throw new SharedServiceError('Schedule name is required', 'SCHEDULER_INVALID');
    }
    const runAtIso = typeof runAt === 'string' ? runAt : runAt.toISOString();
    if (Number.isNaN(Date.parse(runAtIso))) {
      throw new SharedServiceError('Invalid runAt', 'SCHEDULER_INVALID');
    }
    const intent: ScheduleIntent = {
      name: name.trim(),
      runAt: runAtIso,
      payload,
    };
    this.intents.push(intent);
    return intent;
  }

  list(): readonly ScheduleIntent[] {
    if (!this.initialized) {
      throw new SharedServiceError('Scheduler not initialized', 'SCHEDULER_NOT_INITIALIZED');
    }
    return this.intents;
  }
}
