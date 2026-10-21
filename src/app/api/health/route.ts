import { connectDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const m = await connectDb();
    await m.connection.db?.admin().ping();
    return Response.json({ ok: true, db: 'up' });
  } catch {
    return Response.json({ ok: false, db: 'down' }, { status: 503 });
  }
}
