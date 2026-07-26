import { z } from 'zod';

export const observabilityConfigSchema = z.object({
  enabled: z.boolean(),
  serviceName: z.string().min(1),
  otelEnabled: z.boolean(),
  otlpEndpoint: z.string().optional(),
  sampleRatio: z.number().min(0).max(1),
});

export type ObservabilityConfig = z.infer<typeof observabilityConfigSchema>;
