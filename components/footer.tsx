import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Image
                src="/chainshield-logo.png"
                alt="ChainShield Logo"
                width={180}
                height={36}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-slate-300">
              Advanced smart contract security audits to protect your protocol from vulnerabilities.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-slate-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              {/* <li>
                <Link href="/api-plans" className="text-muted-foreground hover:text-foreground">
                  API Plans
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              {/* <li>
                <Link href="/subscription-policy" className="text-muted-foreground hover:text-foreground">
                  Subscription Policy
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Connect</h3>
            <p className="text-sm text-slate-300 mb-4">
              Follow us on social media for updates and news about token security.
            </p>
            <div className="flex gap-3">
              <a
                href="https://x.com/ChainShieldAI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Follow us on X (Twitter)"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://discord.gg/KtrWV7zw3H"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Join our Discord"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} ChainShield.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
