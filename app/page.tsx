'use client';

/**
 * Home page component for ChainShield.ai
 *
 * This is the main landing page that includes:
 * - Token search functionality
 * - Marketing sections highlighting key features
 * - Trust indicators and statistics
 * - Call-to-action sections for registration and API plans
 */

import { Shield, Zap, CheckCircle, Bot, FileSearch, TrendingUp, Calendar, Mail, Users, MessageCircle, TriangleAlert, ArrowBigRightDash, ArrowBigLeftDash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">ChainShield</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-slate-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#process" className="text-slate-600 hover:text-blue-600 transition-colors">Process</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
              <Link href="/audit-request">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Audit
                </Button>
              </Link>

            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 bg-red-100 text-red-800 hover:bg-red-200 inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors">
              <TriangleAlert className="w-4 h-4 mr-2" />
              760 Breaches in 2024. $2.36B Gone. One Tiny Bug and Your Protocol’s Next.
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Flip This Switch, And Our AI Bloodhounds Will Tear Through Your Smart-Contracts—<i>Finding The Landmines Before Hackers Do</i>.
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              ChainShield combines advanced AI technology with expert security analysis to deliver
              comprehensive smart contract audits in minutes, not weeks. For pennies on the dollar.
              Protect your protocol with enterprise-grade security assessments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center align-items-center">
              <ArrowBigRightDash className="w-12 h-12 text-red-400" />
              <Link href="/audit-request">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  <Zap className="w-5 h-5 mr-2" />
                  Get Your Free Audit Preview
                </Button>
              </Link>
              <ArrowBigLeftDash className="w-12 h-12 text-red-400" />
              {/* <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button> */}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">99.9%</div>
              <div className="text-slate-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">Save 80%</div>
              <div className="text-slate-600">Over Manual Audits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1 Day</div>
              <div className="text-slate-600">Average Audit Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-slate-600">Critical Bugs Found</div>
            </div>
          </div>
        </div>
      </section >

      {/* Services Section */}
      < section id="services" className="py-16 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Security Analysis
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered platform identifies vulnerabilities, analyzes code patterns, and provides
              actionable recommendations to secure your smart contracts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">AI-Powered Analysis</CardTitle>
                <CardDescription className="text-base">
                  Expertly Finetuned AI agents scan your code for known vulnerabilities and emerging threats.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Automated vulnerability detection</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Pattern recognition analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Continuous learning updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <FileSearch className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Expert Review</CardTitle>
                <CardDescription className="text-base">
                  Human security experts validate AI findings and provide detailed remediation guidance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Manual code verification</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Business logic analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Custom security recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Continuous Monitoring (Coming Soon)</CardTitle>
                <CardDescription className="text-base">
                  Rescan for vulnerabilities on every new commit <i>before</i> deploying to mainnet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Automated code scanning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Integrate into CI/CD pipeline</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Detailed reporting on detect vulnerabilities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section >

      {/* Process Section */}
      < section id="process" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How ChainShield Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our streamlined process delivers comprehensive security audits with unprecedented speed and accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Submit Codebase</h3>
              <p className="text-slate-600">
                Submit your Solidity smart contract code through our secure platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-slate-600">
                Our AI engine performs comprehensive analysis, identifying vulnerabilities and security risks.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Review</h3>
              <p className="text-slate-600">
                Security experts validate findings and provide detailed remediation recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Detailed Report</h3>
              <p className="text-slate-600">
                Receive a comprehensive audit report with actionable security fixes.
              </p>
            </div>
          </div>
        </div>
      </section >

      {/* Pricing Section */}
      < section id="pricing" className="py-16 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the perfect plan for your security needs. All plans include our AI-powered analysis
              and expert validation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-8xl mx-auto">
            <Card className={`border-2 transition-all duration-300 relative ${selectedPlan === 'pro' ? 'border-blue-500 shadow-xl' : 'border-slate-200 hover:border-blue-300'}`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-4 py-1 inline-flex items-center rounded-full border text-xs font-semibold">
                  Most Popular
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <div className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-full inline-flex items-center">
                  50% OFF
                </div>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  $997
                  <span className="text-lg font-normal text-slate-600">/audit</span>
                </div>
                <div className="text-2xl font-bold text-slate-500 mb-2 line-through">
                  $1997/audit
                </div>
                <CardDescription>Ideal for startup to mid-sized teams with small to medium-sized protocols</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Deep AI-powered smart contract audit</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Expert manual review</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Comprehensive security report</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>48-hour turnaround</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Threat Mitigation guidance</span>
                  </li>
                </ul>
                <Link href="/audit-request">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setSelectedPlan('professional')}
                  >
                    Choose Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className={`border-2 transition-all duration-300 ${selectedPlan === 'enterprise' ? 'border-blue-500 shadow-xl' : 'border-slate-200 hover:border-blue-300'}`}>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  Custom
                  <span className="text-lg font-normal text-slate-600">/project</span>
                </div>
                <CardDescription>For large protocols and institutional clients</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Full security assessment</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Multiple contract audits</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Ongoing monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Dedicated support team</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>SLA guarantees</span>
                  </li>
                </ul>
                <a href="mailto:support@chainshield.ai">
                  <Button
                    className="w-full text-white bg-blue-600 hover:bg-blue-700"
                    variant={selectedPlan === 'enterprise' ? 'default' : 'outline'}
                    onClick={() => setSelectedPlan('enterprise')}
                  >
                    Contact Sales
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="py-16 bg-gradient-to-r from-blue-600 to-emerald-600" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Secure Your Smart Contracts?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of projects that trust ChainShield for their security needs.
            Get started with a free lite audit today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/audit-request">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
                <Zap className="w-5 h-5 mr-2" />
                Get Your Free Audit Preview
              </Button>
            </Link>

          </div>
        </div>
      </section >

      {/* Contact Section */}
      < section id="contact" className="py-16 bg-slate-900" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Have questions about our audit process? Our security experts are here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <p className="text-slate-300">support@chainshield.ai</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Sales Team</h3>
              <p className="text-slate-300">support@chainshield.ai</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Support</h3>
              <p className="text-slate-300">support@chainshield.ai</p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Connect With Us</h3>
            <div className="flex justify-center gap-12">
              <div className="flex flex-col items-center">
                <a
                  href="https://x.com/ChainShieldAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors mb-3"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <span className="text-slate-400 text-sm">Follow us on X</span>
              </div>
              <div className="flex flex-col items-center">
                <a
                  href="https://discord.gg/KtrWV7zw3H"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors mb-3"
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </a>
                <span className="text-slate-400 text-sm">Join our Discord</span>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="bg-slate-800 border-t border-slate-700" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold text-white">ChainShield</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2025 ChainShield. All rights reserved. Securing the future of DeFi.
            </div>
          </div>
        </div>
      </footer >
    </div >
  )
}
