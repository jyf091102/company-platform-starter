function bearer(request) {
  const value = request.headers.get('authorization') || '';
  return /^Bearer\s+\S+$/i.test(value) ? value : null;
}

export async function onRequestGet({ request, env }) {
  const authorization = bearer(request);
  if (!authorization) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    return Response.json({ error: 'Service is not configured' }, { status: 503 });
  }
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, authorization }
  });
  if (!response.ok) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await response.json();
  return Response.json({ id: user.id, email: user.email ?? null }, { headers: { 'cache-control': 'no-store' } });
}

export { bearer };

