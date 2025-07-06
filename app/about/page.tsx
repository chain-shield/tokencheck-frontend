export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About ChainShield.ai</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            At ChainShield.ai, we're on a mission to secure the future of crypto by making comprehensive smart contract
            audits accessible to every protocol. With over 760 breaches in 2024 resulting in $2.36 billion in losses,
            we believe that robust security shouldn't be a luxury reserved for the largest projects. Our AI-powered
            auditing platform delivers enterprise-grade security assessments in minutes, not weeks—for pennies on the dollar.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
          <p className="text-muted-foreground mb-6">
            We combine cutting-edge artificial intelligence with expert human validation to deliver the most thorough
            smart contract audits available. Our expertly fine-tuned AI agents scan your Solidity code for known
            vulnerabilities, emerging threats, and complex attack vectors that traditional tools miss. Every AI finding
            is then validated by our team of security experts who provide detailed remediation guidance and business
            logic analysis.
          </p>
          <p className="text-muted-foreground mb-6">
            Our platform achieves a 99.9% accuracy rate while delivering results 80% faster than traditional manual
            audits. We've already identified over 1,000s critical bugs across countless protocols, helping secure
            millions of dollars in smart contract value.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why Choose ChainShield.ai?</h2>
          <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
            <li>AI-powered vulnerability detection with expert human validation</li>
            <li>Comprehensive smart contract security audits in 24-48 hours</li>
            <li>80% cost savings compared to traditional audit firms</li>
            <li>Detailed security reports with actionable remediation guidance</li>
            <li>Continuous monitoring and CI/CD integration (coming soon)</li>
            <li>Transparent pricing with no hidden fees</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Process</h2>
          <p className="text-muted-foreground mb-6">
            Our streamlined four-step process ensures thorough security analysis without the traditional delays:
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-muted-foreground">
            <li><strong>Submit Codebase:</strong> Upload your Solidity smart contracts through our secure platform</li>
            <li><strong>AI Analysis:</strong> Our AI engine performs comprehensive vulnerability scanning and pattern recognition</li>
            <li><strong>Expert Review:</strong> Security experts validate findings and provide detailed remediation recommendations</li>
            <li><strong>Detailed Report:</strong> Receive a comprehensive audit report with actionable security fixes</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="text-muted-foreground mb-6">
            Our team brings together the best of both worlds: cutting-edge AI technology and deep human expertise.
            We're composed of experienced blockchain security researchers, smart contract auditors, and machine learning
            engineers who have collectively identified thousands of vulnerabilities across the DeFi ecosystem. Our
            security experts have worked with leading protocols and audit firms, bringing institutional-grade security
            practices to projects of all sizes.
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
