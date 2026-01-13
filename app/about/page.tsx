export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About ChainShield</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            ChainShield exists to make professional-grade smart contract security accessible to every protocol. We
            combine rigorous engineering, repeatable automation, and expert validation to help teams ship with
            confidence—without long lead times or unclear outcomes.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
          <p className="text-muted-foreground mb-6">
            We use a repeatable, automation-first pipeline to surface issues quickly, then apply expert review to
            validate findings, assess impact, and map fixes to an agreed-upon security rubric. This approach helps
            reduce noise, prioritize what matters, and keep the audit focused on real risk.
          </p>
          <p className="text-muted-foreground mb-6">
            Beyond vulnerability discovery, we emphasize business-logic review, attack-path thinking, and practical
            remediation guidance so engineering teams can resolve issues efficiently.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why Choose ChainShield.ai?</h2>
          <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
            <li>Automation-driven discovery paired with expert validation</li>
            <li>Clear severity grading and prioritization based on an agreed security rubric</li>
            <li>Actionable remediation guidance focused on practical fixes</li>
            <li>Transparent, performance-based pricing with a hard cap</li>
            <li>Included post-fix re-audit to confirm the issues are resolved</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">How ChainShield Works</h2>
          <p className="text-muted-foreground mb-6">
            Our streamlined process delivers comprehensive security audits with unprecedented speed and accuracy.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-muted-foreground">
            <li><strong>Submit Codebase:</strong> Submit your code, docs, scope and schedule 30 min onboarding call.</li>
            <li><strong>Indepth Analysis:</strong> Our security experts leverage our propritary automation engine to perform a comprehensive analysis, identifying vulnerabilities and security risks.</li>
            <li><strong>Expert Review:</strong> Security experts triage, validate findings, create PoCs, and provide detailed mitigation recommendations.</li>
            <li><strong>Detailed Report:</strong> Receive a comprehensive audit report with actionable security fixes. Optional post fix audit included at no extra cost.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="text-muted-foreground mb-6">
            Our team includes experienced blockchain security researchers, smart contract auditors, and engineers.
            We focus on practical security work: identifying real attack paths, validating exploitability, and helping
            teams remediate issues quickly and correctly.
          </p>
          <p className="text-muted-foreground mb-6">
            We believe that every protocol deserves access to world-class security, regardless of budget or timeline
            constraints. That's why we've built ChainShield to democratize smart contract security and help protect
            the future of decentralized finance.
          </p>
        </section>
      </div>
    </div>
  );
}
