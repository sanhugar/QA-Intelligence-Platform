import { EnvKeys } from '@ati/shared-constants';
import { observabilityConfigSchema, type ObservabilityConfig } from './obs-config-schema';

export interface LoadObservabilityConfigOptions {
  env?: NodeJS.ProcessEnv;
  host: 'api' | 'worker';
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

function parseRatio(raw: string | undefined, defaultValue: number): number {
  if (raw === undefined || raw.trim() === '') {
    return defaultValue;
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    return defaultValue;
  }
  return Math.min(1, Math.max(0, n));
}

/** Load observability config. Invalid optional fields fall back; never throws for exporter settings. */
export function loadObservabilityConfig(
  options: LoadObservabilityConfigOptions,
): ObservabilityConfig {
  const env = options.env ?? process.env;
  const enabled = parseBool(env[EnvKeys.OBS_ENABLED], true);
  const otelEnabled = parseBool(env[EnvKeys.OTEL_ENABLED], false);
  const endpoint = env[EnvKeys.OTEL_EXPORTER_OTLP_ENDPOINT]?.trim();
  const serviceName =
    env[EnvKeys.OTEL_SERVICE_NAME]?.trim() ||
    (options.host === 'api' ? 'ati-api' : 'ati-worker');

  return observabilityConfigSchema.parse({
    enabled,
    serviceName,
    otelEnabled: enabled && otelEnabled,
    otlpEndpoint: endpoint || undefined,
    sampleRatio: parseRatio(env[EnvKeys.OTEL_TRACES_SAMPLER_ARG], 0),
  });
}
