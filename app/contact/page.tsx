import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { MarketingPageShell } from '@/components/marketing/page-shell';
import { Button } from '@/components/ui/button';

const contactCards = [
  {
    title: 'General Inquiries',
    description: 'Questions about Discovery Runs, timelines, or whether ChainShield is the right fit for your protocol.',
    value: 'support@chainshield.ai',
  },
  {
    title: 'Technical Support',
    description: 'Need help with a current engagement, reporting flow, or a technical question about our process.',
    value: 'support@chainshield.ai',
  },
];

export default function ContactPage() {
  return (
    <MarketingPageShell
      eyebrow="Contact"
      title={<>Talk to the ChainShield team.</>}
      description="Whether you’re preparing for launch, evaluating an audit, or need support on an active engagement, we’re here to help."
      headerAside={
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Response channel</div>
          <a href="mailto:support@chainshield.ai" className="text-lg font-bold text-white transition-colors hover:text-[#8bbbff]">support@chainshield.ai</a>
        </div>
      }
    >
      <PageViewTracker pageTitle="Contact Us" pagePath="/contact" />

      <div className="grid gap-6 md:grid-cols-2">
        {contactCards.map((card) => (
          <section key={card.title} className="rounded-[1.75rem] bg-[#131313] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-white">{card.title}</h2>
            <p className="mt-4 text-base leading-7 text-[#adaaaa]">{card.description}</p>
            <a href={`mailto:${card.value}`} className="mt-6 inline-block text-lg font-semibold text-[#8bbbff] transition-colors hover:text-white">{card.value}</a>
          </section>
        ))}
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] bg-[#131313] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 md:p-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8bbbff]">Enterprise & Launch Support</div>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-white">Need custom scoping or a higher-touch engagement?</h2>
          <p className="mt-4 text-base leading-8 text-[#adaaaa]">If you’re shipping a protocol with unusual architecture, a compressed launch window, or an internal security process that needs to integrate with ours, we can help scope the right engagement model.</p>
          <Button asChild className="mt-8 rounded-full bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] px-8 text-[#003768] hover:opacity-95"><Link href="/audit-request">Request Security Quote</Link></Button>
        </div>

        <div className="rounded-[1.75rem] bg-[#131313] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 md:p-10">
          <div className="flex items-center gap-3 text-[#91f78e]"><MessageCircle className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.2em]">Community channels</span></div>
          <div className="mt-6 space-y-4 text-sm font-medium text-[#cfcfcf]">
            <a href="https://x.com/ChainShieldAI" target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-white/10 bg-[#20201f] px-5 py-4 transition-colors hover:bg-[#262626]">Follow ChainShield on X</a>
            <a href="https://discord.gg/KtrWV7zw3H" target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-white/10 bg-[#20201f] px-5 py-4 transition-colors hover:bg-[#262626]">Join the ChainShield Discord</a>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
