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
  .uiMicW{display:flex;gap:6px;align-items:stretch;width:100%}.uiMicW>input,.uiMicW>textarea{flex:1;min-width:0}
  .uiMic{flex:none;min-width:48px;min-height:44px;border:0;border-radius:12px;background:#141b22;color:#fff;font-size:20px;cursor:pointer}.uiMic.on{background:#c3282b;animation:uimp 1s infinite}@keyframes uimp{50%{opacity:.6}}`;

  /* micro : dictée à côté de chaque champ de commentaire (reconnaissance vocale de Safari, sinon le micro du clavier) */
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  function addMics(){document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(inp=>{if(inp.dataset.mic||!/ommentaire|escription|Détails|Note/i.test(inp.placeholder))return;inp.dataset.mic=1;
    const b=document.createElement('button');b.type='button';b.className='uiMic';b.textContent='🎤';b.title='Dicter';
    b.onclick=e=>{e.preventDefault();e.stopPropagation();if(!SR){inp.focus();hint(inp,'Toucher le micro du clavier pour dicter');return}
      const r=new SR();r.lang='fr-CA';r.interimResults=false;r.maxAlternatives=1;b.classList.add('on');
      r.onresult=ev=>{const t=ev.results[0][0].transcript;inp.value=(inp.value?inp.value.trim()+' ':'')+t;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}))};
      r.onend=r.onerror=()=>b.classList.remove('on');try{r.start()}catch(x){b.classList.remove('on');inp.focus()}};
    inp.insertAdjacentElement('afterend',b);if(getComputedStyle(inp.parentNode).display!=='flex'){const w=document.createElement('span');w.className='uiMicW';inp.parentNode.insertBefore(w,inp);w.appendChild(inp);w.appendChild(b)}})}
  function hint(el,msg){const h=document.createElement('div');h.textContent=msg;h.style.cssText='position:fixed;z-index:99999;background:#141b22;color:#fff;font:800 14px -apple-system,sans-serif;padding:8px 12px;border-radius:10px';const r=el.getBoundingClientRect();h.style.left=r.left+'px';h.style.top=(r.top-44)+'px';document.body.appendChild(h);setTimeout(()=>h.remove(),2500)}
  function apply(){const o=get(),h=document.documentElement;h.classList.toggle('fz1',o.fz===1);h.classList.toggle('fz2',o.fz===2);h.classList.toggle('hc',!!o.hc)}
  function pop(btn){let p=document.querySelector('.uiPop');if(p){p.remove();return}const o=get();p=document.createElement('div');p.className='uiPop';
    const ver=(document.getElementById('verBadge')||{}).textContent||'';
    p.innerHTML=`<b>Taille du texte</b><div class="r"><button data-fz="0" style="font-size:15px">Normal</button><button data-fz="1" style="font-size:18px">Grand</button><button data-fz="2" style="font-size:21px">Très grand</button></div>
      <b>Contraste</b><div class="r"><button data-hc="0">Normal</button><button data-hc="1">Élevé</button></div><span class="v">${ver.replace(/</g,'&lt;')}</span>`;
    const mark=()=>{const q=get();p.querySelectorAll('[data-fz]').forEach(b=>b.classList.toggle('on',Number(b.dataset.fz)===(q.fz||0)));p.querySelectorAll('[data-hc]').forEach(b=>b.classList.toggle('on',Number(b.dataset.hc)===(q.hc?1:0)))};mark();
    p.onclick=e=>{const b=e.target.closest('button');if(!b)return;const q=get();if(b.dataset.fz!=null)q.fz=Number(b.dataset.fz);if(b.dataset.hc!=null)q.hc=b.dataset.hc==='1';put(q);apply();mark();
      document.querySelectorAll('iframe').forEach(f=>{try{f.contentWindow.postMessage({chantierUI:1},'*')}catch(x){}})};
    document.body.appendChild(p);const r=btn.getBoundingClientRect();p.style.top=(r.bottom+8)+'px';p.style.left=Math.max(8,Math.min(innerWidth-310,r.right-300))+'px';
    setTimeout(()=>document.addEventListener('click',function off(ev){if(!p.contains(ev.target)&&ev.target!==btn){p.remove();document.removeEventListener('click',off)}}),0)}
  function addBtn(){if(window!==window.top&&!document.querySelector('.tnav'))return;document.querySelectorAll('.tnav').forEach(n=>{if(n.querySelector('.uiAa'))return;const b=document.createElement('button');b.type='button';b.className='uiAa';b.textContent='Aa';b.title='Taille du texte et contraste';b.onclick=e=>{e.preventDefault();e.stopPropagation();pop(b)};
      const fill=n.querySelector('.tfill');if(fill&&fill.nextSibling)n.insertBefore(b,fill.nextSibling);else n.appendChild(b)})}
  const st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);apply();
  addEventListener('storage',e=>{if(e.key===K)apply()});addEventListener('message',e=>{if(e.data&&e.data.chantierUI)apply()});
  const go=()=>{addBtn();addMics();new MutationObserver(()=>{addBtn();addMics()}).observe(document.body,{childList:true,subtree:true})};
  if(document.body)go();else addEventListener('DOMContentLoaded',go);
})();
