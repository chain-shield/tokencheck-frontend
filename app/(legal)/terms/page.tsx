export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-6">
            By accessing or using TokenCheck.ai, you agree to be bound by these Terms of Service. If you disagree 
            with any part of the terms, you may not access the service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="text-muted-foreground mb-6">
            TokenCheck.ai provides AI-powered analysis of ERC20 tokens. Our service includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li>Token security analysis</li>
            <li>Smart contract vulnerability detection</li>
            <li>API access for developers</li>
            <li>Token metrics and analytics</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <p className="text-muted-foreground mb-6">
            You are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li>Maintaining the security of your account</li>
            <li>All activities that occur under your account</li>
            <li>Compliance with API usage limits</li>
            <li>Ensuring accurate information provision</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-6">
            TokenCheck.ai provides analysis and information but does not guarantee the accuracy or reliability 
            of results. We are not responsible for any financial decisions made based on our analysis.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these terms at any time. We will notify users of any material changes 
            via email or through our platform.
          </p>
        </section>
      </div>
    </div>
  );
}