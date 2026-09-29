/* Chantier · lisibilité : Gros texte (3 niveaux) et contraste élevé, communs à toutes les pages et aux cadres */
(function(){
  const K='chantierUI_v1';
  const get=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return {}}};
  const put=o=>{try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}};
  const css=`
  /* codes de page et badge de version : cachés (version visible dans le menu Aa) */
  #pgCode,#verBadge{display:none!important}
  /* Gros texte : taille minimale imposée partout, les grands textes restent grands */
  html.fz1 :is(button,input,textarea,select,a,label,p,li,td,th,small,em,span,b,strong,.chip,.lbl,.gl,h4){font-size:max(15px,1em)!important;line-height:1.25}
  html.fz2 :is(button,input,textarea,select,a,label,p,li,td,th,small,em,span,b,strong,.chip,.lbl,.gl,h4){font-size:max(18px,1em)!important;line-height:1.25}
  html.fz1 .tnav a,html.fz2 .tnav a{min-width:84px!important;height:auto!important;min-height:52px;padding:4px 8px!important}
  html.fz1 .tnav span,html.fz2 .tnav span{white-space:normal!important;text-align:center;max-width:110px}
  html.fz2 :is(button,.chip){min-height:48px}
  /* contraste élevé : texte noir, bordures épaisses, boutons inactifs lisibles */
  html.hc{--muted:#222!important;--line:#6b747c!important;--line-soft:#8a939b!important}
  html.hc body{color:#000}
  html.hc :is(.chip,.phase-btn,.btn,.c2-tool,.pz){border-width:2px!important}
  html.hc :is(button,.btn,.chip)[disabled]{opacity:1!important;color:#333!important;background:#e4e7ea!important;border:2px dashed #555!important}
  html.hc :is(.hint,small,.lbl,.gl,h4){color:#111!important}
  /* bouton Aa et menu */
  .uiAa{height:48px;min-width:56px;margin:0 4px;border:2px solid #141b22;border-radius:12px;background:#fff;color:#141b22;font:900 20px -apple-system,Segoe UI,sans-serif;cursor:pointer;flex:none}
  .uiPop{position:fixed;z-index:99999;background:#fff;border:2px solid #141b22;border-radius:16px;box-shadow:0 14px 40px rgba(0,0,0,.25);padding:14px;width:300px;font:600 15px -apple-system,Segoe UI,sans-serif;color:#141b22;display:flex;flex-direction:column;gap:10px}
  .uiPop b{font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#4d5661}
  .uiPop .r{display:flex;gap:6px}.uiPop .r button{flex:1;min-height:52px;border:2px solid #141b22;border-radius:12px;background:#fff;font-weight:900;color:#141b22;cursor:pointer}
  .uiPop .r button.on{background:#141b22;color:#fff}
  .uiPop .v{font-size:11px;color:#6b747c}
  .uiPop .sw{min-height:48px;border:2px dashed #141b22;border-radius:12px;background:#0b0f19;color:#ffe81f;font-weight:900;font-size:14px;cursor:pointer;letter-spacing:.02em}
  .uiPop .swm{background:#0b0f19;color:#ffe81f;border-radius:12px;padding:10px 12px;font-size:13.5px;line-height:1.35}.uiPop .swm b{color:#fff;text-transform:none;letter-spacing:0;font-size:inherit}.uiPop .swm small{display:block;margin-top:6px;color:#cfd3d8}
  .uiPop .swb{height:8px;border-radius:99px;background:#2a2f3a;margin-top:8px;overflow:hidden}.uiPop .swb i{display:block;height:100%;background:#ffe81f}
  html{--pacc:#173d2d;--pacc-d:#0f2a1f;--pacc-t:#173d2d1f}
  .tnav a.on{background:var(--pacc)!important;color:#fff!important}
  .tnav a{flex:0 1 auto;min-width:0!important}.tnav a span{overflow:hidden;text-overflow:ellipsis;max-width:92px}
  #pgPrm .top .btn{padding:0 10px!important;font-size:13px!important;min-height:40px}#pgPrm .top #bkInfo{display:none}
  /* couleurs d'état : jamais remplacées par le thème */
  html.themed :is(.ok,[class*="s-ok"],.done,.approved,#approve,.approve,.ts-appr,.dact .go,.lbj,.cfdt.ok,.cjr.ok,.dhead.ok){--green:#2f8a57;--green-dark:#1f6b43;--green-line:#a9d5b9;--green-soft:#eaf6ef;--deep:#173d2d}
  .srow .sname,.srow span{color:var(--pacc-d)!important}
  .ipad::before{content:'';position:absolute;inset:0;background:var(--pbg,none) center 70%/cover no-repeat;opacity:.22;pointer-events:none;z-index:0}
  .ipad.nobg::before{opacity:0}
  .pbar{box-shadow:inset 0 -5px 0 var(--pacc)}
  .pbar button{display:flex;align-items:center;justify-content:center;gap:8px}.pbar .pdot{width:12px;height:12px;border-radius:3px;background:var(--pa,#8f99a3);flex:none}
  .pbar button.on{background:var(--pa,var(--pacc))!important;border-color:var(--pa,var(--pacc))!important;color:#fff!important}.pbar button.on .pdot{background:#fff}
  .sgroup{border-color:var(--pacc)!important}
  .stag{border-color:color-mix(in srgb,var(--pacc) 55%,#cfd6db)!important;color:var(--pacc-d)!important}
  .stag.has,.stag.sel{border-width:2px!important}
  .fcol.cur .fh,.c5 .fh{background:var(--pacc-d)!important}
  .ftag{border-color:var(--pacc)!important}
  /* appareil photo et tri : couleurs par type, comme dans le journal */
  .c2 .chip[data-c2="sub"],.c2 .chip[data-c2="four"],.c2 .chip[data-c2="avis"],.c2-all .chip[data-c2="sub"],.c2-all .chip[data-c2="four"]{border-color:#1f5fae!important;color:#123b6e!important;background:#e6eefa!important}
  .c2 .chip[data-c2="act"],.c2-all .chip[data-c2="act"]{border-color:#0f7d80!important;color:#0b5557!important;background:#e2f4f4!important;border-left-width:6px!important}
  .c2 .chip[data-c2="zone"],.c2-all .chip[data-c2="zone"]{border-color:#5b4aa8!important;color:#3e3180!important;background:#eeebfa!important;border-radius:8px!important;font-family:ui-monospace,Menlo,Consolas,monospace}
  .c2 .chip[data-c2="kind"]{border-color:#b86200!important;color:#7a4100!important;background:#fff3e2!important}
  .c2 .chip[data-c2="sub"].on,.c2 .chip[data-c2="four"].on,.c2 .chip[data-c2="avis"].on,.c2-all .chip[data-c2="sub"].on,.c2-all .chip[data-c2="four"].on{background:#1f5fae!important;color:#fff!important}
  .c2 .chip[data-c2="act"].on,.c2-all .chip[data-c2="act"].on{background:#0f7d80!important;color:#fff!important}
  .c2 .chip[data-c2="zone"].on,.c2-all .chip[data-c2="zone"].on{background:#5b4aa8!important;color:#fff!important}
  .c2 .chip[data-c2="kind"].on{background:#b86200!important;color:#fff!important}
  .c2-proj button{border-color:var(--pacc)!important;color:var(--pacc-d)!important}.c2-proj button.on{background:var(--pacc)!important;color:#fff!important}
  .c2-choose{background:var(--pacc-d)!important}
  .uiMicW{display:flex;gap:6px;align-items:stretch;width:100%}.uiMicW>input,.uiMicW>textarea{flex:1;min-width:0}
  .uiMic{flex:none;min-width:48px;min-height:44px;border:0;border-radius:12px;background:#141b22;color:#fff;font-size:20px;cursor:pointer}.uiMic.on{background:#c3282b;animation:uimp 1s infinite}@keyframes uimp{50%{opacity:.6}}`;

  /* micro : dictée à côté de chaque champ de commentaire (reconnaissance vocale de Safari, sinon le micro du clavier) */
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  function addMics(){document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(inp=>{if(inp.dataset.mic||inp.closest('#pgCam')||!/ommentaire|escription|Détails|Note/i.test(inp.placeholder))return;inp.dataset.mic=1;
    const b=document.createElement('button');b.type='button';b.className='uiMic';b.textContent='🎤';b.title='Dicter';
    b.onclick=e=>{e.preventDefault();e.stopPropagation();if(!SR){inp.focus();hint(inp,'Toucher le micro du clavier pour dicter');return}
      const r=new SR();r.lang='fr-CA';r.interimResults=false;r.maxAlternatives=1;b.classList.add('on');
      r.onresult=ev=>{const t=ev.results[0][0].transcript;inp.value=(inp.value?inp.value.trim()+' ':'')+t;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}))};
      r.onend=r.onerror=()=>b.classList.remove('on');try{r.start()}catch(x){b.classList.remove('on');inp.focus()}};
    const pc=getComputedStyle(inp.parentNode),row=pc.display.includes('flex')&&!pc.flexDirection.startsWith('column');if(row){inp.insertAdjacentElement('afterend',b)}else{const w=document.createElement('span');w.className='uiMicW';inp.parentNode.insertBefore(w,inp);w.appendChild(inp);w.appendChild(b)}})}
  function hint(el,msg){const h=document.createElement('div');h.textContent=msg;h.style.cssText='position:fixed;z-index:99999;background:#141b22;color:#fff;font:800 14px -apple-system,sans-serif;padding:8px 12px;border-radius:10px';const r=el.getBoundingClientRect();h.style.left=r.left+'px';h.style.top=(r.top-44)+'px';document.body.appendChild(h);setTimeout(()=>h.remove(),2500)}

  /* thème du projet sur toutes les pages : couleur du projet (menu, titres, cadres) et dessin estompé ; les couleurs d'état ne changent pas */
  const TK='chantierTheme_v1';
  const dark=(hex,k)=>{const n=parseInt(hex.slice(1),16),f=c=>Math.round(c*(1-k));return '#'+[n>>16,(n>>8)&255,n&255].map(f).map(v=>v.toString(16).padStart(2,'0')).join('')};
  function theme(){let J={},T={acc:{},bg:{}};try{J=JSON.parse(localStorage.getItem('journalChantier_v1')||'{}');T=JSON.parse(localStorage.getItem(TK)||'{"acc":{},"bg":{}}')}catch(e){}
    const p=J.viewAll?null:J.project,acc=(p&&T.acc[p])||'#173d2d',h=document.documentElement;
    h.style.setProperty('--pacc',acc);h.style.setProperty('--pacc-d',dark(acc,.35));h.style.setProperty('--pacc-t',acc+'1f');
    /* toutes les pages : la couleur de marque (vert) devient la couleur du projet ; l'état « approuvé » reste vert (voir .ok plus bas) */
    const B={'--green':acc,'--green-dark':dark(acc,.25),'--deep':dark(acc,.5),'--today':dark(acc,.5),'--green-soft':acc+'14','--green-line':acc+'66'};
    Object.entries(B).forEach(([k,v])=>p?h.style.setProperty(k,v):h.style.removeProperty(k));h.classList.toggle('themed',!!p);
    const ip=document.getElementById('ipad');if(ip&&!document.querySelector('#pgCam:not([hidden]),#pgRev:not([hidden])')&&!ip.style.getPropertyValue('--pbg')&&p&&T.bg[p]){ip.style.setProperty('--pbg',`url("${T.bg[p]}")`);ip.classList.remove('nobg')}
    document.querySelectorAll('.pbar button[data-p]').forEach(b=>{const a=T.acc[b.dataset.p];if(!a)return;b.style.setProperty('--pa',a);if(!b.querySelector('.pdot'))b.insertAdjacentHTML('afterbegin','<i class="pdot"></i>')})}
  function apply(){const o=get(),h=document.documentElement;h.classList.toggle('fz1',o.fz===1);h.classList.toggle('fz2',o.fz===2);h.classList.toggle('hc',!!o.hc)}
  function pop(btn){let p=document.querySelector('.uiPop');if(p){p.remove();return}const o=get();p=document.createElement('div');p.className='uiPop';
    const ver=(document.getElementById('verBadge')||{}).textContent||'';
    p.innerHTML=`<b>Taille du texte</b><div class="r"><button data-fz="0" style="font-size:15px">Normal</button><button data-fz="1" style="font-size:18px">Grand</button><button data-fz="2" style="font-size:21px">Très grand</button></div>
      <b>Contraste</b><div class="r"><button data-hc="0">Normal</button><button data-hc="1">Élevé</button></div><button class="sw" data-sw="1">🔒 Débloquer le thème Star Wars</button><div class="swm" hidden></div><span class="v">${ver.replace(/</g,'&lt;')}</span>`;
    const mark=()=>{const q=get();p.querySelectorAll('[data-fz]').forEach(b=>b.classList.toggle('on',Number(b.dataset.fz)===(q.fz||0)));p.querySelectorAll('[data-hc]').forEach(b=>b.classList.toggle('on',Number(b.dataset.hc)===(q.hc?1:0)))};mark();
    p.onclick=e=>{const b=e.target.closest('button');if(!b)return;
      if(b.dataset.sw){let n=0;try{const J=JSON.parse(localStorage.getItem('journalChantier_v1')||'{}');n=Object.values(J.days||{}).filter(d=>d.status==='approved').length}catch(x){}
        const m=p.querySelector('.swm');m.hidden=false;m.innerHTML=`Le thème Star Wars sera débloqué une fois que <b>100 journaux de chantier</b> seront approuvés.<div class="swb"><i style="width:${Math.min(100,n)}%"></i></div><small>${n} / 100 approuvés${n>=100?' · Que la Force soit avec toi 😉':''}</small>`;
        b.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:300});return}
      const q=get();if(b.dataset.fz!=null)q.fz=Number(b.dataset.fz);if(b.dataset.hc!=null)q.hc=b.dataset.hc==='1';put(q);apply();mark();
      document.querySelectorAll('iframe').forEach(f=>{try{f.contentWindow.postMessage({chantierUI:1},'*')}catch(x){}})};
    document.body.appendChild(p);const r=btn.getBoundingClientRect();p.style.top=(r.bottom+8)+'px';p.style.left=Math.max(8,Math.min(innerWidth-310,r.right-300))+'px';
    setTimeout(()=>document.addEventListener('click',function off(ev){if(!p.contains(ev.target)&&ev.target!==btn){p.remove();document.removeEventListener('click',off)}}),0)}
  function addBtn(){if(window!==window.top&&!document.querySelector('.tnav'))return;document.querySelectorAll('.tnav').forEach(n=>{if(n.querySelector('.uiAa'))return;const b=document.createElement('button');b.type='button';b.className='uiAa';b.textContent='Aa';b.title='Taille du texte et contraste';b.onclick=e=>{e.preventDefault();e.stopPropagation();pop(b)};
      const fill=n.querySelector('.tfill');if(fill&&fill.nextSibling)n.insertBefore(b,fill.nextSibling);else n.appendChild(b)})}
  const st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);apply();
  addEventListener('storage',e=>{if(e.key===K)apply();if(e.key===TK||e.key==='journalChantier_v1')theme()});addEventListener('message',e=>{if(e.data&&e.data.chantierUI)apply()});
  const go=()=>{addBtn();addMics();theme();let tt=0;new MutationObserver(()=>{addBtn();addMics();clearTimeout(tt);tt=setTimeout(theme,60)}).observe(document.body,{childList:true,subtree:true})};
  if(document.body)go();else addEventListener('DOMContentLoaded',go);
})();
