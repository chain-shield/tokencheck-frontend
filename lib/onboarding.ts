import { z } from 'zod';

const optionalText = (maxLength: number) => z.string().max(maxLength).optional();

const scopeItemSchema = z.object({
  path: optionalText(400),
  contractModule: optionalText(400),
  notes: optionalText(1200),
});

const controlledAssetSchema = z.object({
  asset: optionalText(200),
  chain: optionalText(120),
  roleInProtocol: optionalText(500),
  expectedTokenBehavior: optionalText(500),
});

const externalDependencySchema = z.object({
  dependency: optionalText(240),
  usedFor: optionalText(500),
  trustAssumption: optionalText(1000),
});

const oracleSourceSchema = z.object({
  oracle: optionalText(240),
  usedFor: optionalText(500),
  expectedFreshness: optionalText(240),
  fallbackBehavior: optionalText(800),
});

const privilegedRoleSchema = z.object({
  role: optionalText(200),
  powers: optionalText(1000),
  holder: optionalText(400),
  timelockMultisig: optionalText(400),
});

const trustedRoleSchema = z.object({
  role: optionalText(200),
  trusted: optionalText(120),
  why: optionalText(1000),
});

const knownIssueSchema = z.object({
  issue: optionalText(500),
  affectedArea: optionalText(400),
  disposition: optionalText(240),
  reason: optionalText(1000),
});

export const reviewSurfaceOptions = [
  'Deployment scripts',
  'Upgrade scripts',
  'Tests',
  'Off-chain services',
  'None of the above',
];

export const dependencyScopeOptions = [
  { value: 'no', label: 'No' },
  { value: 'selected', label: 'Yes, selected dependencies' },
  { value: 'unsure', label: 'Unsure' },
];

export const supportedTokenBehaviorOptions = [
  'Standard ERC20',
  'USDT-like ERC20',
  'Fee-on-transfer',
  'Rebasing',
  'ERC777 / token hooks',
  'ERC4626',
  'ERC721',
  'ERC1155',
  'Native ETH',
  'Other',
];

export const includeLowQaInfoOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const preferredOutputFormatOptions = [
  'Markdown',
  'PDF',
  'GitHub issues',
  'CSV summary',
  'Executive summary',
];

export const onboardingFormSchema = z.object({
  contactName: optionalText(160),
  contactEmail: z.union([
    z.string().email('Please enter a valid email address').max(255),
    z.literal(''),
  ]).optional(),
  protocolProjectName: z
    .string()
    .min(2, 'Protocol / project name must be at least 2 characters')
    .max(200),
  repoUrl: optionalText(500),
  auditReference: optionalText(240),
  multipleReposScope: optionalText(3000),
  nonStandardSetup: optionalText(3000),
  inScopeItems: z.array(scopeItemSchema).max(30),
  outOfScope: optionalText(3000),
  reviewSurface: z.array(z.string()).max(reviewSurfaceOptions.length),
  reviewSurfaceNotes: optionalText(2000),
  dependencyScope: optionalText(80),
  selectedDependenciesNotes: optionalText(2500),
  importantUserFlows: optionalText(4000),
  securityCriticalFlows: optionalText(4000),
  forbiddenStates: optionalText(4000),
  allowedEdgeCases: optionalText(4000),
  intentionalRiskyBehavior: optionalText(3000),
  controlledAssets: z.array(controlledAssetSchema).max(30),
  supportedTokenBehaviors: z.array(z.string()).max(supportedTokenBehaviorOptions.length),
  supportedTokenNotes: optionalText(2500),
  unsupportedTokenBehaviors: optionalText(2500),
  externalDependencies: z.array(externalDependencySchema).max(30),
  oracleSources: z.array(oracleSourceSchema).max(30),
  safetyLivenessServices: optionalText(3000),
  privilegedRoles: z.array(privilegedRoleSchema).max(30),
  trustedRoles: z.array(trustedRoleSchema).max(30),
  privilegedAuditSurface: optionalText(3000),
  upgradeProcess: optionalText(3000),
  emergencyControls: optionalText(3000),
  knownIssues: z.array(knownIssueSchema).max(30),
  priorAudits: optionalText(3000),
  worryAreas: optionalText(3000),
  avoidAreas: optionalText(3000),
  includeLowQaInfo: optionalText(40),
  lowQaInfoNotes: optionalText(2000),
  severityEdgeCases: optionalText(3000),
  preferredOutputFormats: z.array(z.string()).max(preferredOutputFormatOptions.length),
  preferredOutputNotes: optionalText(2000),
  additionalAuditorContext: optionalText(4000),
});

export const onboardingPayloadSchema = z.object({
  data: onboardingFormSchema,
});

export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;

export interface OnboardingResponse {
  success: boolean;
}
