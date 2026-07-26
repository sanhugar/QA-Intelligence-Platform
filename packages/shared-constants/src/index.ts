/** Environment variable keys used by Foundation hosts. */
export const EnvKeys = {
  API_PORT: 'ATI_API_PORT',
  WORKER_PORT: 'ATI_WORKER_PORT',
  NODE_ENV: 'ATI_NODE_ENV',
  LOG_LEVEL: 'ATI_LOG_LEVEL',
  PLATFORM_VERSION: 'ATI_PLATFORM_VERSION',
  FEATURE_FLAGS: 'ATI_FEATURE_FLAGS',
} as const;

export const DefaultPorts = {
  api: 3000,
  worker: 3001,
} as const;

export const DEFAULT_PLATFORM_VERSION = '0.0.0';
