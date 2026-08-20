export function onRequestGet() {
  return Response.json({ status: 'ok', service: 'company-platform-starter' }, {
    headers: { 'cache-control': 'no-store' }
  });
}

