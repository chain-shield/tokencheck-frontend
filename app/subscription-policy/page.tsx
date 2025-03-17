export default function SubscriptionPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Subscription Policy</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-semibold mb-4">1. Subscription Plans</h2>
          <p className="text-muted-foreground mb-6">
            TokenCheck.ai offers the following subscription tiers:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li>Free Tier: Up to 10 API calls per day</li>
            <li>Basic Plan ($97/month): Up to 300 API calls per day</li>
            <li>Pro Plan ($297/month): Up to 3000 API calls per day</li>
            <li>Enterprise Plan: Custom solutions and unlimited API access</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Billing and Payments</h2>
          <p className="text-muted-foreground mb-6">
            All paid subscriptions are billed monthly in advance. We accept major credit cards and cryptocurrency 
            payments. Enterprise plans may have custom billing arrangements.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Subscription Changes and Cancellations</h2>
          <p className="text-muted-foreground mb-6">
            You may upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next 
            billing cycle. No refunds are provided for unused portions of the current billing period.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. API Usage and Limits</h2>
          <p className="text-muted-foreground mb-6">
            API calls are counted on a daily basis, resetting at midnight UTC. Exceeding your plan's daily limit 
            will result in API requests being rejected until the next reset period.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Enterprise Solutions</h2>
          <p className="text-muted-foreground">
            Enterprise plans include custom API limits, dedicated support, and additional features. Contact our 
            enterprise team at enterprise@tokencheck.ai to discuss your requirements.
          </p>
        </section>
      </div>
    </div>
  );
}