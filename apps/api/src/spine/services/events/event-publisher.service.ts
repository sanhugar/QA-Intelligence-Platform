import type { PlatformEvent, PlatformEventKind } from '../types';
import { SharedServiceError } from '../types';

/**
 * In-process event publisher shell.
 * No Redis, BullMQ, durable messaging, or outbox.
 */
export class EventPublisherService {
  private initialized = false;
  private readonly events: PlatformEvent[] = [];

  initialize(): void {
    this.initialized = true;
  }

  publish(kind: PlatformEventKind, name: string, payload?: Record<string, unknown>): PlatformEvent {
    if (!this.initialized) {
      throw new SharedServiceError('Event publisher not initialized', 'EVENTS_NOT_INITIALIZED');
    }
    if (!name?.trim()) {
      throw new SharedServiceError('Event name is required', 'EVENTS_INVALID');
    }
    const event: PlatformEvent = {
      kind,
      name: name.trim(),
      timestamp: new Date().toISOString(),
      payload,
    };
    this.events.push(event);
    return event;
  }

  list(): readonly PlatformEvent[] {
    if (!this.initialized) {
      throw new SharedServiceError('Event publisher not initialized', 'EVENTS_NOT_INITIALIZED');
    }
    return this.events;
  }
}
