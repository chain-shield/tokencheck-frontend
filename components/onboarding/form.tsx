'use client';

import { useState } from 'react';
import {
  Control,
  FieldPath,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import {
  dependencyScopeOptions,
  includeLowQaInfoOptions,
  OnboardingFormData,
  onboardingFormSchema,
  preferredOutputFormatOptions,
  reviewSurfaceOptions,
  supportedTokenBehaviorOptions,
} from '@/lib/onboarding';
import { submitOnboardingFormEmail } from '@/utils/emailService';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const sectionClassName =
  'rounded-[1.5rem] bg-[#131313] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10 md:p-8';
const fieldClassName =
  'h-12 rounded-xl border-white/10 bg-[#20201f] text-white placeholder:text-[#767575] focus-visible:border-[#8bbbff] focus-visible:ring-[#8bbbff] focus-visible:ring-offset-0';
const textareaClassName =
  'min-h-[120px] rounded-xl border-white/10 bg-[#20201f] text-white placeholder:text-[#767575] focus-visible:border-[#8bbbff] focus-visible:ring-[#8bbbff] focus-visible:ring-offset-0';

const emptyScopeItem = () => ({ path: '', contractModule: '', notes: '' });
const emptyControlledAsset = () => ({
  asset: '',
  chain: '',
  roleInProtocol: '',
  expectedTokenBehavior: '',
});
const emptyExternalDependency = () => ({
  dependency: '',
  usedFor: '',
  trustAssumption: '',
});
const emptyOracleSource = () => ({
  oracle: '',
  usedFor: '',
  expectedFreshness: '',
  fallbackBehavior: '',
});
const emptyPrivilegedRole = () => ({
  role: '',
  powers: '',
  holder: '',
  timelockMultisig: '',
});
const emptyTrustedRole = () => ({
  role: '',
  trusted: '',
  why: '',
});
const emptyKnownIssue = () => ({
  issue: '',
  affectedArea: '',
  disposition: '',
  reason: '',
});

function getDefaultValues(): OnboardingFormData {
  return {
    contactName: '',
    contactEmail: '',
    protocolProjectName: '',
    repoUrl: '',
    auditReference: '',
    multipleReposScope: '',
    nonStandardSetup: '',
    inScopeItems: [emptyScopeItem()],
    outOfScope: '',
    reviewSurface: [],
    reviewSurfaceNotes: '',
    dependencyScope: '',
    selectedDependenciesNotes: '',
    importantUserFlows: '',
    securityCriticalFlows: '',
    forbiddenStates: '',
    allowedEdgeCases: '',
    intentionalRiskyBehavior: '',
    controlledAssets: [emptyControlledAsset()],
    supportedTokenBehaviors: [],
    supportedTokenNotes: '',
    unsupportedTokenBehaviors: '',
    externalDependencies: [emptyExternalDependency()],
    oracleSources: [emptyOracleSource()],
    safetyLivenessServices: '',
    privilegedRoles: [emptyPrivilegedRole()],
    trustedRoles: [emptyTrustedRole()],
    privilegedAuditSurface: '',
    upgradeProcess: '',
    emergencyControls: '',
    knownIssues: [emptyKnownIssue()],
    priorAudits: '',
    worryAreas: '',
    avoidAreas: '',
    includeLowQaInfo: '',
    lowQaInfoNotes: '',
    severityEdgeCases: '',
    preferredOutputFormats: [],
    preferredOutputNotes: '',
    additionalAuditorContext: '',
  };
}

type TextFieldProps = {
  control: Control<OnboardingFormData>;
  name: FieldPath<OnboardingFormData>;
  label: string;
  placeholder: string;
  description?: string;
  required?: boolean;
  type?: string;
  onFocus?: () => void;
};

function TextField({
  control,
  name,
  label,
  placeholder,
  description,
  required,
  type = 'text',
  onFocus,
}: TextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-sm font-semibold text-white">
            {label}
            {required ? ' *' : null}
          </FormLabel>
          {description ? (
            <FormDescription className="text-sm leading-6 text-[#adaaaa]">
              {description}
            </FormDescription>
          ) : null}
          <FormControl>
            <Input
              name={field.name}
              ref={field.ref}
              type={type}
              value={(field.value as string | undefined) ?? ''}
              onBlur={field.onBlur}
              onChange={field.onChange}
              onFocus={onFocus}
              placeholder={placeholder}
              className={fieldClassName}
            />
          </FormControl>
          <FormMessage className="text-[#ff8e8e]" />
        </FormItem>
      )}
    />
  );
}

