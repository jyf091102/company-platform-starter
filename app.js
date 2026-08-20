const API='/api';
export const session={get(){try{return JSON.parse(sessionStorage.getItem('starter_session')||'null')}catch{return null}},set(v){sessionStorage.setItem('starter_session',JSON.stringify(v))},clear(){sessionStorage.removeItem('starter_session')},token(){return this.get()?.access_token||''}};
export async function api(path,options={}){const headers={accept:'application/json',...(options.body?{'content-type':'application/json'}:{}),...options.headers};if(session.token())headers.authorization=`Bearer ${session.token()}`;const response=await fetch(API+path,{...options,headers});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||`Request failed (${response.status})`);return data}
export function setStatus(el,message,error=false){el.textContent=message;el.classList.toggle('error',error)}
export function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]))}
