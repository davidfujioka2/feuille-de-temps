/* Codes de page : étiquette en bas à droite de chaque écran pour identifier les pages.
   Chaque page calcule son code ; une page dans un cadre (iframe) l'envoie à la page parente,
   qui affiche « code parent › code du cadre ». Pour retirer : enlever <script src="./pgcode.js"> */
(function(){
  const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const vis=el=>!!el&&!el.hidden&&el.offsetWidth>0&&el.offsetHeight>0;
  const txt=s=>{const e=document.querySelector(s);return e?e.textContent.replace(/\s+/g,' ').trim():''};

  function feuille(){
    if(typeof state==='undefined')return 'F · Feuille de temps';
    const pg=state.currentPage,ds=state.selectedDate;let c;
    if(pg==='calendar')c='F1 · Calendrier des feuilles de temps';
    else if(pg==='manage'){const M={proj:'Projets',act:'Activités',emp:'Employés',cal:'Calendrier'};c='F2 · Paramètres · '+(M[state.mgMode||'proj']||state.mgMode)}
    else if(pg==='projects'){const st=typeof step==='function'?step():1;
      if(st===1)c='F3 · Étape 1 · Projets';
      else if(st===3)c='F4 · Étape 2 · Travailleurs';
      else if(state.signed&&state.signed[ds])c='F7 · Journée signée';
      else if(state.approved&&state.approved[ds])c='F6b · Journée approuvée · signature';
      else if(typeof inReview==='function'&&inReview())c='F6 · Vérification finale';
      else c='F5 · Étape 3 · Travaux'}
    else if(pg==='timesheet')c='F8 · Feuille de temps de la semaine';
    else if(pg==='hours')c='F9 · Heures';
    else c='F? · '+pg;
    const sh=document.getElementById('sheet');if(vis(sh)){const t=document.getElementById('sheetTitle'),n=t&&t.firstChild;c+=' › Fenêtre : '+((n&&n.textContent.trim())||txt('#sheetTitle')||'sans titre')}
    const pop=[...document.querySelectorAll('.pop')].find(vis);
    if(pop){const t=pop.querySelector('.pop-title strong,.pop-head strong,.pop-lbl');c+=' › Bulle : '+(t?t.textContent.trim():'sans titre')}
    return c}

  function own(){try{
    if(window.PGCODE)return window.PGCODE()||'';
    if(file==='p_feuille.html')return feuille();
    if(file==='p_materiaux.html'){const cr=txt('#crumb');return 'M1 · Commande matériaux'+(cr?' · '+cr:'')}
    if(file==='p_echeancier.html')return vis(document.getElementById('pcal'))?'P1 · Planification · Calendrier':'P2 · Planification · Échéancier';
    if(file==='p_aide.html')return 'H1 · Aide';
    return ''}catch(e){return '?? · '+file}}

  /* code reçu du cadre visible */
  let child='',childFr=null;
  addEventListener('message',e=>{if(!e.data||typeof e.data.pgc!=='string')return;
    const fr=[...document.querySelectorAll('iframe')].find(f=>f.contentWindow===e.source);
    if(fr){child=e.data.pgc;childFr=fr}});
  function full(){const c=childFr&&childFr.isConnected&&vis(childFr)&&childFr.offsetWidth>50?child:'';return [own(),c].filter(Boolean).join(' › ')}

  const inFrame=window.parent!==window;let badge=null,last=null;
  function tick(){const c=full();
    if(inFrame){try{parent.postMessage({pgc:c},'*')}catch(e){}return}
    if(c===last)return;last=c;
    if(!badge){badge=document.createElement('div');badge.id='pgName';
      badge.style.cssText='position:fixed;right:10px;bottom:calc(8px + env(safe-area-inset-bottom,0px));z-index:2147483647;pointer-events:none;background:#141b22;color:#fff;border-radius:999px;padding:5px 12px;font:800 13px -apple-system,Segoe UI,sans-serif;max-width:70vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 2px 8px rgba(0,0,0,.25);opacity:.92';
      document.body.appendChild(badge)}
    badge.textContent=c;badge.style.display=c?'block':'none'}
  function start(){tick();setInterval(tick,400)}
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',start);else start();
})();

/* Mise à jour automatique : si une nouvelle version est publiée (sw.js change), vider l'ancienne copie et recharger une fois. */
(function(){
  if(window.parent!==window||!navigator.onLine)return;
  fetch('./sw.js?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.text():'').then(t=>{
    const m=t.match(/CACHE='([^']+)'/);if(!m)return;const v=m[1];let old='';try{old=localStorage.getItem('appVersion')||''}catch(e){}
    try{localStorage.setItem('appVersion',v)}catch(e){}
    if(!old||old===v)return;
    const done=()=>location.reload();
    Promise.all([
      navigator.serviceWorker?navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.update().catch(()=>{})))):0,
      window.caches?caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==v).map(k=>caches.delete(k)))):0
    ]).then(done,done)}).catch(()=>{})
})();
