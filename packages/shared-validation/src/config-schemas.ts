import { z } from 'zod';
import { nonEmptyStringSchema, positivePortSchema } from './primitives';

/** Minimal host boot configuration schema (apps extend as needed). */
export const hostBootConfigSchema = z.object({
  host: z.enum(['api', 'worker']),
  platformVersion: nonEmptyStringSchema,
  nodeEnv: nonEmptyStringSchema,
  logLevel: nonEmptyStringSchema,
  port: positivePortSchema,
  featureFlags: z.record(z.string(), z.boolean()),
});

export type HostBootConfig = z.infer<typeof hostBootConfigSchema>;
