import { EnvKeys } from '@ati/shared-constants';
import { z } from 'zod';

export const classificationConfigSchema = z.object({
  enabled: z.boolean().default(true),
});

export type ClassificationConfig = z.infer<typeof classificationConfigSchema>;

export interface LoadClassificationConfigOptions {
  env?: NodeJS.ProcessEnv;
}

function parseEnabled(raw: string | undefined): boolean {
  if (raw === undefined || raw === '') {
    return true;
  }
  return !['0', 'false', 'no', 'off'].includes(String(raw).toLowerCase());
}

export function loadClassificationConfig(
  options: LoadClassificationConfigOptions = {},
): ClassificationConfig {
  const env = options.env ?? process.env;
  return classificationConfigSchema.parse({
    enabled: parseEnabled(env[EnvKeys.CLASSIFICATION_ENABLED]),
  });
}
