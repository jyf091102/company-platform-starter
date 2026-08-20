import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost as chat } from '../functions/api/support/chat.js';
import { onRequestPost as translate } from '../functions/api/support/translate.js';
import { onRequestPost as register } from '../functions/api/auth/register.js';

function post(body){return new Request('https://example.test/api',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)})}

test('support fallback answers from generic knowledge',async()=>{const response=await chat({request:post({message:'如何查看项目？'}),env:{}});assert.equal(response.status,200);const data=await response.json();assert.equal(data.mode,'fallback');assert.match(data.reply,/业务协作门户/)});
test('translation returns original text when AI is not configured',async()=>{const response=await translate({request:post({message:'你好',language:'en'}),env:{}});const data=await response.json();assert.equal(data.translation,'你好');assert.match(data.note,/not configured/)});
test('registration fails closed when service is not configured',async()=>{const response=await register({request:post({email:'person@example.test',password:'long-password',displayName:'Demo'}),env:{}});assert.equal(response.status,503)});
