import { AppError, ErrorCodes } from '@ati/errors';

/**
 * Parse ATI_FEATURE_FLAGS style `key=true,other=false` lists.
 */
export function parseFeatureFlags(raw: string | undefined): Record<string, boolean> {
  if (!raw || raw.trim() === '') {
    return {};
  }
  const flags: Record<string, boolean> = {};
  for (const part of raw.split(',')) {
    const token = part.trim();
    if (!token) {
      continue;
    }
    const [key, value] = token.split('=');
    if (!key?.trim()) {
      throw new AppError(`Invalid ATI_FEATURE_FLAGS entry: ${token}`, ErrorCodes.CONFIG_INVALID);
    }
    if (value === undefined || value === 'true') {
      flags[key.trim()] = true;
    } else if (value === 'false') {
      flags[key.trim()] = false;
    } else {
      throw new AppError(`Invalid ATI_FEATURE_FLAGS value for ${key}`, ErrorCodes.CONFIG_INVALID);
    }
  }
  return flags;
}
