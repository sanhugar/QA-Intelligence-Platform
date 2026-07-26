import { EnvKeys } from '@ati/shared-constants';
import { z } from 'zod';

export const intakeConfigSchema = z.object({
  enabled: z.boolean().default(true),
});

export type IntakeConfig = z.infer<typeof intakeConfigSchema>;

export interface LoadIntakeConfigOptions {
  env?: NodeJS.ProcessEnv;
}

function parseEnabled(raw: string | undefined): boolean {
  if (raw === undefined || raw === '') {
    return true;
  }
  return !['0', 'false', 'no', 'off'].includes(String(raw).toLowerCase());
}

export function loadIntakeConfig(options: LoadIntakeConfigOptions = {}): IntakeConfig {
  const env = options.env ?? process.env;
  return intakeConfigSchema.parse({
    enabled: parseEnabled(env[EnvKeys.INTAKE_ENABLED]),
  });
}
