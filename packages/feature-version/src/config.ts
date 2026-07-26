import { EnvKeys } from '@ati/shared-constants';
import { z } from 'zod';

export const featureVersionConfigSchema = z.object({
  enabled: z.boolean().default(true),
});

export type FeatureVersionConfig = z.infer<typeof featureVersionConfigSchema>;

export interface LoadFeatureVersionConfigOptions {
  env?: NodeJS.ProcessEnv;
}

function parseEnabled(raw: string | undefined): boolean {
  if (raw === undefined || raw === '') {
    return true;
  }
  return !['0', 'false', 'no', 'off'].includes(String(raw).toLowerCase());
}

export function loadFeatureVersionConfig(
  options: LoadFeatureVersionConfigOptions = {},
): FeatureVersionConfig {
  const env = options.env ?? process.env;
  return featureVersionConfigSchema.parse({
    enabled: parseEnabled(env[EnvKeys.FEATURE_VERSION_ENABLED]),
  });
}
