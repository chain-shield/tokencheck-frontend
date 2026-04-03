'use client';

import { useState } from 'react';
import { useForm, } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { InputField } from './input-field';
import { RadioField } from './radio-field';
import { SelectField } from './select-field';
import { submitAuditRequestEmail } from '@/utils/emailService';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  primaryGoals: z.array(z.string()).min(1, 'Please select at least one goal'),
  buildSucceeds: z.string().min(1, 'Please select build status'),
  framework: z.string().min(1, 'Please select a framework'),
  frameworkVersion: z.string().optional(),
  hasReadme: z.string().min(1, 'Please select README status'),
  hasNatspec: z.string().min(1, 'Please select Natspec status'),
  // hasSequenceDiagrams: z.string().min(1, 'Please select diagram status'),
  // importedLibraries: z.string().min(10, 'Please provide details about imported libraries'),
  // commitsPinned: z.string().min(1, 'Please select commit pinning status'),
});

export type FormData = z.infer<typeof formSchema>;

const goalOptions = [
  'Security hardening',
  'Formal verification',
  'Gas optimization',
  'Compliance',
];

const buildStatusOptions = [
  { value: 'yes', label: 'Yes, builds successfully' },
  { value: 'no', label: 'No, there are build issues' },
  { value: 'partial', label: 'Partially — some components build' },
];

const frameworkOptions = [
  { value: 'foundry', label: 'Foundry' },
  { value: 'hardhat', label: 'Hardhat' },
];

const readmeOptions = [
  { value: 'comprehensive', label: 'Yes, comprehensive documentation' },
  { value: 'basic', label: 'Basic README exists' },
  { value: 'minimal', label: 'Minimal or no documentation' },
];

const natspecOptions = [
  { value: 'extensive', label: 'Extensive Natspec and comments' },
  { value: 'some', label: 'Some documentation' },
  { value: 'minimal', label: 'Minimal or no inline comments' },
];

const sectionClassName = 'rounded-[1.5rem] bg-[#131313] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10 md:p-8';


