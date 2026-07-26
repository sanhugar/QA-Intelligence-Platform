import type { ClassificationInput } from './model';
import {
  ClassificationCategories,
  DesignationKeys,
  KnowledgeRoles,
  type ClassificationCategory,
  type DesignationKey,
  type KnowledgeRole,
} from './types';

export type RuleAxis = 'classification' | 'designation' | 'knowledgeRole';

export interface AxisMatch {
  value: string;
  confidence: number;
  ruleId: string;
}

export interface ClassificationRule {
  readonly id: string;
  readonly axis: RuleAxis;
  readonly priority: number;
  /** Deterministic predicate over allow-listed input only. */
  match(input: ClassificationInput): AxisMatch | null;
}

export interface RulePack {
  readonly id: string;
  readonly version: string;
  readonly rules: ClassificationRule[];
}

function fmt(input: ClassificationInput): string {
  return (input.declaredFormat ?? '').toLowerCase();
}

function hint(input: ClassificationInput): string {
  return `${input.channel ?? ''} ${input.designationHint ?? ''}`.toLowerCase();
}

/** Default deterministic rule pack (WP-3.2 T4). */
export function createDefaultRulePack(): RulePack {
  const rules: ClassificationRule[] = [
    {
      id: 'cls-format-user-story-functional',
      axis: 'classification',
      priority: 10,
      match(input) {
        if (fmt(input) === 'user_story') {
          return {
            value: ClassificationCategories.FUNCTIONAL,
            confidence: 0.75,
            ruleId: 'cls-format-user-story-functional',
          };
        }
        return null;
      },
    },
    {
      id: 'cls-format-prd-business',
      axis: 'classification',
      priority: 20,
      match(input) {
        if (fmt(input) === 'prd') {
          return {
            value: ClassificationCategories.BUSINESS,
            confidence: 0.7,
            ruleId: 'cls-format-prd-business',
          };
        }
        return null;
      },
    },
    {
      id: 'cls-format-fdd-functional',
      axis: 'classification',
      priority: 30,
      match(input) {
        if (fmt(input) === 'fdd') {
          return {
            value: ClassificationCategories.FUNCTIONAL,
            confidence: 0.7,
            ruleId: 'cls-format-fdd-functional',
          };
        }
        return null;
      },
    },
    {
      id: 'cls-format-markdown-technical',
      axis: 'classification',
      priority: 40,
      match(input) {
        if (fmt(input) === 'markdown') {
          return {
            value: ClassificationCategories.TECHNICAL,
            confidence: 0.55,
            ruleId: 'cls-format-markdown-technical',
          };
        }
        return null;
      },
    },
    {
      id: 'cls-channel-nfr',
      axis: 'classification',
      priority: 5,
      match(input) {
        const h = hint(input);
        if (h.includes('non-functional') || h.includes('nfr') || h.includes('non_functional')) {
          return {
            value: ClassificationCategories.NON_FUNCTIONAL,
            confidence: 0.8,
            ruleId: 'cls-channel-nfr',
          };
        }
        return null;
      },
    },
    {
      id: 'cls-channel-config',
      axis: 'classification',
      priority: 6,
      match(input) {
        if (hint(input).includes('config')) {
          return {
            value: ClassificationCategories.CONFIGURATION,
            confidence: 0.75,
            ruleId: 'cls-channel-config',
          };
        }
        return null;
      },
    },
    {
      id: 'des-hint-defect',
      axis: 'designation',
      priority: 10,
      match(input) {
        const h = hint(input);
        if (h.includes('defect') || h.includes('bug') || h.includes('fix')) {
          return {
            value: DesignationKeys.DEFECT,
            confidence: 0.8,
            ruleId: 'des-hint-defect',
          };
        }
        return null;
      },
    },
    {
      id: 'des-hint-enhancement',
      axis: 'designation',
      priority: 20,
      match(input) {
        if (hint(input).includes('enhancement') || hint(input).includes('improve')) {
          return {
            value: DesignationKeys.ENHANCEMENT,
            confidence: 0.75,
            ruleId: 'des-hint-enhancement',
          };
        }
        return null;
      },
    },
    {
      id: 'des-hint-docs',
      axis: 'designation',
      priority: 30,
      match(input) {
        if (hint(input).includes('doc')) {
          return {
            value: DesignationKeys.DOCUMENTATION,
            confidence: 0.75,
            ruleId: 'des-hint-docs',
          };
        }
        return null;
      },
    },
    {
      id: 'des-hint-debt',
      axis: 'designation',
      priority: 40,
      match(input) {
        if (hint(input).includes('debt') || hint(input).includes('refactor')) {
          return {
            value: DesignationKeys.TECHNICAL_DEBT,
            confidence: 0.75,
            ruleId: 'des-hint-debt',
          };
        }
        return null;
      },
    },
    {
      id: 'des-hint-investigation',
      axis: 'designation',
      priority: 50,
      match(input) {
        if (hint(input).includes('investigat') || hint(input).includes('spike')) {
          return {
            value: DesignationKeys.INVESTIGATION,
            confidence: 0.7,
            ruleId: 'des-hint-investigation',
          };
        }
        return null;
      },
    },
    {
      id: 'des-format-user-story-feature',
      axis: 'designation',
      priority: 60,
      match(input) {
        if (fmt(input) === 'user_story' || fmt(input) === 'fdd') {
          return {
            value: DesignationKeys.FEATURE,
            confidence: 0.65,
            ruleId: 'des-format-user-story-feature',
          };
        }
        return null;
      },
    },
    {
      id: 'role-accepted-with-sections-ars-candidate',
      axis: 'knowledgeRole',
      priority: 10,
      match(input) {
        if (
          input.intakeState === 'accepted' &&
          typeof input.sectionCount === 'number' &&
          input.sectionCount > 0
        ) {
          return {
            value: KnowledgeRoles.ARS_CANDIDATE,
            confidence: 0.6,
            ruleId: 'role-accepted-with-sections-ars-candidate',
          };
        }
        return null;
      },
    },
    {
      id: 'role-pending-parser-supporting',
      axis: 'knowledgeRole',
      priority: 20,
      match(input) {
        if (input.intakeState === 'accepted_pending_parser') {
          return {
            value: KnowledgeRoles.SUPPORTING,
            confidence: 0.7,
            ruleId: 'role-pending-parser-supporting',
          };
        }
        return null;
      },
    },
    {
      id: 'role-failed-unknown',
      axis: 'knowledgeRole',
      priority: 5,
      match(input) {
        if (input.intakeState === 'failed') {
          return {
            value: KnowledgeRoles.UNKNOWN,
            confidence: 1,
            ruleId: 'role-failed-unknown',
          };
        }
        return null;
      },
    },
  ];

  return {
    id: 'ati-default-classification-v1',
    version: '1.0.0',
    rules,
  };
}

export type AxisEvaluation = {
  value: ClassificationCategory | DesignationKey | KnowledgeRole;
  confidence: number;
  ruleIds: string[];
};

/**
 * First match wins by ascending priority (deterministic).
 * No match → unknown @ confidence 0.
 */
export function evaluateAxis(
  rules: ClassificationRule[],
  axis: RuleAxis,
  input: ClassificationInput,
  unknownValue: string,
): AxisEvaluation {
  const axisRules = rules
    .filter((r) => r.axis === axis)
    .slice()
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));

  for (const rule of axisRules) {
    const hit = rule.match(input);
    if (hit) {
      return {
        value: hit.value as AxisEvaluation['value'],
        confidence: hit.confidence,
        ruleIds: [hit.ruleId],
      };
    }
  }

  return {
    value: unknownValue as AxisEvaluation['value'],
    confidence: 0,
    ruleIds: [],
  };
}
