(() => {
  'use strict';
  const data = window.REFERSTREAM_DEMOS || [];
  const featuredPrefixes = ['b-015_', 'b-043_', 'b-151_', 'a-047_'];
  const featuredCases = featuredPrefixes.map(prefix => data.find(d => d.id.startsWith(prefix))).filter(Boolean);
  const featuredIds = new Set(featuredCases.map(d => d.id));
  const cases = data.filter(d => !d.variantOf && !featuredIds.has(d.id));
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const time = seconds => `${seconds.toFixed(1).replace(/\.0$/, '')} s`;
  const refs = d => `<aside class="reference-rail" aria-label="Reference images for ${escape(d.title)}"><div class="rail-heading">References</div>${d.references.map((r,i) => `<button class="reference-thumb ref-${escape(r.label.toLowerCase())}" type="button" data-ref="${escape(d.id)}:${i}" aria-label="Enlarge reference ${escape(r.label)}: ${escape(r.role)}"><span class="ref-image"><img src="${r.image}" alt="${escape(r.role)}" width="320" height="320" loading="lazy"><span class="ref-letter">${escape(r.label)}</span></span><span class="ref-name">${escape(r.name)}</span></button>`).join('')}</aside>`;
  const player = d => `<div class="demo-media">${refs(d)}<div class="video-wrap"><video data-demo="${escape(d.id)}" data-src="${escape(d.video)}" poster="${d.poster}" controls playsinline muted loop preload="none" aria-label="${escape(d.title)}: ${escape(d.setting)} generation result"></video></div></div>`;
  const tags = d => `<div class="demo-tags"><span class="tag ${d.setting==='MultiShot'?'multi':''}">${d.setting}</span>${d.long?'<span class="tag multi">Long video</span>':''}<span class="tag time">${time(d.duration)}</span></div>`;
  const prompts = d => `<details class="prompt-details"><summary>Prompts &amp; reference sequence</summary><div class="prompt-list">${d.prompts.map(p => `<div class="prompt-item"><h4>${escape(p.label)}${p.references.length?`<span class="prompt-ref">Ref ${p.references.map(escape).join(' + ')}</span>`:''}</h4><p>${escape(p.text)}</p></div>`).join('')}</div><p class="prompt-note">Original case instructions, in order. Scene setup may precede the visible output.</p></details>`;
  const variantSelect = d => {
    const alternatives = data.filter(x => x.variantOf === d.id);
    return alternatives.length ? `<select class="variants" aria-label="Choose result for ${escape(d.title)}" data-base="${escape(d.id)}"><option value="${escape(d.id)}">Result 1</option>${alternatives.map((v,i)=>`<option value="${escape(v.id)}">Result ${i+2}</option>`).join('')}</select>` : '';
  };
  const card = (d, featured = false) => `<article class="demo-card${featured ? ' featured-card' : ''}" data-card="${escape(d.id)}"><div class="card-heading"><h3>${escape(d.title)}</h3><span class="card-id">${d.setting==='InShot'?'B':'A'} / ${escape(d.number)}</span></div>${player(d)}<div class="card-bottom">${tags(d)}${variantSelect(d)}</div>${prompts(d)}</article>`;
  let filter='all', query='';
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
    const groups = ['InShot', 'MultiShot'].map(setting => {
      const examples = filtered.filter(d => d.setting === setting);
      if (!examples.length) return '';
      const description = setting === 'InShot' ? 'Within a continuous shot' : 'Across shot transitions';
      return `<section class="demo-group" aria-labelledby="group-${setting}"><div class="group-heading"><h3 id="group-${setting}">${setting}</h3><p>${description} · ${examples.length} examples</p></div><div class="demo-grid">${examples.map(d => card(d)).join('')}</div></section>`;
    });
    $('#gallery').innerHTML=groups.join('');
    $('#result-count').textContent=`${filtered.length} examples · All different from the four highlights above`;
    $('#gallery-context').textContent=descriptions[filter];
    $('#no-results').hidden=filtered.length>0;
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
    document.querySelectorAll('video[data-src]:not([data-bound])').forEach(v=>{
      v.dataset.bound='true';
      if(observer) observer.observe(v); else loadVideo(v);
      v.addEventListener('play',()=>document.querySelectorAll('video[data-demo]').forEach(other=>{if(other!==v)other.pause();}));
      v.addEventListener('error',()=>{
        if(v.parentElement.querySelector('.video-error'))return;
        const message=document.createElement('p');message.className='video-error';
        message.innerHTML=`Video could not load. <a href="${escape(v.dataset.src)}" target="_blank" rel="noopener">Open the video directly ↗</a>`;
        v.parentElement.append(message);
      });
    });
  }
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
    filter=b.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    renderGallery();
  }));
  $('#search').addEventListener('input', e=>{query=e.target.value.toLowerCase().trim();renderGallery();});
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
  $('#featured-grid').innerHTML=featuredCases.map(d=>card(d,true)).join('');
  renderGallery();
})();

// Decorative background: one decoder, no audio, and no playback off screen.
(() => {
  const hero = document.querySelector('.hero');
  const video = document.querySelector('#hero-video');
  const button = document.querySelector('#hero-motion');
  if (!hero || !video || !button) return;
  const mobile = window.matchMedia('(max-width: 760px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let requested = !reduced.matches && !connection?.saveData;
  let visible = true;
  video.muted = true;
  button.hidden = false;

  function updateControl() {
    button.setAttribute('aria-label', requested ? 'Pause background video' : 'Play background video');
    button.querySelector('.motion-label').textContent = requested ? 'Pause background' : 'Play background';
    button.querySelector('.motion-icon').textContent = requested ? 'Ⅱ' : '▷';
  }

  function updatePlayback() {
    updateControl();
    const variant = mobile.matches ? 'mobile' : 'desktop';
    if (video.dataset.variant !== variant) video.classList.remove('is-ready');
    if (!requested || !visible || document.hidden) {
      video.pause();
      return;
    }
    if (video.dataset.variant !== variant) {
      video.dataset.variant = variant;
      video.src = video.dataset[variant];
      video.load();
    }
    video.play().catch(error => {
      // A visibility change can interrupt an otherwise valid play request.
      if (error.name === 'AbortError' || !visible || document.hidden) return;
      requested = false;
      updateControl();
    });
  }

  video.addEventListener('playing', () => video.classList.add('is-ready'));
  video.addEventListener('error', () => {
    video.classList.remove('is-ready');
    requested = false;
    updateControl();
  });
  button.addEventListener('click', () => { requested = !requested; updatePlayback(); });
  document.addEventListener('visibilitychange', updatePlayback);
  mobile.addEventListener('change', updatePlayback);
  reduced.addEventListener('change', () => {
    if (reduced.matches) requested = false;
    updatePlayback();
  });
  if (connection?.addEventListener) connection.addEventListener('change', () => {
    if (connection.saveData) requested = false;
    updatePlayback();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    }, {threshold: 0}).observe(hero);
  } else updatePlayback();
})();