type TextAreaFieldProps = Omit<TextFieldProps, 'type'> & {
  rows?: number;
};

function TextAreaField({
  control,
  name,
  label,
  placeholder,
  description,
  required,
  rows = 4,
  onFocus,
}: TextAreaFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-sm font-semibold text-white">
            {label}
            {required ? ' *' : null}
          </FormLabel>
          {description ? (
            <FormDescription className="text-sm leading-6 text-[#adaaaa]">
              {description}
            </FormDescription>
          ) : null}
          <FormControl>
            <Textarea
              name={field.name}
              ref={field.ref}
              value={(field.value as string | undefined) ?? ''}
              onBlur={field.onBlur}
              onChange={field.onChange}
              onFocus={onFocus}
              placeholder={placeholder}
              rows={rows}
              className={textareaClassName}
            />
          </FormControl>
          <FormMessage className="text-[#ff8e8e]" />
        </FormItem>
      )}
    />
  );
}

type CheckboxGroupProps = {
  control: Control<OnboardingFormData>;
  name: 'reviewSurface' | 'supportedTokenBehaviors' | 'preferredOutputFormats';
  label: string;
  options: string[];
  onInteract: () => void;
};

function CheckboxGroup({
  control,
  name,
  label,
  options,
  onInteract,
}: CheckboxGroupProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = Array.isArray(field.value) ? field.value : [];

        return (
          <FormItem className="space-y-4">
            <FormLabel className="text-sm font-semibold text-white">{label}</FormLabel>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {options.map((option) => {
                const checked = value.includes(option);

                return (
                  <FormItem
                    key={option}
                    className={[
                      'flex items-start gap-3 rounded-xl border p-4 transition-colors',
                      checked
                        ? 'border-[#8bbbff]/40 bg-[#182230]'
                        : 'border-white/10 bg-[#20201f] hover:bg-[#262626]',
                    ].join(' ')}
                  >
                    <FormControl>
                      <Checkbox
                        className="mt-0.5 h-5 w-5 rounded-md border-white/20 data-[state=checked]:border-[#8bbbff] data-[state=checked]:bg-[#8bbbff] data-[state=checked]:text-[#003768] focus-visible:ring-[#8bbbff] focus-visible:ring-offset-0"
                        checked={checked}
                        onCheckedChange={(nextChecked) => {
                          onInteract();
                          field.onChange(
                            nextChecked
                              ? [...value, option]
                              : value.filter((item) => item !== option)
                          );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-sm font-medium text-white">
                      {option}
                    </FormLabel>
                  </FormItem>
                );
              })}
            </div>
            <FormMessage className="text-[#ff8e8e]" />
          </FormItem>
        );
      }}
    />
  );
}

type RadioChoiceGroupProps = {
  control: Control<OnboardingFormData>;
  name: 'dependencyScope' | 'includeLowQaInfo';
  label: string;
  options: { value: string; label: string }[];
  onInteract: () => void;
};

function RadioChoiceGroup({
  control,
  name,
  label,
  options,
  onInteract,
}: RadioChoiceGroupProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-sm font-semibold text-white">{label}</FormLabel>
          <FormControl>
            <RadioGroup
              value={(field.value as string | undefined) ?? ''}
              onValueChange={(value) => {
                onInteract();
                field.onChange(value);
              }}
              className="grid gap-3"
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className={[
                    'flex items-center gap-3 rounded-xl border p-4 transition-colors',
                    field.value === option.value
                      ? 'border-[#8bbbff]/40 bg-[#182230]'
                      : 'border-white/10 bg-[#20201f] hover:bg-[#262626]',
                  ].join(' ')}
                >
                  <FormControl>
                    <RadioGroupItem
                      value={option.value}
                      className="h-5 w-5 border-white/20 text-[#8bbbff] ring-offset-0 focus-visible:ring-[#8bbbff]"
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer text-sm font-medium text-white">
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-[#ff8e8e]" />
        </FormItem>
      )}
    />
  );
}

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">
        Section {number}
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-7 text-[#adaaaa]">{description}</p>
    </div>
  );
}

