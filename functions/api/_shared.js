export function json(data,status=200){return Response.json(data,{status,headers:{'cache-control':'no-store','x-content-type-options':'nosniff'}})}
export function config(env){if(!env.SUPABASE_URL||!env.SUPABASE_PUBLISHABLE_KEY)return null;return{url:env.SUPABASE_URL.replace(/\/$/,''),key:env.SUPABASE_PUBLISHABLE_KEY}}
export function bearer(request){const value=request.headers.get('authorization')||'';return /^Bearer\s+\S+$/i.test(value)?value:null}
export async function body(request,max=12000){const length=Number(request.headers.get('content-length')||0);if(length>max)throw new Error('Request is too large');return request.json()}
export async function user(request,env){const c=config(env),authorization=bearer(request);if(!c||!authorization)return null;const response=await fetch(`${c.url}/auth/v1/user`,{headers:{apikey:c.key,authorization}});return response.ok?response.json():null}
export function clean(value,max=200){return String(value??'').trim().slice(0,max)}
export function supabaseHeaders(c,authorization){return{apikey:c.key,authorization,'content-type':'application/json','prefer':'return=representation'}}
