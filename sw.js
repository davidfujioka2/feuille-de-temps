const CACHE='chantier-2026-10-06-28';
const FILES=['./','./index.html','./ui.js','./pgcode.js','./feuille.html','./instructions.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./echeancier.html','./materiaux.html','./aide.html','./p_feuille.html','./p_echeancier.html','./p_materiaux.html','./p_aide.html','./instructions.pdf','./lib/jspdf.umd.min.js','./lib/html2canvas.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* Code (pages, scripts) : réseau d'abord (version à jour dès l'ouverture), copie locale si hors ligne.
   Images et bibliothèques : copie locale d'abord, mise à jour en arrière-plan. */
const isCode=u=>u.pathname.endsWith('/')||/\.(html|js|webmanifest)$/.test(u.pathname)&&!u.pathname.includes('/lib/');
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
  const put=res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res};
  if(r.mode==='navigate'||isCode(u)){
    const fromCache=()=>caches.match(r,{ignoreSearch:true}).then(hit=>hit||(r.mode==='navigate'?caches.match('./index.html'):undefined));
    const net=fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(put);
    const timeout=new Promise(res=>setTimeout(res,4000)).then(fromCache);
    e.respondWith(Promise.race([net.catch(fromCache),timeout.then(h=>h||net)]).then(x=>x||net.catch(fromCache)));
    return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(put).catch(()=>hit);
    return hit||net;
  }));
});
