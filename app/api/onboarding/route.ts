import { OnboardingEmailTemplate } from '@/components/onboarding/email-template';
import { onboardingPayloadSchema } from '@/lib/onboarding';
import { Resend } from 'resend';

function getSubject(protocolProjectName: string) {
  const name = protocolProjectName.trim();
  return name ? `New Client Onboarding Intake: ${name}` : 'New Client Onboarding Intake';
}

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ message: 'Service temporarily unavailable' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const validationResult = onboardingPayloadSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          message: 'Invalid onboarding data',
          errors: validationResult.error.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const payload = validationResult.data.data;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'ChainShield Support <support@chainshield.ai>',
      to: ['amit@chainshield.ai'],
      subject: getSubject(payload.protocolProjectName),
      react: OnboardingEmailTemplate({ content: payload }),
    });

    if (error) {
      console.error('Resend onboarding API error:', error.message || 'Unknown error');
      return new Response(
        JSON.stringify({ message: 'Failed to send onboarding intake' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(
      'Onboarding API error:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
