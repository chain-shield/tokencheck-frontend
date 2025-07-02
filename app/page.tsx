'use client';

/**
 * Home page component for TokenCheck.ai
 *
 * This is the main landing page that includes:
 * - Token search functionality
 * - Marketing sections highlighting key features
 * - Trust indicators and statistics
 * - Call-to-action sections for registration and API plans
 */

import { Search, Shield, Zap, LineChart, CheckCircle, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [tokenAddress, setTokenAddress] = useState('');
  const router = useRouter();

  /**
   * Handles the token search form submission
   * Navigates to the token analysis page if a token address is provided
   *
   * @param e - The form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenAddress.trim()) {
      router.push(`/${tokenAddress}`);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              “The Ultimate Crypto Scam Detector: Catch Scams Before They Catch You!”
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              ChainShield AI, is a fire-breathing dragon of innovation, powered by bleeding edge AI. Make getting rugged a thing of the past...
            </p>

            <div className="flex justify-center mb-8">
              <ArrowDown className="h-12 w-12 text-foreground" />
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter ERC20 token address here..."
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className="text-lg py-6"
                />
                <Button type="submit" size="lg" className="px-8">
                  <Search className="mr-2" />
                  FREE SCAN
                </Button>
              </div>
            </form>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">1M+</p>
                <p className="text-muted-foreground">Tokens Analyzed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">99.9%</p>
                <p className="text-muted-foreground">Accuracy Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">24/7</p>
                <p className="text-muted-foreground">Real-time Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Token Analysis</h2>
            <p className="text-xl text-muted-foreground">
              Our AI-powered platform provides in-depth analysis of any ERC20 token
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <Shield className="h-8 w-8 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Advanced Security Checks</h3>
                <p className="text-muted-foreground">
                  Thorough analysis of smart contract code, liquidity locks, and token distribution
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Zap className="h-8 w-8 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
                <p className="text-muted-foreground">
                  Instant insights and continuous monitoring of token metrics
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <LineChart className="h-8 w-8 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Market Intelligence</h3>
                <p className="text-muted-foreground">
                  Deep insights into trading patterns and market manipulation attempts
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-8 w-8 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
                <p className="text-muted-foreground">
                  Comprehensive risk scoring and detailed security recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Section */}
      <div className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Enterprise-Grade API Access</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Integrate our powerful token analysis capabilities directly into your platform
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Flexible API endpoints</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Comprehensive documentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>24/7 technical support</span>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/api-plans">
                  <Button size="lg">View API Plans</Button>
                </Link>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                <code>{`
// Example API Response
{
  "token_analysis": {
    "security_score": 95,
    "risk_level": "low",
    "liquidity_locked": "98%",
    "contract_verified": true,
    "recommendations": [
      "Token contract implements standard security practices",
      "Liquidity is properly locked",
      "No suspicious code patterns detected"
    ]
  }
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Start Analyzing Tokens Today</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of dev teams using ChainShield.ai
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">Create Free Account</Button>
              </Link>
              <Link href="/api-plans">
                <Button variant="outline" size="lg">View API Plans</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
