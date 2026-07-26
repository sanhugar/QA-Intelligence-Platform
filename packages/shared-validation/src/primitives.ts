import { z } from 'zod';

export const nonEmptyStringSchema = z.string().trim().min(1);

export const positivePortSchema = z.coerce.number().int().positive();

export const featureFlagsRecordSchema = z.record(z.string(), z.boolean());
