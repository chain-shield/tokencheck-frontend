import Link from 'next/link';

import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { MarketingPageShell } from '@/components/marketing/page-shell';
import { Button } from '@/components/ui/button';

const differentiators = [
  'Automation-driven discovery paired with expert validation',
  'Clear severity grading and prioritization based on an agreed security rubric',
  'Actionable remediation guidance focused on practical fixes',
  'Transparent, performance-based pricing with a hard cap',
  'Included post-fix re-audit to confirm issues are resolved',
];

const workflow = [
  'Submit codebase, documentation, and scope — then align in a focused onboarding call.',
  'Run a deep automation-assisted analysis to surface risky patterns and suspicious flows.',
  'Validate findings with expert review, exploit analysis, and practical remediation guidance.',
  'Deliver a clear report and verify your fixes with a no-cost follow-up review.',
];

export default function AboutPage() {
  return (
    <MarketingPageShell
      eyebrow="About ChainShield"
      title={<>Built for teams shipping under real adversarial pressure.</>}
      description="ChainShield exists to make professional-grade smart contract security faster, more transparent, and more actionable for modern protocol teams."
      headerAside={
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Why we exist</div>
          <p className="text-sm leading-7 text-[#cfcfcf]">We combine repeatable automation, high-signal validation, and practical engineering guidance so founders can move with confidence instead of guesswork.</p>
        </div>
      }
    >
      <PageViewTracker pageTitle="About Us" pagePath="/about" />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.75rem] bg-[#131313] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 md:p-10">
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-white">Our mission</h2>
          <p className="mt-5 text-lg leading-8 text-[#adaaaa]">ChainShield helps protocols surface real security risk quickly, prioritize what matters, and get to deployment with better evidence. We believe security should feel decisive — not vague, slow, or opaque.</p>
          <p className="mt-5 text-base leading-8 text-[#adaaaa]">Our approach emphasizes business-logic review, attack-path thinking, and practical remediation guidance so engineering teams can fix what matters without losing momentum.</p>
        </section>

        <section className="rounded-[1.75rem] bg-[#131313] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 md:p-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8bbbff]">Why teams choose us</div>
          <ul className="mt-6 space-y-4 text-base leading-7 text-[#cfcfcf]">
            {differentiators.map((item) => (
              <li key={item} className="flex items-start gap-3"><span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#91f78e]" /><span>{item}</span></li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-[1.75rem] bg-[#131313] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">How ChainShield works</div>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-white">A process built for speed and signal.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {workflow.map((step, index) => (
              <div key={step} className="rounded-[1.25rem] bg-[#20201f] p-5 ring-1 ring-white/10">
                <div className="text-4xl font-black tracking-[-0.05em] text-[#2f2f2f]">0{index + 1}</div>
                <p className="mt-3 text-sm leading-7 text-[#cfcfcf]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#003768]">Need a security partner that moves with your team?</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#083f71]">Start with a Discovery Run and get the clarity your launch deserves.</p>
          </div>
          <Button asChild className="rounded-full bg-[#0e0e0e] px-8 text-white hover:bg-[#131313]"><Link href="/audit-request">Request Security Quote</Link></Button>
        </div>
      </section>
    </MarketingPageShell>
  );
}
