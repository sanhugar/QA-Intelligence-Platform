import type { ParsePort } from './pipeline';
import { RequirementFormatKeys } from './types';
import type { RequirementPipelineInput, ParseResult } from './pipeline';

/**
 * Test-only stub parser — NOT a Markdown/FDD/PRD/User Story implementation.
 * Maps payload lines into a single section of fragments.
 */
export function createStubParsePort(): ParsePort {
  return {
    format: RequirementFormatKeys.STUB,
    parse(input: RequirementPipelineInput): ParseResult {
      const lines = input.payload
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      const fragments = lines.map((text, index) => ({
        fragmentId: `stub-frag-${index + 1}`,
        text,
      }));
      return {
        sections: [
          {
            sectionId: 'stub-section-1',
            title: 'stub',
            kind: 'stub',
            fragments,
          },
        ],
        notes: ['stub-parser'],
      };
    },
  };
}
