import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About ChainShield.ai</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI-powered token analysis to protect you from scams and ensure safe crypto investments.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/api-plans" className="text-muted-foreground hover:text-foreground">
                  API Plans
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/subscription-policy" className="text-muted-foreground hover:text-foreground">
                  Subscription Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Follow us on social media for updates and news about token security.
            </p>
            <div className="flex gap-3">
              <a
                href="https://x.com/ChainShieldAI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Follow us on X (Twitter)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <div
                className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center opacity-50 cursor-not-allowed"
                aria-label="Discord coming soon"
              >
                <MessageCircle className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ChainShield.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
