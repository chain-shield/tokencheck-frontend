'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContent';
import { useRouter, usePathname } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const { user, loading, logout } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isBlogActive = pathname?.startsWith('/blog');

  const navLinks = [
    { label: 'Services', href: '/#services' },
    { label: 'Proof', href: '/#proof' },
    { label: 'Process', href: '/#process' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Blog', href: '/blog' },
  ];

  useEffect(() => setIsAuthenticated(!!user), [user]);
  useEffect(() => setMobileOpen(false), [pathname]);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (loading && !isAuthenticated && user === undefined) {
    return (
      <div className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#131313] backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            <div className="flex-1" />
            <div className="flex items-center justify-center py-2">
              <Spinner size="md" className="border-[#8bbbff] border-t-transparent" />
            </div>
            <div className="flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#131313] text-white backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link href="/" className="flex items-center">
            <Image src="/chainshield-logo-dark.png" alt="ChainShield Logo" width={240} height={48} className="h-10 w-auto" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = link.href === '/blog' && isBlogActive;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={[
                    'text-sm font-medium tracking-[0.04em] transition-colors',
                    isActive ? 'text-[#8bbbff]' : 'text-[#adaaaa] hover:text-[#8bbbff]',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard"><Button size="sm" className="rounded-md border border-white/10 bg-[#1a1a1a] px-4 text-white hover:bg-[#262626]">Dashboard</Button></Link>
                <Link href="/profile"><Button size="sm" className="rounded-md border border-white/10 bg-[#1a1a1a] px-4 text-white hover:bg-[#262626]">Settings</Button></Link>
                <Button size="sm" variant="outline" className="border-white/10 bg-transparent text-[#adaaaa] hover:bg-[#1a1a1a] hover:text-white" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button asChild className="rounded-md bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] px-5 text-[#003768] shadow-[0_12px_30px_rgba(114,163,229,0.25)] hover:opacity-95">
                <Link href="/audit-request">Request Security Quote</Link>
              </Button>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-[#131313] text-[#8bbbff] transition-colors hover:bg-[#1a1a1a] md:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="border-t border-white/10 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = link.href === '/blog' && isBlogActive;
                return <Link key={link.label} href={link.href} className={[ 'rounded-md px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-[#131313] text-[#8bbbff]' : 'text-[#adaaaa] hover:bg-[#131313] hover:text-white', ].join(' ')}>{link.label}</Link>;
              })}
              <Button asChild className="mt-2 rounded-md bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] text-[#003768] hover:opacity-95"><Link href="/audit-request">Request Security Quote</Link></Button>
              {isAuthenticated ? (
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <Button asChild className="rounded-md border border-white/10 bg-[#1a1a1a] text-white hover:bg-[#262626]"><Link href="/dashboard">Dashboard</Link></Button>
                  <Button asChild className="rounded-md border border-white/10 bg-[#1a1a1a] text-white hover:bg-[#262626]"><Link href="/profile">Settings</Link></Button>
                  <Button variant="outline" className="col-span-2 border-white/10 bg-transparent text-[#adaaaa] hover:bg-[#1a1a1a] hover:text-white" onClick={handleLogout}>Logout</Button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