export default function AuditRequestForm() {
  const [formStarted, setFormStarted] = useState(false);

  const trackFormStart = () => {
    if (!formStarted) {
      setFormStarted(true);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'form_start', form_name: 'audit_request', page_path: '/audit-request' });
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      primaryGoals: [],
      buildSucceeds: '',
      framework: '',
      frameworkVersion: '',
      hasReadme: '',
      hasNatspec: '',
      // hasSequenceDiagrams: '',
      // importedLibraries: '',
      // commitsPinned: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'form_submit', form_name: 'audit_request', page_path: '/audit-request' });

    try {
      await submitAuditRequestEmail(data);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'form_success', form_name: 'audit_request', page_path: '/audit-request' });

      // Show success toast
      toast({
        title: "Audit Request Submitted",
        description: "Our team will review your request and get back to you.",
      });
      form.reset();
    } catch {
      toast({
        title: "Audit Request Failed",
        description: "Please try again!",
        variant: "destructive",
      });

    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(139,187,255,0.16),rgba(114,163,229,0.1))] p-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <div className="rounded-[calc(1.5rem-1px)] bg-[#131313] px-6 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#8bbbff]">Audit request form</div>
                <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white md:text-3xl">Share the details that matter most.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#adaaaa]">
                  This intake helps us understand your codebase readiness, audit priorities, and documentation quality before we scope the engagement.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-[#20201f] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#91f78e]">
                ~3 minute intake
              </div>
            </div>
          </div>
        </div>

        <div className={sectionClassName}>
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Section 01</div>
            <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">Contact Information</h3>
            <p className="mt-2 text-sm leading-7 text-[#adaaaa]">Who should we contact if your project is a good fit for a Discovery Run?</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              name="name"
              label="Name"
              placeholder="Your full name"
              required
              onFocus={trackFormStart}
            />
            <InputField
              name="email"
              label="Email"
              placeholder="your.email@company.com"
              required
              onFocus={trackFormStart}
            />
          </div>

          <div className="mt-4">
            <InputField
              name="company"
              label="Company"
              placeholder="Your company or project name"
              onFocus={trackFormStart}
            />
          </div>
        </div>

        <div className={sectionClassName}>
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Section 02</div>
            <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">Audit Objectives</h3>
            <p className="mt-2 text-sm leading-7 text-[#adaaaa]">Select the outcomes you care about most so we can tailor the review.</p>
          </div>

          <FormField
            control={form.control}
            name="primaryGoals"
            render={() => (
              <FormItem className="space-y-4">
                <FormLabel className="text-sm font-semibold text-white">What are your primary goals? (Select all that apply)</FormLabel>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {goalOptions.map((goal) => (
                    <FormField
                      key={goal}
                      control={form.control}
                      name="primaryGoals"
                      render={({ field }) => {
                        const checked = field.value?.includes(goal);

                        return (
                          <FormItem
                            key={goal}
                            className={[
                              'flex flex-row items-start gap-3 rounded-xl border p-4 transition-colors',
                              checked ? 'border-[#8bbbff]/40 bg-[#182230]' : 'border-white/10 bg-[#20201f] hover:bg-[#262626]',
                            ].join(' ')}
                          >
                            <FormControl>
                              <Checkbox
                                className="mt-0.5 h-5 w-5 rounded-md border-white/20 data-[state=checked]:border-[#8bbbff] data-[state=checked]:bg-[#8bbbff] data-[state=checked]:text-[#003768] focus-visible:ring-[#8bbbff] focus-visible:ring-offset-0"
                                checked={field.value?.includes(goal)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, goal])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== goal
                                      )
                                    )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer text-sm font-medium text-white">
                              {goal}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage className="text-[#ff8e8e]" />
              </FormItem>
            )}
          />
        </div>

        <div className={sectionClassName}>
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Section 03</div>
            <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">Build Configuration</h3>
            <p className="mt-2 text-sm leading-7 text-[#adaaaa]">Tell us how ready the repo is for a clean review environment.</p>
          </div>

          <div className="space-y-5">
            <RadioField
              name="buildSucceeds"
              label="Does forge build (or pnpm hardhat compile, foundry fmt, etc.) succeed from a clean clone? *"
              options={buildStatusOptions}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectField
                name="framework"
                label="Framework *"
                placeholder="Select framework"
                options={frameworkOptions}
              />

              <InputField
                name="frameworkVersion"
                label="Framework Version"
                placeholder="e.g., 0.2.0, 2.19.1"
              />
            </div>
          </div>
        </div>

        <div className={sectionClassName}>
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Section 04</div>
            <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">Documentation & Code Quality</h3>
            <p className="mt-2 text-sm leading-7 text-[#adaaaa]">The more context you provide, the faster we can move from intake to signal.</p>
          </div>

          <div className="space-y-5">
            <RadioField
              name="hasReadme"
              label="Is there a high-level README.md explaining protocol flow? *"
              options={readmeOptions}
            />

            <RadioField
              name="hasNatspec"
              label="Natspec / inline comments *"
              options={natspecOptions}
            />

          </div>
        </div>

        <div className="rounded-[1.5rem] bg-[#131313] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8bbbff]">Final step</div>
              <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">Submit your audit request</h3>
              <p className="mt-2 text-sm leading-7 text-[#adaaaa]">We&apos;ll review your request and get back to you within 24 hours.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#20201f] px-4 py-3 text-sm text-[#cfcfcf]">
              Discovery Run scoping • Fast follow-up • Clear next steps
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-xl bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] px-8 py-6 text-lg font-black text-[#003768] shadow-[0_18px_45px_rgba(114,163,229,0.25)] hover:opacity-95 md:w-auto"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {form.formState.isSubmitting ? 'Submitting Request...' : 'Submit Audit Request'}
          </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
