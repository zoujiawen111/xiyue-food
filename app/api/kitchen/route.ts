import { env } from 'cloudflare:workers';
export const dynamic = 'force-dynamic';
const json = (value: unknown, status=200) => Response.json(value, {status,headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
async function hash(s:string) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join(''); }
async function family(req:Request) { const t=req.headers.get('Authorization')?.replace(/^Bearer /,'')||''; if(!/^[a-f0-9]{64}$/.test(t)) return null; return env.DB!.prepare('SELECT id FROM families WHERE token_hash=?').bind(await hash(t)).first<{id:string}>(); }
export async function GET(req:Request) {
 const f=await family(req); if(!f)return json({error:'请使用家庭邀请链接进入'},401);
 const url=new URL(req.url); const image=url.searchParams.get('image');
 if(image){ if(!image.startsWith(f.id+'/'))return json({error:'无权访问'},403); const obj=await env.BUCKET!.get(image); if(!obj)return json({error:'图片不存在'},404); return new Response(obj.body,{headers:{'Content-Type':obj.httpMetadata?.contentType||'image/jpeg','Cache-Control':'private, max-age=3600'}}); }
 const [r,m]=await Promise.all([env.DB!.prepare('SELECT data FROM recipes WHERE family=? ORDER BY updated DESC').bind(f.id).all<{data:string}>(),env.DB!.prepare('SELECT id,day,slot,recipe FROM meals WHERE family=?').bind(f.id).all()]);
 return json({recipes:r.results.map(x=>JSON.parse(x.data)),meals:m.results});
}
export async function POST(req:Request) {
 try {
 if(req.headers.get('Origin') && req.headers.get('Origin')!==new URL(req.url).origin)return json({error:'请求来源无效'},403);
 const len=Number(req.headers.get('content-length')||0);if(len>8_000_000)return json({error:'图片过大'},413);
 const url=new URL(req.url);
 if(url.searchParams.get('action')==='create') { const id=crypto.randomUUID(); const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join(''); await env.DB!.prepare('INSERT INTO families(id,token_hash,created) VALUES(?,?,?)').bind(id,await hash(token),new Date().toISOString()).run();return json({token}); }
 const f=await family(req);if(!f)return json({error:'家庭邀请链接无效'},401);
 if(url.searchParams.get('action')==='upload') {const file=await req.blob();if(file.size>6_000_000||!['image/jpeg','image/png','image/webp'].includes(file.type))return json({error:'请上传 6MB 以内的 JPG、PNG 或 WebP 图片'},400);const key=f.id+'/'+crypto.randomUUID();await env.BUCKET!.put(key,file,{httpMetadata:{contentType:file.type}});return json({key});}
 const b=await req.json() as any;
 if(b.action==='save') {const r=b.recipe;if(!r||typeof r.name!=='string'||!r.name.trim()||r.name.length>30||typeof r.ingredients!=='string'||r.ingredients.length>1200||typeof r.seasonings!=='string'||r.seasonings.length>600||typeof r.steps!=='string'||r.steps.length>3000|| (r.image && !r.image.startsWith(f.id+'/')))return json({error:'请检查菜谱内容和字数'},400);const id=typeof r.id==='string'?r.id:crypto.randomUUID(); const old=await env.DB!.prepare('SELECT family FROM recipes WHERE id=?').bind(id).first<{family:string}>();if(old&&old.family!==f.id)return json({error:'无权编辑'},403); const data={id,name:r.name.trim(),ingredients:r.ingredients,seasonings:r.seasonings,steps:r.steps,image:r.image||''};await env.DB!.prepare('INSERT INTO recipes(id,family,data,updated) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated=excluded.updated WHERE family=excluded.family').bind(id,f.id,JSON.stringify(data),new Date().toISOString()).run();return json({ok:true});}
 if(b.action==='delete'){await env.DB!.batch([env.DB!.prepare('DELETE FROM recipes WHERE id=? AND family=?').bind(b.id,f.id),env.DB!.prepare('DELETE FROM meals WHERE recipe=? AND family=?').bind(b.id,f.id)]);return json({ok:true});}
 if(b.action==='meal'){if(!/^\d{4}-\d{2}-\d{2}$/.test(b.day)||!['早餐','午餐','晚餐'].includes(b.slot))return json({error:'日期或餐次无效'},400);if(b.recipe&&!await env.DB!.prepare('SELECT id FROM recipes WHERE id=? AND family=?').bind(b.recipe,f.id).first())return json({error:'菜谱不存在'},404);const id=f.id+':'+b.day+':'+b.slot+':'+b.recipe; if(b.remove)await env.DB!.prepare('DELETE FROM meals WHERE id=? AND family=?').bind(id,f.id).run();else await env.DB!.prepare('INSERT OR IGNORE INTO meals(id,family,day,slot,recipe) VALUES(?,?,?,?,?)').bind(id,f.id,b.day,b.slot,b.recipe).run();return json({ok:true});}
 return json({error:'操作无效'},400);
 } catch {return json({error:'暂时无法保存，请稍后重试'},500);}
}
