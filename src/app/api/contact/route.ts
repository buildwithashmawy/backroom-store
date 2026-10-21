import { connectDb } from '@/lib/db';
import { ContactMessage } from '@/models/ContactMessage';
import { contactSchema } from '@/lib/schemas';
import { sendContactEmail } from '@/lib/email';

export async function POST(req: Request) {
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join('.')] ??= issue.message;
    return Response.json({ error: 'Please check the highlighted fields.', fieldErrors }, { status: 400 });
  }
  const { website: _honeypot, ...msg } = parsed.data;
  await connectDb();
  await ContactMessage.create(msg);
  await sendContactEmail(msg).catch((err) => console.error('Contact email failed', err));
  return Response.json({ ok: true });
}