function RowShell({
  title,
  removeLabel,
  canRemove,
  onRemove,
  children,
}: {
  title: string;
  removeLabel: string;
  canRemove: boolean;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#20201f] p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="text-sm font-bold text-white">{title}</div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 rounded-md px-3 text-[#ffb4b4] hover:bg-[#2a1d1d] hover:text-white"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={removeLabel}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  );
}

function AddRowButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-md border-white/10 bg-transparent text-[#8bbbff] hover:bg-[#182230] hover:text-white"
      onClick={onClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

export default function OnboardingForm() {
  const [formStarted, setFormStarted] = useState(false);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: getDefaultValues(),
  });

  const inScopeItems = useFieldArray({ control: form.control, name: 'inScopeItems' });
  const controlledAssets = useFieldArray({ control: form.control, name: 'controlledAssets' });
  const externalDependencies = useFieldArray({ control: form.control, name: 'externalDependencies' });
  const oracleSources = useFieldArray({ control: form.control, name: 'oracleSources' });
  const privilegedRoles = useFieldArray({ control: form.control, name: 'privilegedRoles' });
  const trustedRoles = useFieldArray({ control: form.control, name: 'trustedRoles' });
  const knownIssues = useFieldArray({ control: form.control, name: 'knownIssues' });

  const trackFormStart = () => {
    if (!formStarted) {
      setFormStarted(true);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'form_start',
        form_name: 'client_onboarding',
        page_path: '/onboarding',
      });
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'form_submit',
      form_name: 'client_onboarding',
      page_path: '/onboarding',
    });

    try {
      await submitOnboardingFormEmail(data);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'form_success',
        form_name: 'client_onboarding',
        page_path: '/onboarding',
      });

      toast({
        title: 'Onboarding intake submitted',
        description: 'Our audit team will review the protocol context and follow up.',
      });
      form.reset(getDefaultValues());
      setFormStarted(false);
    } catch {
      toast({
        title: 'Onboarding submission failed',
        description: 'Please try again or contact support@chainshield.ai.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(139,187,255,0.16),rgba(145,247,142,0.1))] p-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <div className="rounded-[calc(1.5rem-1px)] bg-[#131313] px-6 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#8bbbff]">
                  Private client audit intake
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white md:text-3xl">
                  Share the protocol context code cannot infer.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#adaaaa]">
                  Leave any field blank if it does not apply. More specificity helps auditors
                  distinguish intentional protocol design from real attack surface.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-[#20201f] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#91f78e]">
                7 sections
              </div>
            </div>
          </div>
        </div>

        <section className={sectionClassName}>
          <SectionHeading
            number="01"
            title="Audit Target"
            description="Identify the protocol, audit reference, repository scope, and any setup context the auditors need before opening the code."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              control={form.control}
              name="contactName"
              label="Client contact name"
              placeholder="Name of the main audit contact"
              onFocus={trackFormStart}
            />
            <TextField
              control={form.control}
              name="contactEmail"
              label="Client contact email"
              placeholder="security@example.com"
              type="email"
              onFocus={trackFormStart}
            />
            <TextField
              control={form.control}
              name="protocolProjectName"
              label="Protocol / project name"
              placeholder="Protocol or project name"
              required
              onFocus={trackFormStart}
            />
            <TextField
              control={form.control}
              name="repoUrl"
              label="Repo URL"
              placeholder="https://github.com/org/repo"
              onFocus={trackFormStart}
            />
            <TextField
              control={form.control}
              name="auditReference"
              label="Exact commit / tag / branch to audit"
              placeholder="commit hash, tag, or branch name"
              onFocus={trackFormStart}
            />
          </div>

          <div className="mt-5 space-y-5">
            <TextAreaField
              control={form.control}
              name="multipleReposScope"
              label="Are there multiple repos or packages in scope?"
              placeholder="Only list what should be audited."
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="nonStandardSetup"
              label="Any non-standard setup needed to build or test?"
              placeholder="Only mention things not obvious from the repo. Do not include secrets."
              onFocus={trackFormStart}
            />
          </div>
        </section>

        <section className={sectionClassName}>
          <SectionHeading
            number="02"
            title="Scope"
            description="Define what auditors should inspect, what they should ignore, and how far review should extend beyond contracts."
          />

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">
                What contracts, folders, or modules are in scope?
              </h3>
              <div className="mt-4 space-y-4">
                {inScopeItems.fields.map((field, index) => (
                  <RowShell
                    key={field.id}
                    title={`Scope item ${index + 1}`}
                    removeLabel={`Remove in-scope item ${index + 1}`}
                    canRemove={inScopeItems.fields.length > 1}
                    onRemove={() => inScopeItems.remove(index)}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <TextField
                        control={form.control}
                        name={`inScopeItems.${index}.path` as FieldPath<OnboardingFormData>}
                        label="Path"
                        placeholder="contracts/Vault.sol"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`inScopeItems.${index}.contractModule` as FieldPath<OnboardingFormData>}
                        label="Contract / module"
                        placeholder="Vault"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`inScopeItems.${index}.notes` as FieldPath<OnboardingFormData>}
                        label="Notes"
                        placeholder="Priority, risk, or context"
                        onFocus={trackFormStart}
                      />
                    </div>
                  </RowShell>
                ))}
                <AddRowButton
                  label="Add in-scope item"
                  onClick={() => {
                    trackFormStart();
                    inScopeItems.append(emptyScopeItem());
                  }}
                />
              </div>
            </div>

            <TextAreaField
              control={form.control}
              name="outOfScope"
              label="What is explicitly out of scope?"
              placeholder="Examples: mocks, scripts, old versions, periphery, external dependencies."
              onFocus={trackFormStart}
            />

            <CheckboxGroup
              control={form.control}
              name="reviewSurface"
              label="Should deployment scripts, upgrade scripts, tests, or off-chain services be reviewed?"
              options={reviewSurfaceOptions}
              onInteract={trackFormStart}
            />

            <TextAreaField
              control={form.control}
              name="reviewSurfaceNotes"
              label="Review surface notes"
              placeholder="Add any notes about deployment scripts, upgrade scripts, tests, or off-chain services."
              onFocus={trackFormStart}
            />

            <RadioChoiceGroup
              control={form.control}
              name="dependencyScope"
              label="Are third-party dependencies in scope beyond your usage of them?"
              options={dependencyScopeOptions}
              onInteract={trackFormStart}
            />

            <TextAreaField
              control={form.control}
              name="selectedDependenciesNotes"
              label="Selected dependencies / notes"
              placeholder="List dependency names and any review expectations."
              onFocus={trackFormStart}
            />
          </div>
        </section>

        <section className={sectionClassName}>
          <SectionHeading
            number="03"
            title="Protocol Intent"
            description="Explain what the protocol is meant to do, which flows matter most, and which outcomes should be impossible."
          />

          <div className="space-y-5">
            <TextAreaField
              control={form.control}
              name="importantUserFlows"
              label="What are the protocol's most important user flows?"
              placeholder="Examples: deposit, withdraw, borrow, liquidate, stake, claim, bridge, vote."
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="securityCriticalFlows"
              label="What are the most security-critical flows?"
              placeholder="Where would a bug be most damaging?"
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="forbiddenStates"
              label="What should never happen?"
              placeholder="List protocol invariants or forbidden states in plain English."
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="allowedEdgeCases"
              label="What edge cases are intentionally allowed?"
              placeholder="Examples: delayed withdrawals, paused actions, dust loss, temporary imbalance."
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="intentionalRiskyBehavior"
              label="Any protocol behavior that looks risky in code but is intentional?"
              placeholder="Describe intentional behavior auditors should not misclassify."
              onFocus={trackFormStart}
            />
          </div>
        </section>

        <section className={sectionClassName}>
          <SectionHeading
            number="04"
            title="Assets And Integrations"
            description="Map assets, token behavior, third-party dependencies, oracles, and required off-chain services."
          />

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white">
                What assets can the protocol custody, mint, burn, freeze, or otherwise control?
              </h3>
              <div className="mt-4 space-y-4">
                {controlledAssets.fields.map((field, index) => (
                  <RowShell
                    key={field.id}
                    title={`Asset ${index + 1}`}
                    removeLabel={`Remove asset ${index + 1}`}
                    canRemove={controlledAssets.fields.length > 1}
                    onRemove={() => controlledAssets.remove(index)}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <TextField
                        control={form.control}
                        name={`controlledAssets.${index}.asset` as FieldPath<OnboardingFormData>}
                        label="Asset"
                        placeholder="USDC, protocol token, ETH"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`controlledAssets.${index}.chain` as FieldPath<OnboardingFormData>}
                        label="Chain"
                        placeholder="Ethereum, Base, Arbitrum"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`controlledAssets.${index}.roleInProtocol` as FieldPath<OnboardingFormData>}
                        label="Role in protocol"
                        placeholder="Collateral, reward token, vault share"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`controlledAssets.${index}.expectedTokenBehavior` as FieldPath<OnboardingFormData>}
                        label="Expected token behavior"
                        placeholder="Standard ERC20, fee-on-transfer, rebasing"
                        onFocus={trackFormStart}
                      />
                    </div>
                  </RowShell>
                ))}
                <AddRowButton
                  label="Add asset"
                  onClick={() => {
                    trackFormStart();
                    controlledAssets.append(emptyControlledAsset());
                  }}
                />
              </div>
            </div>

            <CheckboxGroup
              control={form.control}
              name="supportedTokenBehaviors"
              label="Which token behaviors are supported?"
              options={supportedTokenBehaviorOptions}
              onInteract={trackFormStart}
            />

            <TextAreaField
              control={form.control}
              name="supportedTokenNotes"
              label="Supported token behavior notes"
              placeholder="Add notes for Other or any special handling."
              onFocus={trackFormStart}
            />

            <TextAreaField
              control={form.control}
              name="unsupportedTokenBehaviors"
              label="Which token behaviors are explicitly unsupported?"
              placeholder="List token behaviors the protocol is not intended to support."
              onFocus={trackFormStart}
            />

            <div>
              <h3 className="text-sm font-semibold text-white">
                What external protocols, bridges, or messaging systems does this rely on?
              </h3>
              <div className="mt-4 space-y-4">
                {externalDependencies.fields.map((field, index) => (
                  <RowShell
                    key={field.id}
                    title={`Dependency ${index + 1}`}
                    removeLabel={`Remove dependency ${index + 1}`}
                    canRemove={externalDependencies.fields.length > 1}
                    onRemove={() => externalDependencies.remove(index)}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <TextField
                        control={form.control}
                        name={`externalDependencies.${index}.dependency` as FieldPath<OnboardingFormData>}
                        label="Dependency"
                        placeholder="LayerZero, Uniswap, Chainlink"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`externalDependencies.${index}.usedFor` as FieldPath<OnboardingFormData>}
                        label="Used for"
                        placeholder="Bridging, pricing, swaps"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`externalDependencies.${index}.trustAssumption` as FieldPath<OnboardingFormData>}
                        label="Trust / availability assumption"
                        placeholder="What must remain true?"
                        onFocus={trackFormStart}
                      />
                    </div>
                  </RowShell>
                ))}
                <AddRowButton
                  label="Add dependency"
                  onClick={() => {
                    trackFormStart();
                    externalDependencies.append(emptyExternalDependency());
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                What oracle or price sources are used?
              </h3>
              <div className="mt-4 space-y-4">
                {oracleSources.fields.map((field, index) => (
                  <RowShell
                    key={field.id}
                    title={`Oracle ${index + 1}`}
                    removeLabel={`Remove oracle ${index + 1}`}
                    canRemove={oracleSources.fields.length > 1}
                    onRemove={() => oracleSources.remove(index)}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <TextField
                        control={form.control}
                        name={`oracleSources.${index}.oracle` as FieldPath<OnboardingFormData>}
                        label="Oracle"
                        placeholder="Chainlink ETH/USD"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`oracleSources.${index}.usedFor` as FieldPath<OnboardingFormData>}
                        label="Used for"
                        placeholder="Collateral valuation"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`oracleSources.${index}.expectedFreshness` as FieldPath<OnboardingFormData>}
                        label="Expected freshness"
                        placeholder="Heartbeat, max age, update cadence"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`oracleSources.${index}.fallbackBehavior` as FieldPath<OnboardingFormData>}
                        label="Fallback behavior"
                        placeholder="Pause, use cached price, revert"
                        onFocus={trackFormStart}
                      />
                    </div>
                  </RowShell>
                ))}
                <AddRowButton
                  label="Add oracle"
                  onClick={() => {
                    trackFormStart();
                    oracleSources.append(emptyOracleSource());
                  }}
                />
              </div>
            </div>

            <TextAreaField
              control={form.control}
              name="safetyLivenessServices"
              label="Are keepers, relayers, bots, or off-chain services required for safety or liveness?"
              placeholder="Describe required services, failure modes, and any safety assumptions."
              onFocus={trackFormStart}
            />
          </div>
        </section>

        <section className={sectionClassName}>
          <SectionHeading
            number="05"
            title="Roles And Trust"
            description="Document privileged actors, trusted assumptions, upgrade paths, and emergency controls."
          />

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white">
                List privileged roles and what each can do.
              </h3>
              <div className="mt-4 space-y-4">
                {privilegedRoles.fields.map((field, index) => (
                  <RowShell
                    key={field.id}
                    title={`Privileged role ${index + 1}`}
                    removeLabel={`Remove privileged role ${index + 1}`}
                    canRemove={privilegedRoles.fields.length > 1}
                    onRemove={() => privilegedRoles.remove(index)}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <TextField
                        control={form.control}
                        name={`privilegedRoles.${index}.role` as FieldPath<OnboardingFormData>}
                        label="Role"
                        placeholder="Owner, guardian, pauser"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`privilegedRoles.${index}.powers` as FieldPath<OnboardingFormData>}
                        label="Powers"
                        placeholder="Upgrade, pause, set parameters"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`privilegedRoles.${index}.holder` as FieldPath<OnboardingFormData>}
                        label="Current / expected holder"
                        placeholder="Multisig, DAO, team wallet"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`privilegedRoles.${index}.timelockMultisig` as FieldPath<OnboardingFormData>}
                        label="Timelock / multisig?"
                        placeholder="2-day timelock, 3/5 multisig"
                        onFocus={trackFormStart}
                      />
                    </div>
                  </RowShell>
                ))}
                <AddRowButton
                  label="Add privileged role"
                  onClick={() => {
                    trackFormStart();
                    privilegedRoles.append(emptyPrivilegedRole());
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Which privileged roles should auditors treat as trusted?
              </h3>
              <div className="mt-4 space-y-4">
                {trustedRoles.fields.map((field, index) => (
                  <RowShell
                    key={field.id}
                    title={`Trusted role ${index + 1}`}
                    removeLabel={`Remove trusted role ${index + 1}`}
                    canRemove={trustedRoles.fields.length > 1}
                    onRemove={() => trustedRoles.remove(index)}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <TextField
                        control={form.control}
                        name={`trustedRoles.${index}.role` as FieldPath<OnboardingFormData>}
                        label="Role"
                        placeholder="Guardian"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`trustedRoles.${index}.trusted` as FieldPath<OnboardingFormData>}
                        label="Trusted?"
                        placeholder="Yes, no, partially"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`trustedRoles.${index}.why` as FieldPath<OnboardingFormData>}
                        label="Why"
                        placeholder="Trust model explanation"
                        onFocus={trackFormStart}
                      />
                    </div>
                  </RowShell>
                ))}
                <AddRowButton
                  label="Add trusted role"
                  onClick={() => {
                    trackFormStart();
                    trustedRoles.append(emptyTrustedRole());
                  }}
                />
              </div>
            </div>

            <TextAreaField
              control={form.control}
              name="privilegedAuditSurface"
              label="Which privileged-role actions should still be considered valid audit surface?"
              placeholder="Examples: unsafe upgrades, missing timelocks, unrestricted sweeps, weak role separation, dangerous parameter changes."
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="upgradeProcess"
              label="Can contracts be upgraded? If yes, what is the intended upgrade process?"
              placeholder="Describe upgrade authority, approvals, timelocks, proxy pattern, and rollout process."
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="emergencyControls"
              label="What emergency controls exist and what are their intended limits?"
              placeholder="Examples: pause, unpause, freeze, rescue tokens, disable markets."
              onFocus={trackFormStart}
            />
          </div>
        </section>

        <section className={sectionClassName}>
          <SectionHeading
            number="06"
            title="Known Risks"
            description="Capture accepted risk, prior reviews, worries, and areas where auditor time would be low-value."
          />

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Known issues, accepted risks, or areas intentionally deferred.
              </h3>
              <div className="mt-4 space-y-4">
                {knownIssues.fields.map((field, index) => (
                  <RowShell
                    key={field.id}
                    title={`Known issue ${index + 1}`}
                    removeLabel={`Remove known issue ${index + 1}`}
                    canRemove={knownIssues.fields.length > 1}
                    onRemove={() => knownIssues.remove(index)}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <TextField
                        control={form.control}
                        name={`knownIssues.${index}.issue` as FieldPath<OnboardingFormData>}
                        label="Issue"
                        placeholder="Known limitation or bug"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`knownIssues.${index}.affectedArea` as FieldPath<OnboardingFormData>}
                        label="Affected area"
                        placeholder="Contract, module, or flow"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`knownIssues.${index}.disposition` as FieldPath<OnboardingFormData>}
                        label="Accepted / deferred?"
                        placeholder="Accepted, deferred, planned fix"
                        onFocus={trackFormStart}
                      />
                      <TextField
                        control={form.control}
                        name={`knownIssues.${index}.reason` as FieldPath<OnboardingFormData>}
                        label="Reason"
                        placeholder="Why this risk is accepted or deferred"
                        onFocus={trackFormStart}
                      />
                    </div>
                  </RowShell>
                ))}
                <AddRowButton
                  label="Add known issue"
                  onClick={() => {
                    trackFormStart();
                    knownIssues.append(emptyKnownIssue());
                  }}
                />
              </div>
            </div>

            <TextAreaField
              control={form.control}
              name="priorAudits"
              label="Prior audits or internal reviews"
              placeholder="Add file links, URLs, or short notes."
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="worryAreas"
              label="Any areas you are especially worried about?"
              placeholder="Share the flows, assumptions, or contracts that keep you up at night."
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="avoidAreas"
              label="Any areas you do not want auditors to spend time on?"
              placeholder="List anything intentionally excluded from auditor attention."
              onFocus={trackFormStart}
            />
          </div>
        </section>

        <section className={sectionClassName}>
          <SectionHeading
            number="07"
            title="Reporting Preferences"
            description="Set expectations for finding types, severity exceptions, output formats, and final context."
          />

          <div className="space-y-6">
            <RadioChoiceGroup
              control={form.control}
              name="includeLowQaInfo"
              label="Should Low / QA / Info findings be included?"
              options={includeLowQaInfoOptions}
              onInteract={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="lowQaInfoNotes"
              label="Low / QA / Info notes"
              placeholder="Add any notes about how these findings should be handled."
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="severityEdgeCases"
              label="Any severity edge cases we should handle differently from the default private-audit rubric?"
              placeholder="Only mention exceptions, not full severity definitions."
              onFocus={trackFormStart}
            />
            <CheckboxGroup
              control={form.control}
              name="preferredOutputFormats"
              label="Preferred output format"
              options={preferredOutputFormatOptions}
              onInteract={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="preferredOutputNotes"
              label="Output format notes"
              placeholder="Add formatting, delivery, or issue-tracking preferences."
              onFocus={trackFormStart}
            />
            <TextAreaField
              control={form.control}
              name="additionalAuditorContext"
              label="Anything else auditors should know?"
              placeholder="Share any remaining product, business, launch, or threat-model context."
              onFocus={trackFormStart}
            />
          </div>
        </section>

        <section className="rounded-[1.5rem] bg-[#131313] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8bbbff]">
                Final step
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">
                Submit the client onboarding intake
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#adaaaa]">
                The audit team will use this context to validate scope and prepare the engagement.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#20201f] px-4 py-3 text-sm text-[#cfcfcf]">
              Private context capture - audit-ready scope - fewer kickoff gaps
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] px-8 py-6 text-lg font-black text-[#003768] shadow-[0_18px_45px_rgba(114,163,229,0.25)] hover:opacity-95 md:w-auto"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {form.formState.isSubmitting
                ? 'Submitting intake...'
                : 'Submit onboarding intake'}
            </Button>
          </div>
        </section>
      </form>
    </Form>
  );
}
