export default function SubscriptionPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">ChainShield ChainShield.ai Subscription Policy</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Thank you for choosing ChainShield's ChainShield.ai. This policy explains our subscription plans, billing practices, API usage limits, and how to manage or cancel your subscription.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Subscription Plans</h2>
          <p className="text-muted-foreground mb-6">
            We offer four subscription tiers to meet different needs. Each tier has a daily API call limit:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li><strong>Free Tier</strong> – <em>10 API calls per day</em>. This plan is free and ideal for testing or light usage.</li>
            <li><strong>Basic</strong> ($97 per month) – <em>300 API calls per day</em>. Suited for individual developers or small projects with moderate API needs.</li>
            <li><strong>Pro</strong> ($297 per month) – <em>3000 API calls per day</em>. Designed for high-volume usage and production applications.</li>
            <li><strong>Enterprise</strong> – <em>Unlimited API calls</em> (custom pricing). Tailored solutions for enterprise clients, including unlimited API usage and additional enterprise-grade features (see <strong>Enterprise Plan Features</strong> below).</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Billing and Payment Terms</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li><strong>Monthly Billing</strong>: All paid plans (Basic, Pro, Enterprise) are billed monthly in advance. Your billing cycle begins on the sign-up date and recurs on the same day each month.</li>
            <li><strong>Annual Billing Discount</strong>: You may choose annual billing for any plan. Annual plans are paid upfront for 12 months and include a <strong>15% discount</strong> compared to monthly pricing.</li>
            <li><strong>Payment Methods</strong>: We accept major credit cards (Visa, MasterCard, American Express, etc.) and popular cryptocurrencies for payments.</li>
            <li><strong>Enterprise Billing</strong>: Enterprise customers may arrange custom billing terms (for example, invoicing or net payment terms) in coordination with our team.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Changes, Cancellations, and Refunds</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li><strong>Auto-Renewal</strong>: Subscriptions automatically renew at the end of each paid term (monthly or annual) unless canceled before the renewal date. This ensures uninterrupted service.</li>
            <li><strong>Upgrades/Downgrades</strong>: You can upgrade or downgrade your plan at any time. Changes will take effect at the <strong>start of the next billing cycle</strong>. (For example, if you upgrade mid-month, the new plan limits and pricing begin in the following month.)</li>
            <li><strong>Cancellation</strong>: You may cancel your subscription at any time via your account settings. Cancellation stops the subscription from renewing. You will retain access to your plan's features until the end of your paid period, but <strong>no refunds</strong> or credits are provided for any unused portion of that billing period.</li>
            <li><strong>Refund Policy</strong>: In general, subscriptions are non-refundable. However, if you cancel within the first <strong>5 days</strong> of a new subscription or renewal, you may request a full refund. Such refunds are granted at our discretion and typically require a valid reason (for example, unforeseen technical issues or the service not meeting your needs).</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">API Usage and Limits</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li><strong>Daily Limits</strong>: Your API call usage resets to <strong>zero at midnight UTC</strong> every day, restoring your full daily allowance for the next 24-hour period.</li>
            <li><strong>No Overage Charges</strong>: If you reach your plan's daily API call limit, further requests will be <strong>blocked</strong> until the limit resets. We do <strong>not</strong> charge any overage fees at this time.</li>
            <li><strong>Usage Tracking</strong>: API usage is tracked per API key. All requests made with your API key(s) count toward your daily limit. Please keep your keys secure, as you are responsible for all usage on your account.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Enterprise Plan Features</h2>
          <p className="text-muted-foreground mb-6">
            Enterprise subscribers receive all the benefits of the Pro tier, plus additional features and services:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li><strong>Unlimited Usage</strong>: The Enterprise plan includes unlimited API calls (or a high custom limit), subject to fair use as defined in your enterprise agreement.</li>
            <li><strong>Service Level Agreement (SLA)</strong>: We provide a custom SLA for Enterprise clients, which guarantees a specified uptime and performance level for the API.</li>
            <li><strong>Dedicated Support</strong>: Enterprise customers have priority support, including a dedicated account manager or support contact for prompt assistance and guidance.</li>
            <li><strong>Tailored Terms</strong>: We accommodate special requirements for Enterprise clients. This can include custom usage terms, enhanced security/compliance arrangements, and flexible billing or invoicing options to suit your organization's needs.</li>
          </ul>
          <p className="text-muted-foreground mb-6">
            <em>(For details on Enterprise pricing and to discuss a custom plan, please contact our sales team.)</em>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Renewals and Pricing Changes</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li><strong>Automatic Renewal</strong>: As noted, your plan will renew automatically at the end of each billing cycle (monthly or yearly) unless you cancel beforehand. We will send renewal reminders for annual plans.</li>
            <li><strong>Pricing and Feature Changes</strong>: If we adjust the pricing or features of a plan, we will provide advance notice to you (e.g., via email or dashboard notification). Any such changes will apply from your next billing cycle after the notice. If you do not agree to a change, you can cancel your subscription before the new pricing or features take effect. Continuing to use the service after a change goes into effect constitutes acceptance of the new terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Support and Questions</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Subscription Policy or need assistance with your account, please contact our support team at <strong>support@chainshield.com</strong>. We are here to help you make the most of ChainShield.ai and address any concerns.
          </p>
        </section>
      </div>
    </div>
  );
}
