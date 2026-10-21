/** Public base URL of the store, from APP_URL or the incoming request. */
export function appUrl(req?: Request): string {
  const env = process.env.APP_URL?.replace(/\/$/, '');
  if (env) return env;
  if (req) {
    const h = req.headers;
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'http';
    if (host) return `${proto}://${host}`;
  }
  return 'http://localhost:3000';
}
