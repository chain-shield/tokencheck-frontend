import type { Metadata } from 'next';
import { ClipboardList, Clock3, FileText, ShieldCheck } from 'lucide-react';

import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { MarketingPageShell } from '@/components/marketing/page-shell';
import OnboardingForm from '@/components/onboarding/form';

export const metadata: Metadata = {
  title: 'Client Onboarding | ChainShield',
  description:
    'Private ChainShield audit onboarding intake for protocol scope, roles, risks, integrations, and reporting preferences.',
};

const preparationItems = [
  'Exact repo URL and commit, tag, or branch',
  'Contract paths, modules, and explicit exclusions',
  'Role, upgrade, oracle, and dependency assumptions',
  'Known risks, prior reviews, and reporting preferences',
];

const intakeSections = [
  'Audit target and build setup',
  'Scope boundaries and review surface',
  'Protocol intent and invariants',
  'Assets, integrations, roles, and known risks',
];

export default function OnboardingPage() {
  return (
    <MarketingPageShell
      eyebrow="Client Onboarding"
      title={<>Complete your private audit intake.</>}
      description="Share the protocol-specific context auditors cannot reliably infer from code alone so ChainShield can prepare a cleaner, sharper engagement."
      headerAside={
        <div className="space-y-5 text-sm text-[#cfcfcf]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">
              Best completed by
            </div>
            <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
              <ShieldCheck className="h-5 w-5 text-[#8bbbff]" />
              Technical lead or protocol owner
            </div>
          </div>
          <p className="leading-7 text-[#adaaaa]">
            Use concise, plain-English answers. Leave a field blank when it does not apply to the engagement.
          </p>
        </div>
      }
    >
      <PageViewTracker pageTitle="Client Onboarding" pagePath="/onboarding" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <OnboardingForm />

        <aside className="space-y-6 self-start lg:sticky lg:top-28">
          <section className="rounded-[1.5rem] bg-[#131313] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
            <div className="flex items-center gap-3 text-[#8bbbff]">
              <FileText className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                What to prepare
              </span>
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
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                Intake coverage
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {intakeSections.map((item, index) => (
                <div key={item} className="rounded-2xl bg-[#20201f] px-4 py-4 ring-1 ring-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-2xl font-black tracking-[-0.05em] text-[#3a3a3a]">
                      0{index + 1}
                    </div>
                    {index === 0 ? <Clock3 className="h-4 w-4 text-[#8bbbff]" /> : null}
                  </div>
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
