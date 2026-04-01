'use client';

import { useEffect } from 'react';
import { Shield, Zap, CheckCircle, Bot, FileSearch, TrendingUp, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const services = [
  {
    title: 'In-depth Analysis',
    description:
      'Proprietary automation accelerates vulnerability discovery so our team can quickly identify, validate, and prioritize the issues that matter most.',
    bullets: ['Rapid vulnerability detection', 'Pattern recognition analysis', 'Finding triage and validation'],
    icon: Bot,
    accent: 'text-[#91f78e]',
    panelClassName: 'md:col-span-2',
  },
  {
    title: 'Expert Review',
    description:
      'Every candidate issue is reviewed by security specialists who validate impact, confirm exploitability, and turn findings into actionable guidance.',
    bullets: ['Code verification', 'Business logic analysis', 'Custom security recommendations'],
    icon: FileSearch,
    accent: 'text-[#8bbbff]',
  },
  {
    title: 'Continuous Monitoring',
    eyebrow: 'Coming Soon',
    description:
      'Rescan for vulnerabilities on every new commit before deployment, with monitoring designed to slot directly into your engineering workflow.',
    bullets: ['Automated code scanning', 'CI/CD pipeline integration', 'Detailed reporting on detected vulnerabilities'],
    icon: TrendingUp,
    accent: 'text-[#8bbbff]',
  },
  {
    title: 'Post-Fix Audit',
    description:
      'Once vulnerabilities are identified, we verify your patches at no extra cost to make sure the issue is completely neutralized before launch.',
    bullets: ['Patch verification included', 'Focused retest coverage', 'Faster path to a clean report'],
    icon: Shield,
    accent: 'text-[#91f78e]',
    panelClassName: 'md:col-span-2',
  },
];

const lifecycleSteps = [
  {
    number: '01',
    title: 'Scope + Onboarding',
    description: 'Submit your codebase, docs, and priorities, then align with us in a focused onboarding call.',
    dotClassName: 'bg-[#8bbbff]',
  },
  {
    number: '02',
    title: 'Automation Pass',
    description:
      'Our security experts leverage proprietary automation to surface suspicious flows, edge cases, and high-risk contract behavior.',
    dotClassName: 'bg-[#91f78e]',
  },
  {
    number: '03',
    title: 'Expert Validation',
    description: 'We triage the signal, validate findings, build PoCs when needed, and translate risk into concrete engineering action.',
    dotClassName: 'bg-[#a78bfa]',
  },
  {
    number: '04',
    title: 'Report + Post-Fix Review',
    description: 'Receive a concise, actionable report and a no-cost follow-up review once your fixes are ready.',
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
              Discovery Runs Booking Now
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#2a140d] px-4 py-2 text-sm font-semibold text-[#ffb090] ring-1 ring-[#ff716c]/20">
              <TriangleAlert className="h-4 w-4" />
              760 breaches in 2024. $2.36B gone. One tiny bug and your protocol&apos;s next.
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] md:text-7xl">
                Before You Drop Another <span className="text-[#8bbbff]">$100k</span> On A Static Audit...
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#adaaaa] md:text-xl">
                ChainShield&apos;s Discovery Run surfaces the most dangerous issues first — triaged, validated, and PoC-backed — so your engineers can patch immediately. Pay a modest onboarding fee and only for valid Medium+ findings.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="rounded-md bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] px-8 text-base font-bold text-[#003768] shadow-[0_18px_45px_rgba(114,163,229,0.32)] hover:opacity-95">
                <Link href="/audit-request" onClick={() => trackCtaClick('hero_primary')}>
                  <Zap className="mr-2 h-5 w-5" />
                  Start Your Audit
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-md border-white/10 bg-[#131313] px-8 text-base text-white hover:bg-[#1a1a1a] hover:text-white">
                <Link href="#pricing" onClick={() => trackCtaClick('hero_pricing')}>See Pricing</Link>
              </Button>
            </div>

            <div className="grid max-w-2xl gap-4 text-sm text-[#adaaaa] sm:grid-cols-3">
              {[
                ['Lead time', 'Under 7 days', '#8bbbff'],
                ['Post-fix retest', 'Included', '#91f78e'],
                ['Audit model', 'Aligned pricing', '#8bbbff'],
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
                    <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#91f78e]">Live audit telemetry</div>
                    <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">Discovery Run</h2>
                  </div>
                  <div className="rounded-full bg-[#20201f] px-3 py-1 text-xs font-semibold text-[#91f78e] ring-1 ring-white/10">Signal verified</div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#20201f] p-4 ring-1 ring-white/10">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#8bbbff]">Primary risk lane</div>
                    <div className="mt-3 text-lg font-semibold text-white">Reentrancy / state desync</div>
                    <div className="mt-2 text-sm text-[#adaaaa]">Contract flows mapped and ranked before engineering review begins.</div>
                  </div>
                  <div className="rounded-2xl bg-[#20201f] p-4 ring-1 ring-white/10">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#91f78e]">Audit speed</div>
                    <div className="mt-3 text-3xl font-black text-white">5 Day</div>
                    <div className="mt-2 text-sm text-[#adaaaa]">Average turnaround for the discovery-first engagement.</div>
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
                    <div className="rounded-lg bg-[#1a1a1a] px-3 py-2 text-[#91f78e]"><span className="text-[#767575]">11</span> finding: state updated after external call → manual validation required</div>
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
            ['Save 50%', 'Over Traditional Audits', 'text-[#91f78e]'],
            ['5 Day', 'Average Audit Time', 'text-[#8bbbff]'],
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
            <div className="text-sm font-bold uppercase tracking-[0.24em] text-[#91f78e]">Our Expertise</div>
            <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">Hardened Security Services</h2>
            <p className="max-w-3xl text-lg leading-8 text-[#adaaaa]">Security work that balances automation, human validation, and launch-critical speed.</p>
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

      <section id="proof" className="bg-[#131313] px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
          <div className="space-y-8">
            <div className="text-sm font-bold uppercase tracking-[0.24em] text-[#8bbbff]">Proof of work</div>
            <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">WE FIND BUGS.<br />BEFORE ATTACKERS DO.</h2>
            <p className="max-w-2xl text-lg leading-8 text-[#adaaaa]">Our team competes in Code4rena and Cantina — rigorous public smart contract competitions where real protocols put real stakes on the line.</p>
            <ul className="space-y-4">
              {[
                '6 high-severity findings across live DeFi protocols',
                'Ranked #144 on a competitive 90-day leaderboard',
                '5 protocols secured — including Brix Money, Megapot, and Hybra Finance',
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
                  {['High-severity findings identified and validated before launch', 'Business logic flaws triaged with exploit paths and mitigation guidance', 'Clearer engineering prioritization when timelines are tight'].map((item) => (
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
            <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">Protocol Protection Lifecycle</h2>
            <p className="mt-5 text-lg leading-8 text-[#adaaaa]">A streamlined audit flow designed for speed, technical clarity, and decision-ready reporting.</p>
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
            <p className="mt-5 text-lg leading-8 text-[#adaaaa]">We align our incentives with yours: a modest onboarding fee, performance-based pricing for valid findings, and a clear maximum cap.</p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] bg-[#1a1a1a] shadow-[0_24px_60px_rgba(0,0,0,0.4)] ring-1 ring-white/10">
            <div className="flex flex-col gap-6 bg-[#20201f] p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div><div className="text-xs font-bold uppercase tracking-[0.24em] text-[#8bbbff]">Protocol Sentinel Audit</div><h3 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white">$1,500 onboarding fee</h3><p className="mt-3 max-w-xl text-base leading-7 text-[#adaaaa]">Comprehensive manual and automated review with a discovery-first workflow built for high-stakes launches.</p></div>
              <div className="rounded-2xl bg-[#131313] px-6 py-5 text-center ring-1 ring-white/10"><div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Post-fix audit</div><div className="mt-2 text-3xl font-black text-white">FREE</div></div>
            </div>

            <div className="grid gap-6 p-8 md:grid-cols-2 md:p-10">
              <div className="rounded-2xl bg-[#131313] p-6 ring-1 ring-white/10"><div className="text-sm font-bold uppercase tracking-[0.18em] text-[#adaaaa]">Finding bonus</div><div className="mt-4 text-3xl font-black text-white">$1,000 / $3,000</div><p className="mt-2 text-sm leading-6 text-[#adaaaa]">Per valid Medium / Critical finding</p></div>
              <div className="rounded-2xl bg-[#131313] p-6 ring-1 ring-white/10"><div className="text-sm font-bold uppercase tracking-[0.18em] text-[#adaaaa]">Maximum cap</div><div className="mt-4 text-3xl font-black text-white">$25,000</div><p className="mt-2 text-sm leading-6 text-[#adaaaa]">Total combined fee limit, regardless of how much we find</p></div>
            </div>

            <div className="border-t border-white/10 px-8 pb-10 pt-8 md:px-10">
              <Button asChild size="lg" className="w-full rounded-xl bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] py-6 text-lg font-black text-[#003768] shadow-[0_18px_45px_rgba(114,163,229,0.3)] hover:opacity-95">
                <Link href="/audit-request" onClick={() => trackCtaClick('pricing_primary')}>Request Security Quote</Link>
              </Button>
              <p className="mt-4 text-center text-sm text-[#767575]">No commitment required • Scope your engagement in minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] p-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:p-16">
          <div className="space-y-6">
            <h2 className="text-4xl font-black tracking-[-0.04em] text-[#003768] md:text-6xl">Ready to harden your protocol?</h2>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-[#083f71] md:text-xl">Don&apos;t let your launch be defined by a preventable security failure. Get the expert eyes your code deserves.</p>
            <Button asChild size="lg" className="rounded-full bg-[#0e0e0e] px-10 text-lg font-black text-white hover:bg-[#131313]">
              <Link href="/audit-request" onClick={() => trackCtaClick('final_cta')}>Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}