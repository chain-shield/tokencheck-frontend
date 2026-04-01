import AuditRequestForm from '@/components/audit-request/form';
import { ClipboardCheck, Clock3, FileCode2 } from 'lucide-react';

import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { MarketingPageShell } from '@/components/marketing/page-shell';

const preparationItems = [
  'A clean repository or commit reference',
  'Build instructions for Foundry or Hardhat',
  'Protocol README and architecture notes',
  'Any known launch constraints or critical paths',
];

const nextStepItems = [
  'We review your submission and assess fit',
  'If aligned, we follow up to scope the engagement',
  'You get a fast path into onboarding and audit kickoff',
];

export default function AuditRequestPage() {
  return (
    <MarketingPageShell
      eyebrow="Audit Intake"
      title={<>Request a ChainShield Discovery Run.</>}
      description="Tell us about your protocol, codebase, and launch context so we can quickly assess fit and scope the right engagement."
      headerAside={
        <div className="space-y-5 text-sm text-[#cfcfcf]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Average response</div>
            <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
              <Clock3 className="h-5 w-5 text-[#8bbbff]" />
              Within 24 hours
            </div>
          </div>
          <p className="leading-7 text-[#adaaaa]">
            The more specific your submission, the faster we can assess technical fit and give you a clear next step.
          </p>
        </div>
      }
    >
      <PageViewTracker pageTitle="Audit Request" pagePath="/audit-request" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <AuditRequestForm />

        <aside className="space-y-6 lg:sticky lg:top-28 self-start">
          <section className="rounded-[1.5rem] bg-[#131313] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
            <div className="flex items-center gap-3 text-[#8bbbff]">
              <FileCode2 className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">What to prepare</span>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[#cfcfcf]">
              {preparationItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#91f78e]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[1.5rem] bg-[#131313] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
            <div className="flex items-center gap-3 text-[#91f78e]">
              <ClipboardCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">What happens next</span>
            </div>
            <div className="mt-5 space-y-4">
              {nextStepItems.map((item, index) => (
                <div key={item} className="rounded-2xl bg-[#20201f] px-4 py-4 ring-1 ring-white/10">
                  <div className="text-2xl font-black tracking-[-0.05em] text-[#2f2f2f]">0{index + 1}</div>
                  <p className="mt-2 text-sm leading-7 text-[#cfcfcf]">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </MarketingPageShell>
  );
}
