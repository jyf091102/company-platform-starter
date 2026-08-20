import test from 'node:test';
import assert from 'node:assert/strict';
import { bearer, onRequestGet } from '../functions/api/profile.js';

test('bearer accepts a bearer authorization header', () => {
  assert.equal(bearer(new Request('https://example.test', { headers: { authorization: 'Bearer demo-token' } })), 'Bearer demo-token');
});

test('profile rejects anonymous requests', async () => {
  const response = await onRequestGet({ request: new Request('https://example.test'), env: {} });
  assert.equal(response.status, 401);
});

