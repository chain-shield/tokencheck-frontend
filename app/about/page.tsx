export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About TokenCheck.ai</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            At TokenCheck.ai, we're committed to making the cryptocurrency space safer and more transparent for everyone. 
            Our advanced AI-powered analysis tools help investors make informed decisions by identifying potential risks 
            and vulnerabilities in ERC20 tokens.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
          <p className="text-muted-foreground mb-6">
            We leverage cutting-edge artificial intelligence and machine learning algorithms to analyze smart contracts, 
            token metrics, and market behavior. Our comprehensive analysis covers everything from code vulnerabilities 
            to liquidity patterns, providing you with a complete security assessment.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why Choose TokenCheck.ai?</h2>
          <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
            <li>Real-time analysis of ERC20 tokens</li>
            <li>Comprehensive security assessments</li>
            <li>Advanced AI-powered risk detection</li>
            <li>User-friendly interface and detailed reports</li>
            <li>Professional API access for developers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="text-muted-foreground mb-6">
            Our team consists of experienced blockchain developers, security researchers, and machine learning experts. 
            We combine our expertise in cryptocurrency, smart contract security, and artificial intelligence to provide 
            you with the most reliable token analysis platform.
          </p>
        </section>
      </div>
    </div>
  );
}