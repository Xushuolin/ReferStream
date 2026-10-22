(() => {
  'use strict';
  const data = window.REFERSTREAM_DEMOS || [];
  const cases = data.filter(d => !d.variantOf);
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const time = seconds => `${seconds.toFixed(1).replace(/\.0$/, '')} s`;
  const refs = d => `<aside class="reference-rail" aria-label="Reference images for ${escape(d.title)}"><div class="rail-heading">References</div>${d.references.map((r,i) => `<button class="reference-thumb ref-${escape(r.label.toLowerCase())}" type="button" data-ref="${escape(d.id)}:${i}" aria-label="Enlarge reference ${escape(r.label)}: ${escape(r.role)}"><span class="ref-image"><img src="${r.image}" alt="${escape(r.role)}" width="320" height="320" loading="lazy"><span class="ref-letter">${escape(r.label)}</span></span><span class="ref-name">${escape(r.name)}</span></button>`).join('')}</aside>`;
  const player = (d, feature = false) => `<div class="demo-media">${refs(d)}<div class="video-wrap"><video ${feature ? 'id="featured-video"' : ''} data-demo="${escape(d.id)}" data-src="${escape(d.video)}" poster="${d.poster}" controls playsinline muted loop preload="none" aria-label="${escape(d.title)}: ${escape(d.setting)} generation result"></video></div></div>`;
  const tags = d => `<div class="demo-tags"><span class="tag ${d.setting==='MultiShot'?'multi':''}">${d.setting}</span>${d.long?'<span class="tag multi">Long video</span>':''}<span class="tag time">${time(d.duration)}</span></div>`;
  const prompts = d => `<details class="prompt-details"><summary>Prompts &amp; reference sequence</summary><div class="prompt-list">${d.prompts.map(p => `<div class="prompt-item"><h4>${escape(p.label)}${p.references.length?`<span class="prompt-ref">Ref ${p.references.map(escape).join(' + ')}</span>`:''}</h4><p>${escape(p.text)}</p></div>`).join('')}</div><p class="prompt-note">Original case instructions, in order. Scene setup may precede the visible output.</p></details>`;
  const variantSelect = d => {
    const alternatives = data.filter(x => x.variantOf === d.id);
    return alternatives.length ? `<select class="variants" aria-label="Choose result for ${escape(d.title)}" data-base="${escape(d.id)}"><option value="${escape(d.id)}">Result 1</option>${alternatives.map((v,i)=>`<option value="${escape(v.id)}">Result ${i+2}</option>`).join('')}</select>` : '';
  };
  const card = d => `<article class="demo-card" data-card="${escape(d.id)}"><div class="card-heading"><h3>${escape(d.title)}</h3><span class="card-id">${d.setting==='InShot'?'B':'A'} / ${escape(d.number)}</span></div>${player(d)}<div class="card-bottom">${tags(d)}${variantSelect(d)}</div>${prompts(d)}</article>`;
  let filter='all', query='', limit=6;
  const descriptions = {
    all:'InShot introduces subjects within one continuous shot. MultiShot introduces references across shot transitions.',
    InShot:'A new subject enters an established scene, without a shot cut. The original subject remains part of the continuing video.',
    MultiShot:'References arrive across shot transitions as the cast and composition evolve.',
    long:'Longer recorded outputs continue after reference injection, with durations of approximately one minute.',
    multiple:'Successive reference arrivals introduce more than two subjects into a continuing scene.'
  };
  function matches(d) {
    const settingMatch = filter==='all' || (filter==='long'?d.long:filter==='multiple'?d.multiple:d.setting===filter);
    const haystack = [d.title,d.number,d.setting,...d.references.map(r=>r.name+' '+r.role)].join(' ').toLowerCase();
    return settingMatch && haystack.includes(query);
  }
  function renderGallery() {
    const filtered=cases.filter(matches);
    $('#gallery').innerHTML=filtered.slice(0,limit).map(card).join('');
    $('#result-count').textContent=`Showing ${Math.min(limit,filtered.length)} of ${filtered.length} examples`;
    $('#gallery-context').textContent=descriptions[filter];
    $('#load-more').hidden=limit>=filtered.length;
    $('#no-results').hidden=filtered.length>0;
    observeVideos();
  }
  function feature(prefix) {
    const d=cases.find(c=>c.id.startsWith(prefix));
    if(!d) return;
    $('#feature-player').innerHTML=player(d,true)+`<div class="feature-caption"><strong>${escape(d.title)}</strong>${tags(d)}</div>`;
    document.querySelectorAll('[data-feature]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.feature===prefix)));
    observeVideos();
  }
  function loadVideo(video) {
    if(!video.src){video.src=video.dataset.src;video.load();}
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries=> {
    entries.forEach(({target,isIntersecting})=>{
      if(isIntersecting){loadVideo(target);observer.unobserve(target);}
    });
  },{rootMargin:'250px'}) : null;
  function observeVideos() {
    document.querySelectorAll('video[data-src]').forEach(v=>{
      if(observer) observer.observe(v); else loadVideo(v);
      v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause();}));
      v.addEventListener('error',()=>{
        if(v.parentElement.querySelector('.video-error'))return;
        const message=document.createElement('p');message.className='video-error';
        message.innerHTML=`Video could not load. <a href="${escape(v.dataset.src)}" target="_blank" rel="noopener">Open the video directly ↗</a>`;
        v.parentElement.append(message);
      });
    });
  }
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
    filter=b.dataset.filter;limit=6;
    document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    renderGallery();
  }));
  $('#search').addEventListener('input', e=>{query=e.target.value.toLowerCase().trim();limit=6;renderGallery();});
  $('#load-more').addEventListener('click',()=>{limit+=6;renderGallery();});
  document.querySelectorAll('[data-feature]').forEach(b=>b.addEventListener('click',()=>feature(b.dataset.feature)));
  document.addEventListener('change', e=>{
    if(!e.target.matches('.variants'))return;
    const d=data.find(x=>x.id===e.target.value), c=e.target.closest('.demo-card');
    c.querySelector('.demo-media').outerHTML=player(d);
    c.querySelector('.prompt-details').outerHTML=prompts(d);
    observeVideos();
  });
  const dialog=$('#reference-dialog');
  document.addEventListener('click', e=>{
    const button=e.target.closest('[data-ref]');if(!button)return;
    const [id,index]=button.dataset.ref.split(':');
    const r=data.find(d=>d.id===id).references[Number(index)];
    $('#dialog-image').src=r.image;$('#dialog-image').alt=r.role;
    $('#dialog-caption').textContent=`Reference ${r.label} · ${r.role}`;
    dialog.showModal();
  });
  $('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  $('#copy-citation').addEventListener('click', async()=>{
    try{await navigator.clipboard.writeText($('#citation').textContent);$('#copy-status').textContent='Citation copied.';}
    catch{const range=document.createRange();range.selectNodeContents($('#citation'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);$('#copy-status').textContent='Citation selected. Press Ctrl+C or ⌘C to copy.';}
  });
  feature('b-015_');renderGallery();
})();
