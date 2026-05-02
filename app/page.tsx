'use client';

import { useEffect } from 'react';
import { Shield, Zap, CheckCircle, Bot, FileSearch, TrendingUp, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const services = [
  {
    title: 'Autonomous Repo Review',
    description:
      'We ingest the repo, map contract flows, generate attack hypotheses, and chase the paths most likely to produce real impact.',
    bullets: ['Repository-level attack mapping', 'Business logic path discovery', 'Impact-first finding prioritization'],
    icon: Bot,
    accent: 'text-[#91f78e]',
    panelClassName: 'md:col-span-2',
  },
  {
    title: 'Proof-Validated Findings',
    description:
      'Every Medium+ issue is checked for exploitability, impact, and reproducibility before it hits your report.',
    bullets: ['Exploitability confirmation', 'Severity and impact validation', 'No confidence-score theater'],
    icon: FileSearch,
    accent: 'text-[#8bbbff]',
  },
  {
    title: 'Continuous Monitoring',
    eyebrow: 'Coming Soon',
    description:
      'Today: managed 48-hour security runs. Next: continuous repo monitoring that flags risky commits before they reach mainnet.',
    bullets: ['Automated commit scanning', 'CI/CD workflow integration', 'Always-on exploit signal'],
    icon: TrendingUp,
    accent: 'text-[#8bbbff]',
  },
  {
    title: 'Runnable PoCs',
    description:
      'Findings ship with PoCs your engineers can run locally, so remediation starts from proof instead of interpretation.',
    bullets: ['Reproducible exploit evidence', 'Patch verification included', 'Faster path to a clean report'],
    icon: Shield,
    accent: 'text-[#91f78e]',
    panelClassName: 'md:col-span-2',
  },
];

const lifecycleSteps = [
  {
    number: '01',
    title: 'Repo + Context',
    description: 'Submit your codebase, docs, deploy timeline, and the flows you cannot afford to get wrong.',
    dotClassName: 'bg-[#8bbbff]',
  },
  {
    number: '02',
    title: 'Autonomous Discovery',
    description:
      'The system maps the repo, generates attack hypotheses, and pushes on suspicious paths until there is reproducible evidence.',
    dotClassName: 'bg-[#91f78e]',
  },
  {
    number: '03',
    title: 'Validation + PoCs',
    description: 'We confirm exploitability, grade impact, and package High/Medium findings with runnable proof your engineers can reproduce.',
    dotClassName: 'bg-[#a78bfa]',
  },
  {
    number: '04',
    title: 'Patch + Retest',
    description: 'Receive the fix path, patch with evidence in hand, and get a no-cost follow-up review once your fixes are ready.',
    dotClassName: 'bg-[#fb923c]',
  },
];

export default function Home() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'page_view', page_title: 'Homepage', page_path: '/' });
  }, []);

  const trackCtaClick = (ctaLocation: string) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'cta_click', cta_location: ctaLocation, page_path: '/' });
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <section className="relative overflow-hidden px-6 pb-24 pt-10 md:pb-32 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,187,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(145,247,142,0.08),transparent_28%)]" />
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#262626]/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#91f78e] backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[#91f78e] shadow-[0_0_16px_rgba(145,247,142,0.75)]" />
              48-Hour Discovery Runs Booking Now
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#2a140d] px-4 py-2 text-sm font-semibold text-[#ffb090] ring-1 ring-[#ff716c]/20">
              <TriangleAlert className="h-4 w-4" />
              760 breaches in 2024. $2.36B gone. One tiny bug can define the launch.
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] md:text-7xl">
                Give Us Your Repo. Get Back <span className="text-[#8bbbff]">Validated Exploits in 2 days.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#adaaaa] md:text-xl">
                ChainShield runs a <strong className="font-extrabold text-white">fully automated, first-of-its-kind autonomous exploit discovery system</strong> against your codebase and returns <strong className="font-extrabold text-white">proof-validated High/Medium findings</strong> with <strong className="font-extrabold text-[#91f78e]">runnable PoCs in under 48 hours</strong>. No vague scanner dump. No confidence-score theater. Just reproducible exploit evidence your engineers can verify.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="rounded-md bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] px-8 text-base font-bold text-[#003768] shadow-[0_18px_45px_rgba(114,163,229,0.32)] hover:opacity-95">
                <Link href="/audit-request" onClick={() => trackCtaClick('hero_primary')}>
                  <Zap className="mr-2 h-5 w-5" />
                  Book A 48-Hour Discovery Run
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-md border-white/10 bg-[#131313] px-8 text-base text-white hover:bg-[#1a1a1a] hover:text-white">
                <Link href="#pricing" onClick={() => trackCtaClick('hero_pricing')}>See How Pricing Works</Link>
              </Button>
            </div>

            <div className="grid max-w-2xl gap-4 text-sm text-[#adaaaa] sm:grid-cols-3">
              {[
                ['Turnaround', 'Under 48 hours', '#8bbbff'],
                ['Evidence', 'Runnable PoCs', '#91f78e'],
                ['Audit model', 'Validated findings', '#8bbbff'],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-2xl bg-[#131313]/90 p-4 ring-1 ring-white/10">
                  <div className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color }}>{label}</div>
                  <div className="mt-2 text-2xl font-black text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle,rgba(139,187,255,0.18),transparent_60%)] blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#131313] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
              <div className="rounded-[1.35rem] bg-[#1a1a1a] p-6 ring-1 ring-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#91f78e]">Repo-to-PoC telemetry</div>
                    <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">48-Hour Discovery Run</h2>
                  </div>
                  <div className="rounded-full bg-[#20201f] px-3 py-1 text-xs font-semibold text-[#91f78e] ring-1 ring-white/10">Signal verified</div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#20201f] p-4 ring-1 ring-white/10">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#8bbbff]">Primary signal</div>
                    <div className="mt-3 text-lg font-semibold text-white">Reentrancy / state desync</div>
                    <div className="mt-2 text-sm text-[#adaaaa]">Contract flows mapped, attacked, and ranked by exploitability.</div>
                  </div>
                  <div className="rounded-2xl bg-[#20201f] p-4 ring-1 ring-white/10">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#91f78e]">PoC status</div>
                    <div className="mt-3 text-3xl font-black text-white">Runnable</div>
                    <div className="mt-2 text-sm text-[#adaaaa]">Repro steps packaged for engineering handoff.</div>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl bg-[#0e0e0e] p-4 font-mono text-sm text-[#c9d4e5] ring-1 ring-white/10">
                  <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#767575]">
                    <span className="h-2 w-2 rounded-full bg-[#ff716c]" />
                    <span className="h-2 w-2 rounded-full bg-[#8bbbff]" />
                    <span className="h-2 w-2 rounded-full bg-[#91f78e]" />
                    hardened-analysis.sol
                  </div>
                  <div className="space-y-2">
                    <div><span className="text-[#767575]">01</span> contract VaultController {'{'}</div>
                    <div><span className="text-[#767575]">08</span> <span className="text-[#ffb090]">function</span> executeWithdrawal() external {'{'}</div>
                    <div className="rounded-lg bg-[#1a1a1a] px-3 py-2 text-[#91f78e]"><span className="text-[#767575]">11</span> validated: state update after external call - runnable PoC generated</div>
                    <div><span className="text-[#767575]">16</span> {'}'}</div>
                    <div><span className="text-[#767575]">17</span> {'}'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#131313] px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3 md:gap-16">
          {[
            ['Under 48h', 'Repo-to-PoC Turnaround', 'text-[#91f78e]'],
            ['Runnable', 'PoCs for Valid Findings', 'text-[#8bbbff]'],
            ['$25k', 'Maximum Total Fee Cap', 'text-white'],
          ].map(([value, label, color]) => (
            <div key={label} className="text-center md:text-left">
              <div className={`text-4xl font-black md:text-5xl ${color}`}>{value}</div>
              <div className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#adaaaa]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 space-y-4 md:mb-20">
            <div className="text-sm font-bold uppercase tracking-[0.24em] text-[#91f78e]">The System</div>
            <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">The Security Review Built For Teams That Ship Fast</h2>
            <p className="max-w-3xl text-lg leading-8 text-[#adaaaa]">Traditional audits tell you what someone noticed. Scanner dashboards tell you what might matter. ChainShield gives your team proof-validated, reproducible security findings with working PoCs, prioritized by exploitability and impact.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.map(({ title, description, bullets, icon: Icon, accent, eyebrow, panelClassName }) => (
              <div key={title} className={['rounded-[1.5rem] bg-[#1a1a1a] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-colors hover:bg-[#20201f]', panelClassName ?? ''].join(' ')}>
                <Icon className={['h-11 w-11', accent].join(' ')} />
                {eyebrow ? <div className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#8bbbff]">{eyebrow}</div> : null}
                <h3 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-white">{title}</h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#adaaaa]">{description}</p>
                <ul className="mt-6 space-y-3">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-white">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#91f78e]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050505] px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="text-sm font-bold uppercase tracking-[0.24em] text-[#8bbbff]">Trust model</div>
            <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">Automated Does Not Mean Unverified</h2>
            <p className="max-w-2xl text-lg leading-8 text-[#adaaaa]">Most AI security tools stop at &quot;this looks suspicious.&quot; ChainShield <strong className="font-extrabold text-white">keeps going until there is proof</strong>. The system searches for real attack paths, validates exploitability, and packages the evidence as runnable PoCs.</p>
            <p className="max-w-2xl text-lg leading-8 text-[#adaaaa]">If the system cannot prove it, it does not become a paid finding. <strong className="font-extrabold text-white">We do not sell AI guesses. We sell reproducible exploits.</strong></p>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[1.5rem] bg-[#1a1a1a] p-7 ring-1 ring-white/10">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#91f78e]">Every paid finding includes</div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  'Affected code path',
                  'Severity and impact rationale',
                  'Runnable proof of concept',
                  'Reproduction steps',
                  'Recommended fix',
                  'Post-fix retest included',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm leading-6 text-white">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#91f78e]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-[#131313] p-7 ring-1 ring-white/10">
              <div className="text-2xl font-black tracking-[-0.03em] text-white">Automation finds the path. PoCs prove the risk.</div>
              <p className="mt-4 text-base leading-7 text-[#adaaaa]">The breakthrough is automation. The buyer confidence comes from execution evidence your own engineers can run.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="bg-[#131313] px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
          <div className="space-y-8">
            <div className="text-sm font-bold uppercase tracking-[0.24em] text-[#8bbbff]">Proof of work</div>
            <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">Proof Beats Another Audit PDF.</h2>
            <p className="max-w-2xl text-lg leading-8 text-[#adaaaa]">
              See our{' '}
              <Link href="https://code4rena.com/@saraswati" target="_blank" rel="noopener noreferrer" className="font-extrabold text-[#8bbbff] underline underline-offset-4 hover:text-[#b4d0ff]">
                Code4rena profile
              </Link>{' '}
              for public contest work, where real protocols put real stakes on the line. That adversarial muscle is now encoded into an autonomous workflow built to turn repository access into validated security evidence fast.
            </p>
            <ul className="space-y-4">
              {[
                '8 high-severity and 7 medium-severity findings across live DeFi protocols',
                'Ranked 8th place in Brix Money and SukukFi competitions',
                '5 protocols secured, including SukukFi, Brix Money, Megapot, Hybra Finance, and GTE Preps',
              ].map((item) => (
                <li key={item} className="flex items-center gap-4 text-white"><CheckCircle className="h-5 w-5 text-[#91f78e]" /><span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 rounded-[2rem] bg-[linear-gradient(135deg,rgba(139,187,255,0.16),rgba(145,247,142,0.08))] blur-2xl" />
            <div className="relative rounded-[1.75rem] bg-[#1a1a1a] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#20201f] p-5 ring-1 ring-white/10"><div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8bbbff]">Competitive audits</div><div className="mt-4 text-4xl font-black text-white">90 Days</div><p className="mt-3 text-sm leading-6 text-[#adaaaa]">Sustained performance in public, high-signal contest environments.</p></div>
                <div className="rounded-2xl bg-[#20201f] p-5 ring-1 ring-white/10"><div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Protocols secured</div><div className="mt-4 text-4xl font-black text-white">5+</div><p className="mt-3 text-sm leading-6 text-[#adaaaa]">Security work validated in adversarial environments, not just marketing claims.</p></div>
              </div>
              <div className="mt-4 rounded-[1.5rem] bg-[#0e0e0e] p-6 ring-1 ring-white/10">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5"><div><div className="text-xs font-bold uppercase tracking-[0.2em] text-[#767575]">Security signal</div><div className="mt-2 text-2xl font-bold text-white">Recent outcomes</div></div><div className="rounded-full bg-[#20201f] px-3 py-1 text-xs font-semibold text-[#91f78e]">Validated</div></div>
                <div className="mt-5 space-y-4">
                  {['High/Medium findings validated before they reach your report', 'Business logic flaws packaged with exploit paths and remediation guidance', 'Clearer engineering prioritization when timelines are tight'].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm leading-6 text-[#cfcfcf]"><span className="mt-2 h-2 w-2 rounded-full bg-[#8bbbff]" /><span>{item}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">From Repo To Runnable Proof</h2>
            <p className="mt-5 text-lg leading-8 text-[#adaaaa]">A streamlined security run designed for teams that need fast signal, technical clarity, and evidence their engineers can act on.</p>
          </div>
          <div className="mx-auto max-w-5xl space-y-10">
            {lifecycleSteps.map((step) => (
              <div key={step.number} className="grid items-center gap-6 rounded-[1.5rem] bg-[#131313] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)] ring-1 ring-white/10 md:grid-cols-[140px_1fr] md:p-8">
                <div className="text-left text-6xl font-black tracking-[-0.05em] text-[#262626] md:text-right md:text-8xl">{step.number}</div>
                <div><div className="flex items-center gap-4"><div className={['h-4 w-4 rounded-full shadow-[0_0_24px_rgba(255,255,255,0.18)]', step.dotClassName].join(' ')} /><h3 className="text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl">{step.title}</h3></div><p className="mt-4 text-base leading-8 text-[#adaaaa] md:text-lg">{step.description}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#050505] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">Fair &amp; Transparent Pricing</h2>
            <p className="mt-5 text-lg leading-8 text-[#adaaaa]">You pay a modest onboarding fee, then only for proof-validated Medium+ findings with reproducible exploit evidence. If the system cannot prove it, you do not pay a finding bonus.</p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] bg-[#1a1a1a] shadow-[0_24px_60px_rgba(0,0,0,0.4)] ring-1 ring-white/10">
            <div className="flex flex-col gap-6 bg-[#20201f] p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div><div className="text-xs font-bold uppercase tracking-[0.24em] text-[#8bbbff]">48-Hour Discovery Run</div><h3 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white">$1,500 onboarding fee</h3><p className="mt-3 max-w-xl text-base leading-7 text-[#adaaaa]">Autonomous repo review, exploit validation, and runnable PoCs for the findings that deserve engineering attention.</p></div>
              <div className="rounded-2xl bg-[#131313] px-6 py-5 text-center ring-1 ring-white/10"><div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Post-fix audit</div><div className="mt-2 text-3xl font-black text-white">FREE</div></div>
            </div>

            <div className="grid gap-6 p-8 md:grid-cols-2 md:p-10">
              <div className="rounded-2xl bg-[#131313] p-6 ring-1 ring-white/10"><div className="text-sm font-bold uppercase tracking-[0.18em] text-[#adaaaa]">Finding bonus</div><div className="mt-4 text-3xl font-black text-white">$1,000 / $3,000</div><p className="mt-2 text-sm leading-6 text-[#adaaaa]">Per valid Medium / High finding</p></div>
              <div className="rounded-2xl bg-[#131313] p-6 ring-1 ring-white/10"><div className="text-sm font-bold uppercase tracking-[0.18em] text-[#adaaaa]">Maximum cap</div><div className="mt-4 text-3xl font-black text-white">$25,000</div><p className="mt-2 text-sm leading-6 text-[#adaaaa]">Total combined fee limit, regardless of how much we find</p></div>
            </div>

            <div className="border-t border-white/10 px-8 pb-10 pt-8 md:px-10">
              <Button asChild size="lg" className="w-full rounded-xl bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] py-6 text-lg font-black text-[#003768] shadow-[0_18px_45px_rgba(114,163,229,0.3)] hover:opacity-95">
                <Link href="/audit-request" onClick={() => trackCtaClick('pricing_primary')}>Submit Your Repo</Link>
              </Button>
              <p className="mt-4 text-center text-sm text-[#767575]">No commitment required. Scope your engagement in minutes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] p-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:p-16">
          <div className="space-y-6">
            <h2 className="text-4xl font-black tracking-[-0.04em] text-[#003768] md:text-6xl">Your attackers only need one path. Let&apos;s find it first.</h2>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-[#083f71] md:text-xl">Managed discovery runs are booking now. Continuous scanning opens next.</p>
            <Button asChild size="lg" className="rounded-full bg-[#0e0e0e] px-10 text-lg font-black text-white hover:bg-[#131313]">
              <Link href="/audit-request" onClick={() => trackCtaClick('final_cta')}>Submit Your Repo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
