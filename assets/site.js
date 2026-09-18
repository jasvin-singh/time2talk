const header=document.querySelector('.site-header');
const toggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('.nav-links');
const dropdownButtons=document.querySelectorAll('.nav-link-button');
const year=document.querySelector('[data-year]');
if(year) year.textContent=new Date().getFullYear();
const setHeader=()=>header?.classList.toggle('scrolled',window.scrollY>12); setHeader(); window.addEventListener('scroll',setHeader,{passive:true});
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕':'☰';});}
dropdownButtons.forEach(btn=>btn.addEventListener('click',()=>{if(matchMedia('(max-width: 960px)').matches){const parent=btn.closest('.dropdown');const open=parent.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));}}));
document.addEventListener('click',e=>{if(nav?.classList.contains('open')&&!e.target.closest('.site-header')){nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');if(toggle)toggle.textContent='☰';}});
const dlg=document.querySelector('#lightbox');const dlgImg=dlg?.querySelector('img');
document.querySelectorAll('[data-lightbox]').forEach(b=>b.addEventListener('click',()=>{if(dlg&&dlgImg){dlgImg.src=b.dataset.lightbox;dlgImg.alt=b.querySelector('img')?.alt||'Studio photo';dlg.showModal();}}));
dlg?.querySelector('.lightbox-close')?.addEventListener('click',()=>dlg.close());dlg?.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});

(()=>{
  const calc=document.querySelector('[data-booking-calculator]'); if(!calc) return;
  const R={studio:2500,post:2000,host:1500,advance:1000};
  const q=s=>calc.querySelector(s); const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
  const studio=q('#studio-hours'), post=q('#add-post'), postHours=q('#post-hours'), host=q('#add-host');
  const postWrap=q('[data-post-hours-wrap]'), studioLine=q('[data-studio-line]'), postLine=q('[data-post-line]'), hostLine=q('[data-host-line]');
  const totalEl=q('[data-total]'), advanceEl=q('[data-advance]'), balanceEl=q('[data-balance]'), summary=q('[data-summary]');
  const waLink=q('[data-whatsapp-quote]'), copyBtn=q('[data-copy-summary]'), resetBtn=q('[data-reset-booking]');
  const safe=(v,min,max)=>Math.min(max,Math.max(min,Number.parseFloat(v)||min));
  function update(){
    const h=safe(studio.value,1,12); studio.value=h;
    const ph=post.checked?safe(postHours.value,1,40):0; if(post.checked)postHours.value=ph;
    const studioCost=h*R.studio, postCost=ph*R.post, hostCost=host.checked?h*R.host:0, total=studioCost+postCost+hostCost, balance=Math.max(0,total-R.advance);
    postWrap?.classList.toggle('show',post.checked);
    studioLine.textContent=`${h} ${h===1?'hour':'hours'} × ${money(R.studio)}`;
    postLine.textContent=post.checked?`${ph} ${ph===1?'hour':'hours'} × ${money(R.post)}`:'Not selected';
    hostLine.textContent=host.checked?`${h} ${h===1?'hour':'hours'} × ${money(R.host)}`:'Not selected';
    totalEl.textContent=money(total); advanceEl.textContent=money(R.advance); balanceEl.textContent=money(balance);
    const lines=['Time 2 Talk — Studio Quote',`Studio: ${h} hr × ${money(R.studio)} = ${money(studioCost)}`,post.checked?`Post-production: ${ph} hr × ${money(R.post)} = ${money(postCost)}`:'Post-production: Not selected',host.checked?`Host: ${h} hr × ${money(R.host)} = ${money(hostCost)}`:'Host: Not selected',`Estimated total: ${money(total)}`,`Booking advance: ${money(R.advance)}`,`Remaining after advance: ${money(balance)}`];
    summary.textContent=lines.join('\n'); if(waLink)waLink.href=`https://wa.me/916283065859?text=${encodeURIComponent(lines.join('\n'))}`;
  }
  calc.querySelectorAll('[data-stepper]').forEach(btn=>btn.addEventListener('click',()=>{const input=q(`#${btn.dataset.target}`); if(!input)return; const step=Number(input.step)||1; const min=Number(input.min)||0; const max=Number(input.max)||999; const direction=btn.dataset.stepper==='plus'?1:-1; input.value=Math.min(max,Math.max(min,(Number(input.value)||min)+direction*step)); update();}));
  [studio,postHours].forEach(el=>el?.addEventListener('input',update)); [post,host].forEach(el=>el?.addEventListener('change',update));
  copyBtn?.addEventListener('click',async()=>{const original=copyBtn.textContent;try{await navigator.clipboard.writeText(summary.textContent);copyBtn.textContent='Copied';}catch(e){const ta=document.createElement('textarea');ta.value=summary.textContent;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();copyBtn.textContent='Copied';}setTimeout(()=>copyBtn.textContent=original,1400);});
  resetBtn?.addEventListener('click',()=>{studio.value=2;post.checked=false;postHours.value=1;host.checked=false;update();}); update();
})();

// Remember the user's explicit theme choice. Navigation stays inside that theme.
document.querySelectorAll('[data-theme-select]').forEach(function(link){
  link.addEventListener('click', function(){
    try { localStorage.setItem('t2t-theme', link.getAttribute('data-theme-select')); } catch(e) {}
  });
});
