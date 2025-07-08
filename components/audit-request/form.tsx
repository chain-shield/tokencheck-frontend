'use client';

import { useForm, } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
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
  hasSequenceDiagrams: z.string().min(1, 'Please select diagram status'),
  importedLibraries: z.string().min(10, 'Please provide details about imported libraries'),
  commitsPinned: z.string().min(1, 'Please select commit pinning status'),
});

export type FormData = z.infer<typeof formSchema>;


export default function AuditRequestForm() {

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
    console.log('Form submitted:', data);

    // TODO add submission
    // Simulate API call
    try {
      await submitAuditRequestEmail(data);

      // Show success toast
      toast({
        title: "Audit Request Submitted",
        description: "Our team will review your request and get back to you.",
      });
    } catch (err) {
      toast({
        title: "Audit Request Failed",
        description: err as string,
        variant: "destructive",
      });

    }
  }

  console.log(form.watch());

  return (
    <Form {...form}> {/* FormProvider for react-hook-form context */}
      <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit) }} className="space-y-6"> {/* HTML form element */}
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="name"
              label="Name"
              placeholder="Your full name"
              required
            />
            <InputField
              name="email"
              label="Email"
              placeholder="your.email@company.com"
              required
            />
          </div>

          <InputField
            name="company"
            label="Company"
            placeholder="Your company or project name"
          />
        </div>

        {/* Primary Goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Audit Objectives</h3>
          <FormField
            control={form.control}
            name="primaryGoals"
            render={() => (
              <FormItem>
                <FormLabel>What are your primary goals? (Select all that apply)</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Security hardening',
                    'Formal verification',
                    'Gas optimization',
                    'Compliance'
                  ].map((goal) => (
                    <FormField
                      key={goal}
                      control={form.control}
                      name="primaryGoals"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={goal}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
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
                            <FormLabel className="text-sm font-normal">
                              {goal}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Build Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Build Configuration</h3>
          <div className="space-y-4">
            <RadioField
              name="buildSucceeds"
              label="Does forge build (or pnpm hardhat compile, foundry fmt, etc.) succeed from a clean clone? *"
              options={[
                { value: "yes", label: "Yes, builds successfully" },
                { value: "no", label: "No, there are build issues" },
                { value: "partial", label: "Partially - some components build" }
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="framework"
                label="Framework *"
                placeholder="Select framework"
                options={[
                  { value: "foundry", label: "Foundry" },
                  { value: "hardhat", label: "Hardhat" },
                ]}
              />

              <InputField
                name="frameworkVersion"
                label="Framework Version"
                placeholder="e.g., 0.2.0, 2.19.1"
              />
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Documentation & Code Quality</h3>
          <div className="space-y-4">
            <RadioField
              name="hasReadme"
              label="Is there a high-level README.md explaining protocol flow? *"
              options={[
                { value: "comprehensive", label: "Yes, comprehensive documentation" },
                { value: "basic", label: "Basic README exists" },
                { value: "minimal", label: "Minimal or no documentation" }
              ]}
            />

            <RadioField
              name="hasNatspec"
              label="Natspec / inline comments *"
              options={[
                { value: "extensive", label: "Extensive Natspec and comments" },
                { value: "some", label: "Some documentation" },
                { value: "minimal", label: "Minimal or no inline comments" }
              ]}
            />

          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t">
          <Button
            type="submit"
            size="lg"
            className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-3"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {form.formState.isSubmitting ? 'Submitting Request...' : 'Submit Audit Request'}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            We'll review your request and get back to you within 24 hours.
          </p>
        </div>
      </form>
    </Form>
  );
}
