import { EmailTemplate } from '@/components/audit-request/email-template';
import { FormData } from '@/components/audit-request/form';
import { Resend } from 'resend';
import { z } from 'zod';

// Input validation schema
const auditRequestSchema = z.object({
  data: z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().max(255).trim(),
    company: z.string().max(255).trim().optional(),
    primaryGoals: z.array(z.string()).min(1).max(10),
    buildSucceeds: z.string().min(1).max(50),
    framework: z.string().min(1).max(50),
    frameworkVersion: z.string().max(50).optional(),
    hasReadme: z.string().min(1).max(50),
    hasNatspec: z.string().min(1).max(50),
  })
});

export async function POST(req: Request) {
  try {
    // Validate environment
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ message: 'Service temporarily unavailable' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Parse and validate request body
    const body = await req.json();
    const validationResult = auditRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          message: 'Invalid request data',
          errors: validationResult.error.errors
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validatedData = validationResult.data;

    // Send email with validated data
    const { data, error } = await resend.emails.send({
      from: 'ChainShield Support <support@chainshield.ai>',
      to: ['amit@chainshield.ai'],
      subject: 'New Audit Request Form',
      react: EmailTemplate({ content: validatedData.data }),
    });

    // Handle Resend API errors
    if (error) {
      console.error('Resend API error:', error.message || 'Unknown error');
      return new Response(
        JSON.stringify({ message: 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return success (don't expose internal data)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Final catch block for any unexpected errors
    console.error('Audit request API error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
