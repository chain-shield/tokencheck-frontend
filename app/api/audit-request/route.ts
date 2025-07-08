import { EmailTemplate } from '@/components/audit-request/email-template';
import { FormData } from '@/components/audit-request/form';
import { Resend } from 'resend';


export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const body = await req.json();
  try {
    const { data, error } = await resend.emails.send({
      from: 'ChainShield Support <support@chainshield.ai>',
      to: ['amit@chainshield.ai'],
      subject: 'New Audit Request Form',
      react: EmailTemplate({ content: body.data }),
    });

    // 3️⃣ Handle Resend API errors
    if (error) {
      console.error('Resend API error:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to send email', error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4️⃣ Return success
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Server error:', err);
    return new Response(
      JSON.stringify({ message: 'Server error', error: err }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
