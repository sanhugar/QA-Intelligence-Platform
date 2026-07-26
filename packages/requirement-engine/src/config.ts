import { z } from 'zod';
import { EnvKeys } from '@ati/shared-constants';
import { RequirementEngineError, RequirementEngineErrorCodes } from './types';

export const requirementEngineConfigSchema = z.object({
  enabled: z.boolean(),
  /** When true, engine init registers the test stub parser under format `stub`. */
  registerStubParser: z.boolean(),
});

export type RequirementEngineConfig = z.infer<typeof requirementEngineConfigSchema>;

export interface LoadRequirementEngineConfigOptions {
  env?: NodeJS.ProcessEnv;
}

function parseBool(raw: string | undefined, defaultValue: boolean): boolean {
  if (raw === undefined || raw.trim() === '') {
    return defaultValue;
  }
  const v = raw.trim().toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes') {
    return true;
  }
  if (v === 'false' || v === '0' || v === 'no') {
    return false;
  }
  return defaultValue;
}

export function loadRequirementEngineConfig(
  options: LoadRequirementEngineConfigOptions = {},
): RequirementEngineConfig {
  const env = options.env ?? process.env;
  try {
    return requirementEngineConfigSchema.parse({
      enabled: parseBool(env[EnvKeys.REQUIREMENT_ENGINE_ENABLED], true),
      registerStubParser: parseBool(env[EnvKeys.REQUIREMENT_ENGINE_REGISTER_STUB], false),
    });
  } catch (err) {
    throw new RequirementEngineError(
      `Invalid requirement engine config: ${(err as Error).message}`,
      RequirementEngineErrorCodes.INVALID_CONFIG,
    );
  }
}
