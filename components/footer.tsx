import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0e0e0e] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr,1fr,1fr,1fr]">
          <div className="space-y-6">
            <Image src="/chainshield-logo-dark.png" alt="ChainShield Logo" width={180} height={36} className="h-10 w-auto" />
            <p className="max-w-sm text-sm leading-7 text-[#adaaaa]">
              Continuous, hardened smart contract security intelligence for teams that need to ship with conviction.
            </p>
            <div className="rounded-2xl bg-[#131313] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#91f78e]">Secure your next release</div>
              <p className="mt-3 text-sm leading-6 text-[#adaaaa]">
                Start with a ChainShield Discovery Run and get validated findings your engineers can patch immediately.
              </p>
              <Button asChild className="mt-4 rounded-md bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] text-[#003768] hover:opacity-95">
                <Link href="/audit-request">Request Security Quote</Link>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#8bbbff]">Navigate</h3>
            <ul className="space-y-3 text-sm text-[#adaaaa]">
              <li><Link href="/#services" className="transition-colors hover:text-white">Services</Link></li>
              <li><Link href="/#proof" className="transition-colors hover:text-white">Proof of Work</Link></li>
              <li><Link href="/#process" className="transition-colors hover:text-white">Process</Link></li>
              <li><Link href="/#pricing" className="transition-colors hover:text-white">Pricing</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#8bbbff]">Legal</h3>
            <ul className="space-y-3 text-sm text-[#adaaaa]">
              <li><Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-white">Terms of Use</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-white">About ChainShield</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#8bbbff]">Connect</h3>
            <p className="mb-4 text-sm leading-7 text-[#adaaaa]">
              Questions about a Discovery Run or a full audit? Reach us directly and we’ll help you scope the right engagement.
            </p>
            <a href="mailto:support@chainshield.ai" className="text-sm font-medium text-white transition-colors hover:text-[#8bbbff]">
              support@chainshield.ai
            </a>
            <div className="mt-4 flex gap-3">
              <a href="https://x.com/ChainShieldAI" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#131313] text-[#adaaaa] transition-colors hover:border-[#8bbbff]/50 hover:text-[#8bbbff]" aria-label="Follow us on X (Twitter)">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://discord.gg/KtrWV7zw3H" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#131313] text-[#adaaaa] transition-colors hover:border-[#8bbbff]/50 hover:text-[#8bbbff]" aria-label="Join our Discord">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-[#767575]">
          © {new Date().getFullYear()} ChainShield.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
