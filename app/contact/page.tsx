export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

      <div className="max-w-2xl">
        <section className="mb-12">
          <p className="text-muted-foreground mb-6">
            Have questions about TokenCheck.ai? We're here to help! Choose the most convenient way to reach us below.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">General Inquiries</h3>
            <p className="text-muted-foreground mb-4">
              For general questions about our services
            </p>
            <p className="font-medium">contact@tokencheck.ai</p>
          </div>

          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Technical Support</h3>
            <p className="text-muted-foreground mb-4">
              For API integration and technical issues
            </p>
            <p className="font-medium">support@tokencheck.ai</p>
          </div>
        </section>

        <section className="bg-card p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Enterprise Solutions</h2>
          <p className="text-muted-foreground mb-6">
            Looking for custom solutions or enterprise-level support? Our team is ready to help you implement 
            TokenCheck.ai's analysis capabilities into your platform.
          </p>
          <p className="text-muted-foreground">
            Contact our enterprise team at:
            <br />
            <span className="font-medium">enterprise@tokencheck.ai</span>
          </p>
        </section>
      </div>
    </div>
  );
}