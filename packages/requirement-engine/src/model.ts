import { z } from 'zod';
import { RequirementEngineError, RequirementEngineErrorCodes } from './types';

const idSchema = z.string().trim().min(1).max(256);

export const requirementSourceReferenceSchema = z.object({
  sourceId: idSchema,
  sourceVersion: z.string().trim().min(1).max(128).optional(),
  locator: z.string().trim().max(1024).optional(),
  formatHint: z.string().trim().max(64).optional(),
});

export type RequirementSourceReference = z.infer<typeof requirementSourceReferenceSchema>;

export const requirementFragmentSchema = z.object({
  fragmentId: idSchema,
  text: z.string(),
  structureHint: z.string().trim().max(128).optional(),
  /** Optional character span into the source payload (inclusive start, exclusive end). */
  span: z
    .object({
      start: z.number().int().nonnegative(),
      end: z.number().int().nonnegative(),
    })
    .refine((s) => s.end >= s.start, { message: 'span.end must be >= span.start' })
    .optional(),
});

export type RequirementFragment = z.infer<typeof requirementFragmentSchema>;

export const requirementSectionSchema = z.object({
  sectionId: idSchema,
  title: z.string().trim().max(512).optional(),
  kind: z.string().trim().max(128).optional(),
  fragments: z.array(requirementFragmentSchema).default([]),
});

export type RequirementSection = z.infer<typeof requirementSectionSchema>;

export const requirementMetadataSchema = z.object({
  languageHint: z.string().trim().max(32).optional(),
  createdAt: z.string().datetime().optional(),
  /** Confidence remains unset by foundation — AI must not invent defaults here. */
  confidence: z.number().min(0).max(1).optional(),
  attributes: z.record(z.string()).default({}),
});

export type RequirementMetadata = z.infer<typeof requirementMetadataSchema>;

export const requirementSchema = z.object({
  requirementId: idSchema,
  sections: z.array(requirementSectionSchema).default([]),
  metadata: requirementMetadataSchema.default({ attributes: {} }),
  sourceReferences: z.array(requirementSourceReferenceSchema).min(1),
});

export type Requirement = z.infer<typeof requirementSchema>;

/** Deep-freeze helper for immutable snapshots. */
export function freezeRequirement(requirement: Requirement): Readonly<Requirement> {
  for (const section of requirement.sections) {
    for (const fragment of section.fragments) {
      Object.freeze(fragment.span ?? {});
      Object.freeze(fragment);
    }
    Object.freeze(section.fragments);
    Object.freeze(section);
  }
  Object.freeze(requirement.sections);
  Object.freeze(requirement.metadata.attributes);
  Object.freeze(requirement.metadata);
  for (const ref of requirement.sourceReferences) {
    Object.freeze(ref);
  }
  Object.freeze(requirement.sourceReferences);
  return Object.freeze(requirement);
}

export function validateRequirement(input: unknown): Requirement {
  const parsed = requirementSchema.safeParse(input);
  if (!parsed.success) {
    throw new RequirementEngineError(
      `Invalid Requirement model: ${parsed.error.message}`,
      RequirementEngineErrorCodes.INVALID_MODEL,
    );
  }
  return freezeRequirement(parsed.data);
}

export function validateSourceReference(input: unknown): RequirementSourceReference {
  const parsed = requirementSourceReferenceSchema.safeParse(input);
  if (!parsed.success) {
    throw new RequirementEngineError(
      `Invalid RequirementSourceReference: ${parsed.error.message}`,
      RequirementEngineErrorCodes.INVALID_MODEL,
    );
  }
  return Object.freeze(parsed.data);
}
