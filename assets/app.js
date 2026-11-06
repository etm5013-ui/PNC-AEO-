/* =====================================================================
   PNC AEO Lab: UI · built by PNC's Digital Organic Growth Team
   Modes: Explore (simulator) · Presentation · VS
   ===================================================================== */
(function () {
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const S = { m: 'chatgpt', t: 'checking', p: 'student', i: 'rec', L: Object.assign({}, DEFAULT_LEVERS), speed: 1, step: false, seed: 0, token: 0, heatModel: 'chatgpt', last: null, schemaPage: 'pncp', gateRes: null };

  /* ---------- logos, avatars, icons ---------- */
  let uid = 0;
  const uniq = (svg) => { const n = ++uid; return svg.replace(/id="([^"]+)"/g, `id="$1-u${n}"`).replace(/url\(#([^)]+)\)/g, `url(#$1-u${n})`).replace(/href="#([^"]+)"/g, `href="#$1-u${n}"`); };
  function modelLogo(k) { let svg = MODEL_SVG[k]; if (k === 'chatgpt') svg = svg.replace('<svg', '<svg style="color:#0d0d0d"'); return uniq(svg); }
  const avatar = (pk) => uniq(AVATAR_SVG[pk]);
  const avIc = (pk, cls) => `<span class="ic av pic ${cls || ''}">${avatar(pk)}</span>`;
  const PNC_MARK = PNC_SVG.replace(/viewBox="[^"]+"/, 'viewBox="759 185 84 84"').replace(/fill="WORD"/g, 'fill="none"');
  $$('[data-logo="pnc-white"]').forEach(el => el.innerHTML = pncLogo('#FFFFFF'));
  const W = (d) => `<svg viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const INTENT_ICON = {
    info: W('<circle cx="10" cy="10" r="7.5"/><path d="M10 9v5M10 6.2v.1" stroke-width="2"/>'),
    rec: W('<path d="M10 2.8l2.2 4.6 5 .6-3.7 3.4 1 5-4.5-2.5-4.5 2.5 1-5L2.8 8l5-.6z"/>'),
    compare: W('<rect x="2.5" y="4" width="6" height="12" rx="1.5"/><rect x="11.5" y="4" width="6" height="12" rx="1.5"/>'),
    txn: W('<path d="M3 4h2l2 9h8l2-6H6.2"/><circle cx="8" cy="16.5" r="1"/><circle cx="14" cy="16.5" r="1"/>')
  };
  const TOPIC_ICON = {
    check: W('<path d="M3 8l7-4.5L17 8M4.5 8v7M8 8v7M12 8v7M15.5 8v7M3 16.5h14"/>'),
    phone: W('<rect x="5.5" y="2.5" width="9" height="15" rx="2"/><path d="M9 15h2"/>'),
    home: W('<path d="M3 9.5L10 3.5l7 6M5 8.5V16.5h10V8.5M8.5 16.5v-4h3v4"/>'),
    chart: W('<path d="M3 16.5h14M5 13l3.5-4 3 2.5L16 6"/><path d="M13 6h3v3"/>'),
    card: W('<rect x="2.5" y="4.5" width="15" height="11" rx="2"/><path d="M2.5 8.5h15M5.5 12.5h3"/>')
  };
  const LEVER_ICON = {
    Content: '<svg viewBox="0 0 16 16"><path d="M3 3h10M3 7h10M3 11h6" stroke="#EF6A00" stroke-width="2" stroke-linecap="round"/></svg>',
    Technical: '<svg viewBox="0 0 16 16"><path d="M5 4L1.5 8 5 12M11 4l3.5 4L11 12" fill="none" stroke="#2A6AB0" stroke-width="2" stroke-linecap="round"/></svg>',
    'Off-site': '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="#1E9E8A" stroke-width="2"/><path d="M2 8h12M8 2c2.5 3 2.5 9 0 12M8 2c-2.5 3-2.5 9 0 12" fill="none" stroke="#1E9E8A" stroke-width="1.4"/></svg>',
    Measurement: '<svg viewBox="0 0 16 16"><path d="M2 14V9M6 14V5M10 14V7M14 14V2" stroke="#8A5CC2" stroke-width="2.2" stroke-linecap="round"/></svg>'
  };

  /* ---------- site icons: real marks, else live favicon over a brand tile ---------- */
  const FAV_PAL = ['#2A6AB0', '#1E9E8A', '#8A5CC2', '#C2416B', '#44505A', '#0b5d85', '#7a5a14'];
  const isPnc = (s) => s.type === 'owned';
  function favColor(dom) { if (dom === 'pnc.com') return '#EF6A00'; let h = 0; for (const c of dom) h = (h * 31 + c.charCodeAt(0)) >>> 0; return FAV_PAL[h % FAV_PAL.length]; }
  function favDom(dom) {
    if (dom === 'pnc.com') return `<span class="fav mk pncf">${PNC_MARK}</span>`;
    if (typeof FAV_IMG !== 'undefined' && FAV_IMG[dom]) return `<span class="fav im"><img alt="" src="${FAV_IMG[dom]}"></span>`;
    if (FAV_MARK[dom]) return `<span class="fav mk">${FAV_MARK[dom]}</span>`;
    const t = FAV_TILE[dom] || [favColor(dom), dom[0].toUpperCase()];
    return `<span class="fav tl" style="background:${t[0]}"><b class="${t[1].length > 2 ? 'xs' : t[1].length > 1 ? 's' : ''}">${esc(t[1])}</b><img alt="" loading="lazy" data-d="${dom}" src="https://t3.gstatic.com/faviconV2?client=SOCIAL&amp;type=FAVICON&amp;fallback_opts=TYPE,SIZE,URL&amp;url=https://${dom}&amp;size=64" onload="this.classList.add('ok')" onerror="if(!this.dataset.t){this.dataset.t=1;this.src='https://icons.duckduckgo.com/ip3/'+this.dataset.d+'.ico'}else this.remove()"></span>`;
  }
  const fav = (s) => favDom(s.dom);
  const shortDom = (s) => s.dom === 'google.com' ? 'Google Maps' : s.dom.replace(/\.(com|org|gov)$/, '');
  const kindLabel = (s) => ({ product: 'Product page', article: 'General SEO article', persona: 'Persona guide', local: 'Local listing', offer: 'Bonus offer page' }[s.kind] || SRC_TYPES[s.type].n);

  /* ---------- tooltip ---------- */
  const tt = $('#tt');
  document.addEventListener('mouseover', e => { const t = e.target.closest('[data-tt]'); if (!t) { tt.classList.remove('on'); return; } tt.innerHTML = t.getAttribute('data-tt'); tt.classList.add('on'); });
  document.addEventListener('mousemove', e => { if (!tt.classList.contains('on')) return; const w = tt.offsetWidth, h = tt.offsetHeight; let x = e.clientX + 14, y = e.clientY + 16; if (x + w > innerWidth - 8) x = e.clientX - w - 14; if (y + h > innerHeight - 8) y = e.clientY - h - 12; tt.style.left = x + 'px'; tt.style.top = y + 'px'; });

  /* ---------- option catalogs (shared by dropdowns, presentation and VS) ---------- */
  const OPTS = {
    m: () => Object.entries(MODELS).map(([k, m]) => ({ k, icon: `<span class="ic">${modelLogo(k)}</span>`, big: `<span class="pc-ic lg">${modelLogo(k)}</span>`, b: m.name, s: m.maker + ' · ' + m.ver, d: m.maker + ' · ' + m.index })),
    t: () => Object.entries(TOPICS).map(([k, x]) => ({ k, icon: `<span class="ic it">${TOPIC_ICON[x.ic]}</span>`, big: `<span class="pc-ic dk">${TOPIC_ICON[x.ic]}</span>`, b: x.name, s: Object.values(x.products.default).length + ' brands compared', d: 'Includes ' + [...new Set(['default'].concat(Object.values(x.segOf)))].map(sg => (x.products[sg] || x.products.default).pnc[0]).join(', ') })),
    p: () => PERSONA_ORDER.map(k => { const p = PERSONAS[k]; return { k, icon: avIc(k), big: `<span class="pc-av">${avatar(k)}</span>`, b: p.name, s: p.who, d: p.who + '. ' + p.blurb }; }),
    i: () => Object.entries(INTENTS).map(([k, x]) => ({ k, icon: `<span class="ic it">${INTENT_ICON[k]}</span>`, big: `<span class="pc-ic dk">${INTENT_ICON[k]}</span>`, b: x.name, s: 'Answer shape: ' + x.fmt, d: x.d }))
  };

  /* ---------- dropdowns ---------- */
  function makeDD(el, label, opts, get, set) {
    el.innerHTML = `<label id="${el.id}-l">${label}</label><button class="dd-btn" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="${el.id}-l ${el.id}-b" id="${el.id}-b"></button><div class="dd-list" role="listbox" aria-labelledby="${el.id}-l"></div>`;
    const btn = $('.dd-btn', el), list = $('.dd-list', el);
    function paint() {
      const o = opts.find(x => x.k === get());
      btn.innerHTML = `${o.icon}<span class="tx"><b>${o.b}</b><small>${o.s}</small></span><span class="car"></span>`;
      list.innerHTML = opts.map(x => `<button class="dd-opt ${x.k === get() ? 'on' : ''}" role="option" aria-selected="${x.k === get()}" data-k="${x.k}">${x.icon}<span><b>${x.b}</b><small>${x.d || x.s}</small></span></button>`).join('');
    }
    function open(v) { $$('.dd.open').forEach(d => { if (d !== el) { d.classList.remove('open'); $('.dd-btn', d).setAttribute('aria-expanded', 'false'); } }); el.classList.toggle('open', v); btn.setAttribute('aria-expanded', v); if (v) { const on = $('.dd-opt.on', list); on && on.focus(); } }
    btn.addEventListener('click', () => open(!el.classList.contains('open')));
    list.addEventListener('click', e => { const o = e.target.closest('.dd-opt'); if (!o) return; set(o.dataset.k); paint(); open(false); btn.focus(); });
    el.addEventListener('keydown', e => {
      if (e.key === 'Escape') { open(false); btn.focus(); }
      if (!el.classList.contains('open')) return;
      const items = $$('.dd-opt', list), i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(items.length - 1, i + 1)].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(0, i - 1)].focus(); }
    });
    paint(); return { paint };
  }
  document.addEventListener('click', e => { if (!e.target.closest('.dd')) $$('.dd.open').forEach(d => { d.classList.remove('open'); $('.dd-btn', d).setAttribute('aria-expanded', 'false'); }); });
  const DD = {
    m: makeDD($('#dd-model'), 'Model', OPTS.m(), () => S.m, v => { S.m = v; onChange(); }),
    t: makeDD($('#dd-topic'), 'Topic / product', OPTS.t(), () => S.t, v => { S.t = v; onChange(); }),
    p: makeDD($('#dd-persona'), 'Persona', OPTS.p(), () => S.p, v => { S.p = v; onChange(); }),
    i: makeDD($('#dd-intent'), 'Intent', OPTS.i(), () => S.i, v => { S.i = v; onChange(); })
  };
  const repaintDD = () => Object.values(DD).forEach(d => d.paint());

  /* ---------- levers ---------- */
  const leverSeg = (k) => `<span class="seg sm" data-lever="${k}"><button data-v="0" class="${!S.L[k] ? 'on' : ''}">${LEVERS[k].off}</button><button data-v="1" class="${S.L[k] ? 'on' : ''}">${LEVERS[k].on}</button></span>`;
  function leversHTML() { return '<span class="lv-k">AEO levers <em>what-if</em></span>' + Object.entries(LEVERS).map(([k, l]) => `<div class="lvt" data-tt="${esc(l.d)}"><span class="lvt-n">${l.n}</span>${leverSeg(k)}</div>`).join(''); }
  function paintLevers() { $$('.levers-host').forEach(el => el.innerHTML = leversHTML()); }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lever] button'); if (!b) return;
    const k = b.parentNode.dataset.lever; S.L[k] = b.dataset.v === '1';
    paintLevers(); paintSchemaLab(); paintVariability(); $('#againBtn').disabled = true;
    if (PR.on && PR.phase === 'back') PR.relever();
  });

  function onChange() { S.seed = 0; paintPrompt(); paintDevice(); $('#againBtn').disabled = true; paintVariability(); paintSchemaLab(); }
  function paintPrompt() {
    const sc = buildScenario(S.t, S.p, S.i, S.L), P = PERSONAS[S.p], M = MODELS[S.m];
    $('#promptText').textContent = sc.prompt;
    $('#promptType').textContent = TOPICS[S.t].short + ' · ' + INTENTS[S.i].name;
    $('#persLine').innerHTML = P.mem.length
      ? `${avIc(S.p, 'sm')}<span><b>${esc(P.who)}.</b> ${M.mem ? `${esc(M.name)}’s ${M.memory.toLowerCase()} knows: ${P.mem.map(esc).join(' · ')}` : `<em>${esc(M.name)} has no memory. Only the words in the query carry the persona.</em>`}</span>`
      : `${avIc('general', 'sm')}<span><b>No persona.</b> Anonymous session, no memory or audience signal.</span>`;
  }

  /* ---------- speed / step / divider / tabs ---------- */
  $('#speedSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    S.step = b.dataset.s === 'step'; S.speed = S.step ? 1 : +b.dataset.s;
    $$('#speedSeg button').forEach(x => x.classList.toggle('on', x === b));
  });
  const split = $('#split');
  (function () {
    let drag = false;
    const move = (e) => { if (!drag) return; const r = split.getBoundingClientRect(); split.style.setProperty('--x', Math.min(72, Math.max(28, (e.clientX - r.left) / r.width * 100)) + '%'); };
    $('#divider').addEventListener('pointerdown', e => { drag = true; e.preventDefault(); });
    addEventListener('pointermove', move); addEventListener('pointerup', () => drag = false);
    $('#knob').addEventListener('keydown', e => { const cur = parseFloat(split.style.getPropertyValue('--x')) || 50; if (e.key === 'ArrowLeft') split.style.setProperty('--x', Math.max(28, cur - 4) + '%'); if (e.key === 'ArrowRight') split.style.setProperty('--x', Math.min(72, cur + 4) + '%'); });
    $('#mtabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; split.dataset.mode = b.dataset.mode; $$('#mtabs button').forEach(x => x.classList.toggle('on', x === b)); });
  })();

  /* ---------- chat view (used by simulator, presentation and VS) ---------- */
  const DEVICE_HTML = '<div class="chat-top"></div><div class="chat-body"></div><div class="chat-in"><span>Ask anything</span><i></i></div>';
  function topHTML(mk, prompt) {
    const M = MODELS[mk];
    return mk === 'aio'
      ? `<span class="glogo"><b style="color:#4285F4">G</b><b style="color:#EA4335">o</b><b style="color:#FBBC05">o</b><b style="color:#4285F4">g</b><b style="color:#34A853">l</b><b style="color:#EA4335">e</b></span><span class="gsearch">${esc(prompt || '')}</span>`
      : `<span class="mk">${modelLogo(mk)}</span><b>${M.name}</b><span class="mv">${M.ver}</span><span class="tb"><i></i><i></i></span>`;
  }
  function chrome(dev, mk, prompt) {
    dev.dataset.m = mk;
    $('.chat-top', dev).innerHTML = topHTML(mk, prompt);
    const ci = $('.chat-in', dev); ci.style.display = mk === 'aio' ? 'none' : '';
    $('span', ci).textContent = mk === 'gemini' ? 'Ask Gemini' : mk === 'claude' ? 'Reply to Claude…' : mk === 'copilot' ? 'Message Copilot' : 'Ask anything';
  }
  function paintDevice() {
    chrome($('#device'), S.m, buildScenario(S.t, S.p, S.i, S.L).prompt);
    $('#emptyLogo').innerHTML = `<span style="width:34px;height:34px;display:block">${modelLogo(S.m)}</span>`;
    $('#custSub').textContent = MODELS[S.m].name + ' · ' + PERSONAS[S.p].short + ' · ' + TOPICS[S.t].short;
    $('#techSub').textContent = MODELS[S.m].index;
  }
  function chatView(dev, r) {
    const mk = r.modelKey, aio = mk === 'aio', M = r.M, P = r.P;
    chrome(dev, mk, aio ? '' : r.sc.prompt);
    const chat = $('.chat-body', dev); chat.innerHTML = '';
    if (r.understand.memory.length && !aio) chat.insertAdjacentHTML('beforeend', `<div class="mem"><b>${M.memory}:</b>${P.mem.map(m => `<span>${esc(m)}</span>`).join('')}</div>`);
    const holder = document.createElement('div');
    let aioCard = null;
    const scroll = () => { chat.scrollTop = chat.scrollHeight; };
    const api = {
      async type(ctx) {
        const words = r.sc.prompt.split(' ');
        if (aio) {
          const gq = $('.gsearch', dev);
          if (ctx.instant) gq.textContent = r.sc.prompt; else for (let w = 1; w <= words.length; w++) { gq.textContent = words.slice(0, w).join(' '); await ctx.sleep(26); if (!ctx.live()) return; }
          chat.insertAdjacentHTML('beforeend', `<div class="gtabs"><b>AI Mode</b><b class="on">All</b><b>Images</b><b>News</b><b>Videos</b><b>Maps</b></div>`);
          aioCard = document.createElement('div'); aioCard.className = 'aio-card'; aioCard.innerHTML = `<div class="aio-h"><span class="sp go">${modelLogo('gemini')}</span><b>AI Overview</b></div>`; chat.appendChild(aioCard); aioCard.appendChild(holder);
        } else {
          const inp = $('.chat-in span', dev);
          if (!ctx.instant) { inp.style.color = '#1f1f1f'; for (let w = 1; w <= words.length; w++) { inp.textContent = words.slice(0, w).join(' '); await ctx.sleep(26); if (!ctx.live()) return; } await ctx.sleep(200); inp.style.color = ''; }
          chrome(dev, mk, '');
          chat.insertAdjacentHTML('beforeend', `<div class="u-row"><div class="u-msg">${esc(r.sc.prompt)}</div><span class="u-av">${avatar(r.p)}</span></div>`);
          chat.appendChild(holder);
        }
        scroll();
      },
      status(html, done) {
        holder.innerHTML = mk === 'gemini' ? `<div class="g-head"><span class="sp ${done ? '' : 'go'}">${modelLogo('gemini')}</span><div class="status ${done ? 'done' : ''}" style="margin-top:3px">${html}</div></div>` : `<div class="status ${done ? 'done' : ''}">${html}</div>`; scroll();
      },
      async stream(ctx) {
        const nC = r.citedOrdered.length;
        const doneTxt = { chatgpt: `Searched ${r.queries.length} queries · ${nC} sources`, gemini: 'Show thinking', claude: `Searched the web · ${nC} results`, copilot: `Searched ${r.queries.length} queries · ${nC} sources`, aio: '' }[mk];
        if (aio) holder.innerHTML = ''; else api.status(`<span class="chev"></span><span>${doneTxt}</span>`, true);
        const box = document.createElement('div'); box.className = 'ans';
        if (aio) { $('.aio-h .sp', aioCard).classList.remove('go'); aioCard.appendChild(box); }
        else if (mk === 'copilot') { const w = document.createElement('div'); w.className = 'ans-wrap'; w.appendChild(box); chat.appendChild(w); }
        else if (mk === 'gemini') { const g = document.createElement('div'); g.className = 'g-head'; g.innerHTML = `<span class="sp">${modelLogo('gemini')}</span>`; g.appendChild(box); box.style.flex = '1'; box.style.minWidth = '0'; chat.appendChild(g); holder.innerHTML = `<div class="status done" style="margin-left:34px"><span class="chev"></span><span>${doneTxt}</span></div>`; }
        else chat.appendChild(box);
        for (const ch of buildAnswer(r)) {
          if (ch.li) { const ols = box.querySelectorAll('ol,ul.bl'); ols[ols.length - 1].insertAdjacentHTML('beforeend', ch.li); if (!ctx.instant) { scroll(); await ctx.sleep(240); if (!ctx.live()) return; } continue; }
          if (ch.stream) {
            const el = document.createElement('p'); box.appendChild(el);
            if (!ctx.instant) { const ws = ch.stream.split(' '); for (let w = 1; w <= ws.length; w += 2) { el.innerHTML = esc(ws.slice(0, w).join(' ')) + '<span class="cur"></span>'; scroll(); await ctx.sleep(24); if (!ctx.live()) return; } }
            el.innerHTML = esc(ch.stream);
          } else { (ch.into === 'chat' ? chat : box).insertAdjacentHTML('beforeend', ch.html); if (!ctx.instant) { scroll(); await ctx.sleep(ch.wait == null ? 150 : ch.wait); if (!ctx.live()) return; } }
        }
        if (ctx.instant) chat.scrollTop = 0;
      }
    };
    return api;
  }

  /* ---------- JSON-LD generator ---------- */
  function schemaFor(t, p, s) {
    const T = TOPICS[t], seg = segFor(t, p), prod = (T.products[seg] || T.products.default).pnc, P = PERSONAS[p];
    const url = 'https://www.pnc.com/en' + s.path;
    const org = { '@type': 'BankOrCreditUnion', '@id': 'https://www.pnc.com/#org', name: 'PNC Bank', url: 'https://www.pnc.com', sameAs: ['https://www.wikidata.org/wiki/Q38928'] };
    const audOf = (pp) => pp === 'smb' ? { '@type': 'BusinessAudience', audienceType: 'Small business owners', numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 99 } } : { '@type': 'PeopleAudience', audienceType: PERSONAS[pp].aud.replace(/^./, c => c.toUpperCase()) };
    let main;
    if (s.kind === 'offer') {
      main = { '@type': 'Offer', '@id': url + '#offer', name: 'PNC checking account bonus offer', description: 'Earn a cash bonus when you open an eligible PNC checking account and meet the qualifying direct deposit requirements. See terms for details.', category: 'Checking account bonus', eligibleCustomerType: 'New PNC checking customers', offeredBy: { '@id': org['@id'] }, itemOffered: { '@type': ['FinancialProduct', 'BankAccount'], name: (T.products.default.pnc)[0], url: 'https://www.pnc.com/en' + T.pages.default.path }, url };
    } else if (s.kind === 'persona' || s.kind === 'article') {
      main = { '@type': 'Article', '@id': url + '#article', headline: s.t, author: { '@id': org['@id'] }, publisher: { '@id': org['@id'] }, datePublished: '2026-09-15', dateModified: '2026-11-02', about: { '@type': 'Thing', name: (T.cat[seg] || T.cat.default)[0] }, mentions: [{ '@type': 'FinancialProduct', name: prod[0], url: 'https://www.pnc.com/en' + (T.pages[seg] || T.pages.default).path }] };
      if (s.kind === 'persona') main.audience = audOf(s.aud);
    } else if (T.schemaType === 'MobileApplication') {
      main = { '@type': ['SoftwareApplication', 'MobileApplication'], '@id': url + '#app', name: prod[0], applicationCategory: 'FinanceApplication', operatingSystem: 'iOS, Android', provider: { '@id': org['@id'] }, featureList: prod.slice(2, 5), description: prod[1] };
    } else {
      main = { '@type': T.schemaType === 'FinancialService' ? 'FinancialService' : ['FinancialProduct', T.schemaType], '@id': url + '#product', name: prod[0], provider: { '@id': org['@id'] }, description: prod[1], category: T.name, feesAndCommissionsSpecification: prod[2], additionalProperty: [{ '@type': 'PropertyValue', name: T.cols[1], value: prod[3] }, { '@type': 'PropertyValue', name: T.cols[2], value: prod[4] }], areaServed: 'US', url };
      if (seg === 'smb' || seg === 'student' || seg === 'ema') main.audience = audOf(seg);
    }
    const faq = { '@type': 'FAQPage', mainEntity: (s.kind === 'offer' ? [['How do I qualify for the PNC checking bonus?', 'Open an eligible checking account and meet the qualifying direct deposit requirements within the promotional period. See the offer terms on this page.'], ['Who is eligible?', 'New PNC checking customers; terms and availability vary by market.']] : s.kind === 'persona' ? [[`What should ${P.aud || 'customers'} look for?`, T.pp[p] || prod[1]], [T.faqQ[0], prod[2]]] : [[T.faqQ[0], prod[2]], [T.faqQ[1], prod[3]]]).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
    const page = { '@type': 'WebPage', '@id': url, url, inLanguage: 'en-US', dateModified: '2026-11-02', isPartOf: { '@id': 'https://www.pnc.com/#website' } };
    return { '@context': 'https://schema.org', '@graph': [main, faq, page, org] };
  }
  function jsonHTML(obj, hot) {
    return esc(JSON.stringify(obj, null, 2)).split('\n').map(line => {
      const l = line.replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="jk">$1</span>$2').replace(/:\s(&quot;.*?&quot;)/g, ': <span class="js">$1</span>');
      return `<span class="jl${hot && hot.some(h => line.includes(h)) ? ' hot' : ''}">${l}</span>`;
    }).join('\n');
  }
  const SCHEMA_HOT = ['audience', 'audienceType', 'feesAndCommissionsSpecification', 'dateModified', 'acceptedAnswer', 'FAQPage', 'name&quot;: &quot;PNC'];
  function schemaFacts(t, p, s) {
    const g = schemaFor(t, p, s)['@graph'], main = g[0];
    const f = [['@type', [].concat(main['@type']).join(' + ')], ['name', main.name || main.headline]];
    if (main.feesAndCommissionsSpecification) f.push(['fees', main.feesAndCommissionsSpecification]);
    if (main.additionalProperty) f.push([main.additionalProperty[0].name, main.additionalProperty[0].value]);
    if (main.featureList) f.push(['features', main.featureList.join('; ')]);
    if (main.audience) f.push(['audience', main.audience.audienceType]);
    f.push(['FAQ', g[1].mainEntity.length + ' Q&A pairs']); f.push(['dateModified', '2026-11-02']);
    return f;
  }

  /* ---------- pipeline stages (shared renderers) ----------
     ctx: { sleep, live, log, status, spin, scroll, instant } */
  const lever = (t, tag) => `<div class="lever"><b>${tag || 'AEO lever'}</b><span>${t}</span></div>`;
  const peekBtn = (id) => `<button class="peek" data-peek="${id}" aria-label="Peek at this page">Peek</button>`;
  const SUB = [r => r.I.name, r => `1 prompt → ${r.queries.length} queries`, r => r.M.index, r => `top ${r.cited.length} of ${r.sc.src.length} kept`, () => 'brands & facts found on kept pages', () => 'evidence by source → mentions', r => r.M.name + ' answer style'];
  const shortB = (n) => n.replace('Bank of America', 'BofA').replace('Rocket Mortgage', 'Rocket').replace('American Express', 'Amex').replace('Charles Schwab', 'Schwab').replace('Capital One', 'Cap One');
  const STAGES = [
    async (r, c, ctx) => {
      const P = r.P, aio = r.modelKey === 'aio';
      ctx.status(ctx.spin(aio ? 'Searching' : 'Thinking'));
      const audHtml = r.p === 'general' ? '<span style="color:#8fa1ad">None. Only general-audience content can match this prompt.</span>' : `<span class="chp aud">${esc(P.aud)}</span> <span style="color:#8fa1ad">→ can match persona-targeted pages</span>`;
      c.innerHTML = `<div class="u-who">${avIc(r.p)}<div><b>${esc(P.name)}</b><small>${esc(P.who)}</small></div></div><dl class="kv">
        <dt>Explicit</dt><dd><div class="chips">${r.understand.explicit.map(x => `<span class="chp">${esc(x)}</span>`).join('')}</div></dd>
        <dt>Memory</dt><dd>${r.understand.memory.length ? `<div class="chips">${r.understand.memory.map(x => `<span class="chp mem">${esc(x)}</span>`).join('')}</div>` : r.understand.memBlocked ? '<span style="color:#ffb27a">Not available. AI Overviews runs as a Google search with no chat memory. Only words in the query count.</span>' : '<span style="color:#8fa1ad">None. Anonymous session.</span>'}</dd>
        <dt>Audience</dt><dd>${audHtml}</dd>
        <dt>Inferred</dt><dd><div class="chips">${r.understand.inferred.map(x => `<span class="chp inf">${esc(x)}</span>`).join('')}</div></dd>
      </dl><div class="implied" style="margin-top:8px"><b>Implied need</b>${esc(r.understand.implied)}</div>` +
        lever(r.p === 'general' ? 'With no persona, the model can only match general content. That’s why general prompts favor big national brands and broad affiliate lists.' : `The model now knows it’s answering <em>${esc(P.aud)}</em>. Pages written for that audience can match this prompt in ways a general SEO article can’t.`, 'Persona');
      ctx.log('MEM', r.understand.memory.length ? `memory applied: ${r.understand.memory.length} facts` : r.understand.memBlocked ? 'no memory (search context)' : 'no memory', r.understand.memory.length ? 'w' : '');
      ctx.log('PARSE', `intent=${r.i} · audience=${P.aud || 'none'} · confidence=${r.understand.confidence}%`, 'ai');
      await ctx.sleep(1400);
    },
    async (r, c, ctx) => {
      const mk = r.modelKey;
      for (const q of r.queries) {
        c.insertAdjacentHTML('beforeend', `<div class="qrow"><span class="qt ${q.type}">${q.type}</span><span>${esc(q.q)}</span><span class="h">${q.hits} hits</span></div>`);
        ctx.log('FAN', `q: "${esc(q.q)}" [${q.type}]`, q.type === 'persona' ? 'w' : '');
        ctx.status(ctx.spin(mk === 'copilot' ? `Searching for: ${esc(q.q)}` : mk === 'gemini' ? `Searching Google for “${esc(q.q)}”` : mk === 'aio' ? 'Searching' : `Searching “${esc(q.q)}”`));
        await ctx.sleep(340); if (!ctx.live()) return;
      }
      const pq = r.queries.filter(q => q.type === 'persona');
      c.insertAdjacentHTML('beforeend', lever(pq.length ? `${pq.length} sub-quer${pq.length > 1 ? 'ies are' : 'y is'} persona-specific (“${esc(pq[0].q)}”). A general article rarely ranks for these. A page written for ${esc(r.P.aud)} does.` : r.p === 'general' ? 'No persona sub-queries. Every PNC page competes on the generic head terms against national brands and affiliates.' : `${esc(r.M.name)} didn’t fan out a persona sub-query on this run, so the persona page has to win on the generic queries.`));
      ctx.scroll(c); await ctx.sleep(400);
    },
    async (r, c, ctx) => {
      const M = r.M, P = r.P, all = r.sc.src.map(s => r.sources.find(x => x.id === s.id));
      ctx.status(ctx.spin(r.modelKey === 'aio' ? 'Generating' : `Reading ${all.length} pages`));
      for (const s of all) {
        const drop = s.status === 'dropped';
        const tag = drop ? '<span class="tg drop">Dropped</span>' : s.partial ? '<span class="tg part">JSON-LD only</span>' : `<span class="tg" style="background:${SRC_TYPES[s.type].c}33;color:#fff;border:1px solid ${SRC_TYPES[s.type].c}">${s.type === 'owned' ? kindLabel(s) : { affiliate: 'Affiliate', authority: 'Authority', social: s.fmt === 'video' ? 'Video' : 'Community', competitor: 'Competitor' }[s.type]}</span>`;
        const extra = s.type === 'owned' ? (s.schemaOn ? ' <span class="mini j">{ } JSON-LD</span>' : ' <span class="mini nj">no schema</span>') + (s.aud ? ` <span class="mini ${s.audMatch ? 'a' : ''}">${s.audMatch ? '✓ audience: ' + esc(P.aud) : 'other audience'}</span>` : '') : '';
        c.insertAdjacentHTML('beforeend', `<div class="srow ${drop ? 'drop' : ''}">${fav(s)}<span class="t"><b>${esc(s.t)}</b><small>${esc(s.dom + (s.path || ''))}${drop || s.partial ? ' · ' + esc(s.reason) : ''}${extra}</small></span>${tag}${peekBtn(s.id)}</div>`);
        if (drop) ctx.log('DROP', `${s.dom}${s.path || ''} → ${esc(s.reason)}`, 'w');
        else if (s.partial) ctx.log('LD+J', `${s.dom}${s.path || ''} → body empty, parsed application/ld+json`, 'w');
        else ctx.log('IDX', `fetch ${s.dom}${s.path || ''} · 200${s.schemaOn ? ' · JSON-LD found' : ''}`, s.schemaOn ? 'ok' : '');
        await ctx.sleep(140); if (!ctx.live()) return;
      }
      const prodPage = all.find(s => s.kind === 'product');
      if (prodPage && prodPage.schemaOn && prodPage.status !== 'dropped')
        c.insertAdjacentHTML('beforeend', `<div class="ld"><div class="ld-h"><span>application/ld+json · pnc.com${esc(prodPage.path)}</span><button class="peek" data-peek="pncp">Full markup</button></div><pre>${jsonHTML(schemaFor(r.t, r.p, prodPage)['@graph'][0], SCHEMA_HOT).split('\n').slice(0, 9).join('\n')}\n  …</pre></div>`);
      const pD = all.filter(s => isPnc(s) && s.status === 'dropped'), pP = all.filter(s => s.partial);
      c.insertAdjacentHTML('beforeend', lever(pP.length ? `<b class="inl">${esc(pP[0].path)}</b> renders with JavaScript, so ${esc(M.bots[0])} sees an empty body. <strong>Schema rescued it</strong>: the JSON-LD sits in the static HTML, so ${esc(M.name)} still got the product name, fees and FAQ.`
        : pD.length ? `<b class="inl">${esc(pD[0].path)}</b> was dropped. Its content loads with JavaScript and it has no schema in this scenario, so ${esc(M.name)} got nothing. Turn on <em>Page-level schema</em> to see the difference.`
        : `Every PNC page was readable${all.some(s => s.schemaOn) ? ', and the JSON-LD gives the model clean, labeled facts instead of scraped text' : ''}.`, 'Schema'));
      ctx.scroll(c); await ctx.sleep(500);
    },
    async (r, c, ctx) => {
      const M = r.M, aio = r.modelKey === 'aio';
      ctx.status(ctx.spin(aio ? 'Generating' : 'Ranking sources'));
      const maxS = Math.max(...r.sources.map(s => s.score), .01);
      let html = '<div class="rank">', cut = false;
      r.sources.forEach(s => {
        if (!cut && s.status !== 'cited') { html += `<div class="cut">CUTOFF · ${esc(M.name)} cites ~${r.cited.length}</div>`; cut = true; }
        const tags = (s.tags || []).filter(x => x !== 'JSON-LD' || s.type === 'owned').map(x => `<span class="rt ${/match$/.test(x) ? 'a' : /mismatch|General/.test(x) ? 'g' : 'j'}">${x}</span>`).join('');
        html += `<div class="rk ${s.status}" data-tt="<b>${esc(s.dom)}</b><br>${esc(s.t)}<br>${SRC_TYPES[s.type].n} · score ${s.score.toFixed(2)}<br>Organic position #${s.org || '—'}${s.reason ? '<br>' + esc(s.reason) : ''}"><span class="d">${fav(s)}${s.type === 'owned' ? `<b style="color:#ffb27a">${esc(s.kind === 'product' ? 'pnc · product' : s.kind === 'offer' ? 'pnc · bonus offer' : s.kind === 'persona' ? 'pnc · persona' : s.kind === 'article' ? 'pnc · general' : 'pnc · maps')}</b>` : esc(shortDom(s))}${aio ? `<em class="org">#${s.org || '–'}</em>` : ''}</span><span class="tr"><i style="width:0;background:${SRC_TYPES[s.type].c}" data-w="${s.score / maxS * 100}"></i>${tags ? `<span class="rts">${tags}</span>` : ''}</span><span class="v">${s.status === 'dropped' ? '—' : s.score.toFixed(2)}</span></div>`;
      });
      html += '</div><div class="leg">' + Object.entries(SRC_TYPES).map(([k, t]) => `<span><i style="background:${t.c}"></i>${t.n}</span>`).join('') + '<span><i style="background:#4d5c67"></i>Not cited</span></div>';
      c.innerHTML = html; await ctx.sleep(60);
      $$('.rk .tr i', c).forEach(i => i.style.width = i.dataset.w + '%');
      r.cited.forEach((s, j) => ctx.log('RANK', `#${j + 1} ${s.dom}${s.kind ? ' (' + s.kind + ')' : ''} score=${s.score.toFixed(2)}`, s.type === 'owned' ? 'w' : ''));
      const per = r.sources.find(s => s.kind === 'persona'), gen = r.sources.find(s => s.kind === 'article');
      let rl;
      if (aio) { const p1 = r.cited.filter(s => s.org && s.org <= 6).length; rl = `${p1} of ${r.cited.length} AI Overview citations come from the top organic results. <strong>SEO is still the entry ticket</strong>: pages that don’t rank on page one rarely make the Overview.`; }
      else if (per && gen) rl = `Persona guide scored <b class="inl">${per.score.toFixed(2)}</b> vs the general SEO article’s <b class="inl">${gen.score.toFixed(2)}</b>. The audience match outweighs the general article’s stronger organic ranking.`;
      else if (gen && r.p !== 'general' && !r.L.persona) rl = `Only the general SEO article is competing for PNC, scoring ${gen.score.toFixed(2)}. Turn on <em>Persona-targeted content</em> to add a page written for ${esc(r.P.aud)}.`;
      else rl = `${r.cited.filter(isPnc).length ? 'PNC made the cut.' : 'No PNC page made the cut.'} ${esc(M.name)} ${esc(M.tip)}`;
      c.insertAdjacentHTML('beforeend', lever(rl, aio ? 'SEO' : 'Persona content'));
      ctx.scroll(c); await ctx.sleep(1100);
    },
    async (r, c, ctx) => {
      ctx.status(ctx.spin(r.modelKey === 'aio' ? 'Generating' : 'Reading sources'));
      const bcols = r.brandScores.map(b => b.b).sort((a, b) => (a === 'pnc' ? -1 : b === 'pnc' ? 1 : 0));
      let mx = `<div class="mx" style="--n:${bcols.length}"><div class="mx-r mx-h"><span></span>${bcols.map(b => `<span class="${b === 'pnc' ? 'pc' : ''}">${favDom(BRANDS[b].dom)}${esc(shortB(BRANDS[b].n))}</span>`).join('')}</div>`;
      for (const { s, ex } of r.extraction) {
        mx += `<div class="mx-r" data-peek="${s.id}" role="button" tabindex="0"><span class="mx-s">${fav(s)}<em>${esc(s.type === 'owned' ? 'pnc · ' + s.kind : shortDom(s))}</em></span>${bcols.map(b => {
          const e = ex.find(x => x.b === b); let v = '';
          if (e) {
            if (e.kind === 'fp') v = `<i class="cfp" data-tt="${esc(BRANDS[b].n)}’s own page${s.schemaOn ? ' with JSON-LD' : ''}">${s.schemaOn ? '{ }' : '★'}</i>`;
            else if (e.kind === 'soc') v = `<i class="cso s${e.sent === '+' ? 'p' : e.sent === '-' ? 'n' : 'm'}${e.boosted ? ' bo' : ''}" data-tt="${esc(e.quote)}<br><b>${e.n} mention${e.n > 1 ? 's' : ''} · ${e.sent === '+' ? 'positive' : e.sent === '-' ? 'negative' : 'mixed'}</b>">${e.n}</i>`;
            else v = `<i class="caf${e.boosted ? ' bo' : ''}" data-tt="#${e.pos} on the list: ${esc(e.label)}${e.boosted ? '<br><b>Added via outreach</b>' : ''}">#${e.pos}</i>`;
          } else if (b === 'pnc' && (s.type === 'affiliate' || s.type === 'social')) v = '<i class="cmiss" data-tt="PNC isn’t mentioned on this page">–</i>';
          return `<span class="${b === 'pnc' ? 'pc' : ''}">${v}</span>`;
        }).join('')}</div>`;
        ctx.log('EXTR', `${s.dom}: ${ex.length ? ex.map(e => BRANDS[e.b].n + (e.pos ? '#' + e.pos : e.kind === 'soc' ? '(' + e.sent + e.n + ')' : '')).join(', ') : 'facts only, no brands'}`, ex.some(e => e.b === 'pnc') ? 'w' : '');
      }
      mx += '</div><div class="leg"><span><i class="lg-af">#2</i>Rank on affiliate list</span><span><i class="lg-so">4</i>Social mentions (color = sentiment)</span><span><i class="lg-fp">{ }</i>First-party with schema</span><span><i class="lg-fp">★</i>First-party, no schema</span><span><i class="lg-bo"></i>Added after outreach</span></div>';
      c.innerHTML = mx;
      $$('.mx-r', c).forEach((row, j) => { row.style.animationDelay = (ctx.instant ? 0 : j * .09) + 's'; });
      await ctx.sleep(90 * r.extraction.length);
      const pSchema = r.cited.filter(s => isPnc(s) && s.schemaOn).sort((a, b) => (b.kind === 'product') - (a.kind === 'product'));
      if (pSchema.length) c.insertAdjacentHTML('beforeend', `<div class="facts-x"><b>Facts parsed from PNC JSON-LD</b>${schemaFacts(r.t, r.p, pSchema[0]).map(([k, v]) => `<span><em>${esc(k)}</em>${esc(v)}</span>`).join('')}</div>`);
      const missing = r.extraction.filter(({ s, ex }) => (s.type === 'affiliate' || s.type === 'social') && !ex.some(e => e.b === 'pnc'));
      c.insertAdjacentHTML('beforeend', lever(missing.length ? `PNC is missing from ${missing.length} cited third-party page${missing.length > 1 ? 's' : ''}: ${missing.slice(0, 3).map(({ s }) => `<b class="inl">${esc(shortDom(s))}</b>`).join(', ')}. Each mention there is a vote the model counts. Click a row to see the page. Try <em>After outreach</em> to add PNC.` : r.L.third ? 'After outreach, PNC appears on every cited affiliate list and community thread, so the model sees independent sources agreeing about PNC.' : 'PNC is mentioned on every cited third-party page here.', 'Third-party'));
      ctx.scroll(c); await ctx.sleep(900);
    },
    async (r, c, ctx) => {
      const chosenSet = new Set(r.chosen.map(x => x.b));
      const maxB = Math.max(...r.brandScores.map(b => b.total), r.threshold * 1.3);
      c.innerHTML = r.brandScores.map(b => {
        const inA = chosenSet.has(b.b), rank = r.chosen.findIndex(x => x.b === b.b) + 1, raw = (b.fp + b.aff + b.soc + b.mem) || 1, sc2 = b.total / raw / maxB * 100;
        const seg2 = [['fp', b.fp], ['af', b.aff], ['so', b.soc], ['me', b.mem]].map(([k2, v]) => `<i class="${k2}" style="width:0" data-w="${v * sc2}"></i>`).join('');
        return `<div class="bev ${b.b === 'pnc' ? 'pnc' : ''}" data-tt="<b>${esc(BRANDS[b.b].n)}</b><br>First-party ${b.fp.toFixed(2)} · Affiliate ${b.aff.toFixed(2)}<br>Social ${b.soc.toFixed(2)} · Memory ${b.mem.toFixed(2)}<br>Sampled score ${b.total.toFixed(2)}"><span class="nm">${favDom(BRANDS[b.b].dom)}${esc(BRANDS[b.b].n)}</span><span class="tr">${seg2}<u style="left:${r.threshold / maxB * 100}%"></u></span><span class="st ${inA ? 'in' : ''}">${inA ? (b.named ? 'Named · in' : 'In answer · #' + rank) : 'Below bar'}</span></div>`;
      }).join('') + '<div class="leg"><span><i style="background:#f59a4f"></i>First-party</span><span><i style="background:#6aa5e6"></i>Affiliate & authority lists</span><span><i style="background:#b18ce6"></i>Social</span><span><i style="background:repeating-linear-gradient(135deg,#6f808b 0 3px,#4d5c67 3px 6px)"></i>Training memory</span><span><i style="background:#fff;width:2px"></i>Mention bar</span></div>';
      await ctx.sleep(60);
      $$('.bev .tr i', c).forEach(i => i.style.width = i.dataset.w + '%');
      r.brandScores.forEach(b => ctx.log('SYN', `${BRANDS[b.b].n}: fp=${b.fp.toFixed(2)} aff=${b.aff.toFixed(2)} soc=${b.soc.toFixed(2)} mem=${b.mem.toFixed(2)} → ${chosenSet.has(b.b) ? 'MENTION' : 'omit'}`, chosenSet.has(b.b) ? (b.b === 'pnc' ? 'w' : 'ok') : ''));
      const pb = r.brandScores.find(b => b.b === 'pnc'), top = r.brandScores[0];
      const parts = [['first-party', pb.fp], ['affiliate', pb.aff], ['social', pb.soc]].sort((a, b) => b[1] - a[1]);
      c.insertAdjacentHTML('beforeend', lever(r.pnc.named ? `PNC is in the answer because the user named it. ${r.pnc.facts === 'schema' ? 'Its facts came from schema, so they’re accurate.' : r.pnc.facts === 'memory' ? 'But no PNC source was read, so its facts came from training memory and may be outdated.' : 'Its facts came from ' + r.pnc.facts + ' content.'}`
        : r.pnc.mentioned ? `PNC’s strongest evidence was <strong>${parts[0][0]}</strong> (${parts[0][1].toFixed(2)}). ${pb.aff + pb.soc < .3 ? 'Almost none came from third parties, so the mention is fragile across runs.' : 'Third-party agreement makes the mention hold up across runs.'}`
        : `${esc(BRANDS[top.b].n)} leads with ${top.aff + top.soc > top.fp ? 'mostly affiliate and social evidence' : 'mostly first-party evidence'}. PNC’s ${(pb.fp + pb.aff + pb.soc).toFixed(2)} in evidence didn’t clear the bar. ${pb.aff + pb.soc < .2 ? 'The gap is third-party coverage.' : 'More first-party and schema coverage would close it.'}`, 'Synthesis'));
      ctx.scroll(c); await ctx.sleep(1100);
    },
    async (r, c, ctx) => {
      const M = r.M, aio = r.modelKey === 'aio', nC = r.citedOrdered.length;
      const fmtName = aio ? 'AI Overview' : { explainer: 'Explainer', shortlist: 'Shortlist', table: 'Comparison table', steps: 'Steps + call to action' }[r.I.fmt];
      c.innerHTML = `<div class="fmt"><span class="big">${fmtName}</span><span>${r.order.length} brand${r.order.length === 1 ? '' : 's'} named: ${r.order.map(b => `<b class="bn ${b === 'pnc' ? 'pnc' : ''}">${favDom(BRANDS[b].dom)}${esc(BRANDS[b].n)}</b>`).join(' ')} · ${nC} citation${nC === 1 ? '' : 's'}</span></div><p style="font-size:13px;color:#aab5bd;margin:6px 0 0">${esc(M.style)}</p>` +
        lever(r.pnc.facts === 'schema' ? 'PNC’s row in this answer is built from JSON-LD, so fees and features are stated exactly as PNC published them.' : r.pnc.facts === 'memory' && r.pnc.mentioned ? 'PNC’s details came from training memory, so they may be outdated. Schema on a readable page fixes this.' : { info: 'Explainers reward clear definitions, FAQs and persona angles. Being the cited explainer earns trust before the “which bank?” prompt.', rec: 'Shortlists are assembled from affiliate roundups and community threads. If PNC isn’t on those lists, it rarely makes the shortlist.', compare: 'Tables need structured, comparable facts. Schema gives the model exact values for PNC’s row.', txn: 'Transactional answers hand off to one or two links. Make sure PNC’s link lands on a crawlable application path.' }[r.i], 'Render');
      ctx.log('OUT', `render format=${aio ? 'aio' : r.I.fmt} brands=[${r.order.map(b => BRANDS[b].n).join(', ')}] citations=${nC} pnc_facts=${r.pnc.facts}`, 'ai');
    }
  ];

  /* ---------- simulator run ---------- */
  $('#rail').innerHTML = PIPELINE.map((p, i) => `<div><i>${i + 1}</i><span>${p.n}</span></div>`).join('');
  function railSet(i) { $$('#rail div').forEach((d, j) => { d.classList.toggle('on', j === i); d.classList.toggle('done', j < i || i === 99); }); }
  let clock = 0;
  function logReset() { $('#conB').innerHTML = ''; clock = 9 * 3600000 + 41 * 60000 + 2000 + Math.floor(Math.random() * 900); }
  function log(tag, text, cls) {
    clock += 40 + Math.floor(Math.random() * 260);
    const d = new Date(clock), ts = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}.${String(d.getUTCMilliseconds()).padStart(3, '0')}`;
    const b = $('#conB'); b.insertAdjacentHTML('beforeend', `<div class="cl"><span class="ct">${ts}</span><span class="tg ${tag}">${tag}</span><span class="cx ${cls || ''}">${text}</span></div>`); b.scrollTop = b.scrollHeight;
  }
  const spin = (t) => `<span class="spin"></span><span class="shim">${t}</span>`;
  function stageCard(i, sub) {
    $$('#techBody .stg.on').forEach(x => x.classList.remove('on'));
    const el = document.createElement('div'); el.className = 'stg on';
    el.innerHTML = `<div class="stg-h"><span class="n">${i + 1}</span><b>${PIPELINE[i].n}</b><small>${sub || ''}</small></div><div class="stg-c"></div>`;
    $('#techBody').appendChild(el); railSet(i); $('#techBody').scrollTop = el.offsetTop - 8; return $('.stg-c', el);
  }
  function gate() {
    return new Promise(res => {
      const b = $('#nextStep'); b.hidden = false; b.focus({ preventScroll: true });
      $('#conS').textContent = 'paused · click Next step';
      const go = () => { b.hidden = true; b.removeEventListener('click', go); S.gateRes = null; res(); };
      b.addEventListener('click', go); S.gateRes = go;
    });
  }
  document.addEventListener('keydown', e => { if (S.gateRes && e.key === 'ArrowRight' && !PR.on && !e.target.closest('input,.dd')) S.gateRes(); });
  $('#runBtn').addEventListener('click', () => run(false));
  $('#againBtn').addEventListener('click', () => run(true));

  async function run(again) {
    if (S.gateRes) S.gateRes();
    const tok = ++S.token; const live = () => tok === S.token;
    if (again) S.seed++;
    $('#againBtn').disabled = false;
    const r = simulate(S.m, S.t, S.p, S.i, S.seed, S.L); S.last = r;
    paintDevice();
    $('#custEmpty').style.display = 'none';
    $('#techBody').innerHTML = ''; $('#score').classList.remove('show'); railSet(-1); logReset();
    $('#liveDot').classList.add('on'); $('#conS').textContent = r.M.name + ' · run ' + (S.seed + 1);
    const view = chatView($('#device'), r);
    const ctx = { sleep: (ms) => new Promise(res => setTimeout(res, ms / S.speed)), live, log, status: view.status, spin, scroll: (c) => { $('#techBody').scrollTop = c.parentNode.offsetTop - 8; }, instant: false };
    log('PARSE', `prompt received · topic=${S.t} · model=${r.M.name.toLowerCase()}`);
    await view.type(ctx); if (!live()) return;
    for (let i = 0; i < STAGES.length; i++) {
      if (i > 0 && S.step) { view.status(`<span class="chev"></span><span>Paused: click <b>Next step</b> in the model view</span>`, true); await gate(); if (!live()) return; }
      const c = stageCard(i, SUB[i](r));
      await STAGES[i](r, c, ctx); if (!live()) return;
    }
    await view.stream(ctx); if (!live()) return;
    railSet(99); $$('#techBody .stg.on').forEach(x => x.classList.remove('on'));
    log('OUT', 'stream complete', 'ok'); $('#liveDot').classList.remove('on'); $('#conS').textContent = 'complete';
    paintScore(r);
  }

  /* ---------- answer composition ---------- */
  const INTRO = {
    chatgpt: { info: 'Here’s a clear breakdown.', rec: 'Here are the options that come up most often for what you described:', compare: 'Here’s how they compare on the things that matter most:', txn: 'Here’s the quickest way to get this done.' },
    gemini: { info: 'Here’s an overview of what you need to know.', rec: 'Here are some top options to consider, depending on your priorities.', compare: 'Here is a side-by-side look at the key differences.', txn: 'Here’s where to start and what you’ll need.' },
    claude: { info: 'Here’s how I’d think about it.', rec: 'A few options stand out, though the right one depends on what you value most.', compare: 'These are closer than they look. Here’s where they actually differ.', txn: 'Here’s a practical path to getting this done.' },
    copilot: { info: 'Here’s what you should know:', rec: 'Here are some top picks:', compare: 'Here’s a quick comparison:', txn: 'Here’s how to get started:' }
  };
  const HOOK = { student: 'Since you’re a student with a part-time income, I focused on what fits a small, irregular budget.', starter: 'Since you just started your first job, I kept this practical.', fthb: 'Since you’re planning to buy in the Columbus area, I kept your home purchase in mind.', ema: 'Given your savings and equity compensation, I focused on options that scale with you.', smb: 'Since you run a 14-person company, I focused on what matters for a growing business.' };
  function cites(r, nums) {
    if (!nums || !nums.length) return '';
    const m = r.modelKey, srcs = nums.map(n => r.citedOrdered[n - 1]), pc = (s) => isPnc(s) ? ' pnc' : '';
    const tta = (s) => `data-tt="<b>${esc(s.dom)}</b><br>${esc(s.t)}"`;
    if (m === 'chatgpt') { const s = srcs[0]; return ` <span class="cp${pc(s)}" ${tta(s)}>${fav(s)}${esc(shortDom(s))}${srcs.length > 1 ? ' +' + (srcs.length - 1) : ''}</span>`; }
    if (m === 'claude') return srcs.map((s, j) => `<span class="cn${pc(s)}" ${tta(s)}>${nums[j]}</span>`).join('');
    if (m === 'copilot') return srcs.map((s, j) => `<span class="cs${pc(s)}" ${tta(s)}>${nums[j]}</span>`).join('');
    return ` <span class="cg" data-tt="${srcs.map(s => '<b>' + esc(s.dom) + '</b> ' + esc(s.t)).join('<br>')}">${srcs.slice(0, 3).map(s => fav(s)).join('')}</span>`;
  }
  const hl = (b, h) => b === 'pnc' ? `<span class="pnc-hl">${esc(h)}</span>` : esc(h);
  function buildAnswer(r) {
    const a = r.answer, out = [], m = r.modelKey, i = r.i;
    if (m === 'aio') return buildAIO(r);
    const head = (t) => m === 'claude' || m === 'copilot' ? `<p style="margin-bottom:4px"><b>${esc(t)}</b></p>` : `<h4>${esc(t)}</h4>`;
    out.push({ stream: (r.understand.memory.length && HOOK[r.p] ? HOOK[r.p] + ' ' : '') + INTRO[m][i] });
    if (i === 'info') {
      a.blocks.forEach(b => out.push({ html: (b.persona ? `<div class="persona-pt">${head(b.h)}<p>${esc(b.t)}${cites(r, b.cites)}</p></div>` : head(b.h) + `<p>${esc(b.t)}${cites(r, b.cites)}</p>`) }));
      if (a.brandBlocks.length) { out.push({ html: head('Where specific providers fit in') }); out.push({ html: '<ul class="bl"></ul>', wait: 10 }); a.brandBlocks.forEach(b => out.push({ li: `<li><b>${hl(b.b, b.h)}</b>: ${esc(b.t)}${cites(r, b.cites)}</li>` })); }
    }
    if (i === 'rec') {
      const pp = a.blocks.find(b => b.persona); if (pp) out.push({ html: `<p class="persona-pt">${esc(pp.t)}${cites(r, pp.cites)}</p>` });
      out.push({ html: '<ol></ol>', wait: 10 });
      a.brandBlocks.forEach(b => out.push({ li: `<li><b>${hl(b.b, b.h)}</b>: ${esc(b.t)}${cites(r, b.cites)}</li>` }));
    }
    if (i === 'compare') {
      out.push({ html: `<table><thead><tr><th></th>${a.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${a.brandBlocks.map(b => {
        const vague = b.b === 'pnc' && r.pnc.facts === 'memory';
        return `<tr><td>${hl(b.b, b.h)}${cites(r, b.cites)}${b.b === 'pnc' && r.pnc.facts === 'schema' ? '<span class="ldb" data-tt="Values taken from PNC’s JSON-LD">schema</span>' : ''}</td>${b.cells.map(x => `<td>${vague ? '<span class="vag" data-tt="No PNC source was read, so the model hedged">Not confirmed; check pnc.com</span>' : esc(x)}</td>`).join('')}</tr>`;
      }).join('')}</tbody></table>`, wait: 400 });
      if (a.verdict) out.push({ html: `<p><b>${m === 'claude' ? 'My take' : 'Bottom line'}:</b> ${esc(a.verdict)}</p>` });
    }
    if (i === 'txn') {
      const [first, ...rest] = a.brandBlocks;
      if (first) { out.push({ html: head(m === 'claude' ? 'Where I’d start' : 'Best place to start') }); out.push({ html: `<div class="cta"><span class="lg">${favDom(BRANDS[first.b].dom)}</span><span class="cx"><b>${hl(first.b, first.h)}</b><span>${esc(first.t)}${cites(r, first.cites)}</span></span><span class="go">${esc(first.cta)} ↗</span></div>`, wait: 300 }); }
      if (rest.length) out.push({ html: `<p class="alt" style="margin-bottom:4px"><b>Also worth a look:</b></p><ul class="alt">${rest.map(b => `<li><b>${hl(b.b, b.h)}</b>: ${esc(b.t)}${cites(r, b.cites)}</li>`).join('')}</ul>` });
      out.push({ html: head('What you’ll need') }); out.push({ html: '<ol>' + a.steps.map(s => `<li>${esc(s)}</li>`).join('') + '</ol>' });
    }
    if (m === 'chatgpt') out.push({ html: '<p>If you want, I can compare fees side by side or check what’s available near you.</p>' });
    if (m === 'claude') out.push({ html: '<p>One caveat: fees, rates and offers change often, so confirm current terms directly before you decide.</p>' });
    const srcs = r.citedOrdered;
    if (srcs.length) {
      if (m === 'copilot') out.push({ html: `<div class="learn">Learn more: ${srcs.map((s, j) => `<a class="${isPnc(s) ? 'pnc' : ''}" data-peek="${s.id}" data-tt="${esc(s.t)}"><em>${j + 1}</em>${fav(s)}${esc(s.dom)}</a>`).join('')}</div><div class="fups">${['Which is best for me?', 'Show fees side by side', 'Find a branch near me'].map(x => `<span>${x}</span>`).join('')}</div>` });
      else out.push({ html: `<div class="srcs">${m === 'chatgpt' ? `<div class="srcbtn"><span class="st">${srcs.slice(0, 4).map(fav).join('')}</span>Sources</div>` : '<div style="font:600 13.5px var(--body);color:#555">Sources</div>'}<div class="srccards">${srcs.map(s => `<div class="srccard ${isPnc(s) ? 'pnc' : ''}" data-peek="${s.id}"><div class="d">${fav(s)}${esc(shortDom(s))}</div><b>${esc(s.t)}</b></div>`).join('')}</div></div>` });
    }
    out.push({ html: '<div class="actions"><i></i><i></i><i></i></div>', wait: 0 });
    return out;
  }
  function buildAIO(r) {
    const a = r.answer, out = [], i = r.i, list = (bs) => bs.map(b => BRANDS[b].n).join(', ').replace(/, ([^,]*)$/, ' and $1');
    const summary = { info: a.blocks[0].t, rec: `Top options for ${r.sc.catP} often include ${list(r.order)}, depending on your priorities.`, compare: `${list(r.order)} differ mainly on ${r.sc.cols.slice(0, 2).join(' and ').toLowerCase()}.`, txn: `You can usually ${/loan|lender/.test(r.sc.cat) ? 'apply' : 'get started'} online in a few minutes. Here’s what to have ready and where to start.` }[i];
    out.push({ stream: summary });
    out.push({ html: '<ul class="bl"></ul>', wait: 10 });
    if (i === 'info') a.blocks.slice(1).forEach(b => out.push({ li: `<li><b>${esc(b.h)}:</b> ${esc(b.t)}${cites(r, b.cites)}</li>` }));
    a.brandBlocks.forEach(b => out.push({ li: `<li><b>${hl(b.b, b.h)}:</b> ${esc(i === 'compare' ? b.cells.slice(0, 2).join('; ') : b.t.split('. ')[0] + '.')}${cites(r, b.cites)}</li>` }));
    if (i === 'txn') out.push({ html: '<ol>' + a.steps.map(s => `<li>${esc(s)}</li>`).join('') + '</ol>' });
    out.push({ html: `<div class="aio-src">${r.citedOrdered.map(s => `<div class="srccard ${isPnc(s) ? 'pnc' : ''}" data-peek="${s.id}"><div class="d">${fav(s)}${esc(shortDom(s))}</div><b>${esc(s.t)}</b></div>`).join('')}</div>` });
    const citedIds = new Set(r.citedOrdered.map(s => s.id));
    out.push({ into: 'chat', html: `<div class="serp">${r.organic.slice(0, 7).map(s => `<div class="org-r ${isPnc(s) ? 'pnc' : ''}" data-peek="${s.id}"><div class="od">${fav(s)}<span><b>${esc(s.type === 'owned' ? 'PNC Bank' : shortDom(s))}</b><small>https://www.${esc(s.dom)}${esc((s.path || '').split('/').slice(0, 3).join(' › '))}</small></span><em class="pos">#${s.org}</em>${citedIds.has(s.id) ? '<em class="inaio">Cited in AI Overview</em>' : ''}</div><a>${esc(s.t)}</a><p>${esc((s.type === 'owned' ? 'PNC: ' : '') + (s.kind === 'persona' ? 'A guide for ' + r.P.aud + '. ' : '') + (s.m && s.m.length ? 'Mentions ' + s.m.map(x => BRANDS[x[0]].n).slice(0, 3).join(', ') + '.' : 'Read more about ' + r.sc.catP + '.'))}</p></div>`).join('')}</div>`, wait: 300 });
    return out;
  }

  /* ---------- peek modal ---------- */
  const modal = $('#peek');
  function openPeek(id, r) {
    r = r || (PR.on ? PR.peekR : null) || S.last; if (!r) return;
    const s = r.sources.find(x => x.id === id); if (!s) return;
    const ex = (r.extraction.find(e => e.s.id === id) || { ex: [] }).ex;
    let body = '';
    const head = `<div class="pk-h">${fav(s)}<div><b>${esc(s.t)}</b><small>${esc(s.dom + (s.path || ''))} · ${esc(kindLabel(s))}${s.status === 'cited' ? ' · <span style="color:#1E9E8A">cited</span>' : s.status === 'dropped' ? ' · <span style="color:#C2416B">dropped</span>' : ' · not cited'}</small></div><button class="pk-x" aria-label="Close">✕</button></div>`;
    if (s.type === 'affiliate' || (s.type === 'authority' && s.m && s.m.length)) {
      const hasP = s.m.some(x => x[0] === 'pnc');
      body = `<div class="pk-aff"><div class="pk-site" style="border-color:${(FAV_TILE[s.dom] || [favColor(s.dom)])[0]}"><small>${esc(s.dom)} · Updated November 2026 · Advertiser disclosure</small><h3>${esc(s.t)}</h3>${s.m.map((x, j) => `<div class="pk-item ${x[0] === 'pnc' ? 'pnc' : ''} ${x[2] === true ? 'bo' : ''}"><span class="pos">${j + 1}</span><div class="pk-b">${favDom(BRANDS[x[0]].dom)}<div><b>${esc(BRANDS[x[0]].n)}</b><small>${esc(x[1])}</small></div></div><span class="xt" data-tt="The model extracts this brand and its list position">extracted · #${j + 1}</span></div>`).join('')}</div>
        <div class="pk-note ${hasP ? 'ok' : 'miss'}">${hasP ? `PNC is on this list at #${s.m.findIndex(x => x[0] === 'pnc') + 1}${s.boosted ? ', added through affiliate outreach' : ''}. When this page is cited, PNC gets affiliate evidence weighted by list position.` : `<b>PNC isn’t on this list.</b> When ${esc(r.M.name)} cites this page, every brand above gets a vote and PNC gets none. ${s.boost ? 'Outreach to the publisher (accurate product data, review access) is how PNC gets added.' : ''}`}</div></div>`;
    } else if (s.type === 'social') {
      const vid = s.fmt === 'video';
      const items = s.m.map((x, j) => vid ? `<div class="pk-tr ${x[0] === 'pnc' ? 'pnc' : ''}"><span class="ts">${['1:12', '3:40', '6:05', '8:31', '10:02'][j] || '11:20'}</span><span>“${esc(x[3])}”</span><span class="xt s${x[1] === '+' ? 'p' : x[1] === '-' ? 'n' : 'm'}">${esc(BRANDS[x[0]].n)} · ${x[1] === '+' ? 'positive' : x[1] === '-' ? 'negative' : 'mixed'}</span></div>`
        : `<div class="pk-cm ${x[0] === 'pnc' ? 'pnc' : ''} ${x[4] ? 'bo' : ''}"><div class="up">▲<b>${x[2] * 7 + 3}</b></div><div><small>u/${['budgetnerd', 'finance_throwaway', 'midwestmoney', 'quietsaver', 'smallbizdad'][j % 5]}${x[4] ? ' <em class="flair">customer story</em>' : ''}</small><p>${esc(x[3])}</p><span class="xt s${x[1] === '+' ? 'p' : x[1] === '-' ? 'n' : 'm'}">${esc(BRANDS[x[0]].n)} · ${x[1] === '+' ? 'positive' : x[1] === '-' ? 'negative' : 'mixed'} · ${x[2]} similar</span></div></div>`).join('');
      const pm = s.m.find(x => x[0] === 'pnc');
      body = `<div class="pk-soc">${vid ? `<div class="pk-vid">${fav(s)}<div><b>${esc(s.t)}</b><small>${esc(s.dom)} · 184K views · transcript excerpts the model read</small></div></div>` : `<div class="pk-thread">${fav(s)}<div><small>${esc((s.path || '').replace('/', '') || s.dom)} · 412 comments</small><h3>${esc(s.t)}</h3></div></div>`}${items}
        <div class="pk-note ${pm && pm[1] === '+' ? 'ok' : 'miss'}">${pm ? (pm[1] === '+' ? `A positive PNC mention ${s.boosted ? 'from community participation ' : ''}gives ${esc(r.M.name)} social proof. ${esc(r.M.name)} weights social evidence ×${r.M.soc}.` : `PNC is mentioned but the sentiment is ${pm[1] === '-' ? 'negative' : 'lukewarm'}, so it adds little. Authentic customer stories and helpful, disclosed answers from PNC shift this.`) : `<b>PNC doesn’t come up in this ${vid ? 'video' : 'thread'}.</b> Models read communities for “what real people use.” Creator partnerships and genuine participation are how PNC enters the conversation.`}</div></div>`;
    } else if (s.type === 'owned' && s.kind !== 'local') {
      const js = s.issue === 'js' && !r.M.renders;
      body = `<div class="pk-own"><div class="pk-cols"><div><div class="pk-lbl">What ${js ? esc(r.M.bots[0]) + ' receives' : 'the page says'}</div>${js ? `<pre class="html">&lt;body&gt;\n  &lt;div id="root"&gt;&lt;/div&gt;\n  &lt;script src="/etc/clientlibs/app.bundle.js"&gt;&lt;/script&gt;\n&lt;/body&gt;</pre><p class="pk-note miss">The visible content is built by JavaScript, which ${esc(r.M.name)}’s fetcher doesn’t run. ${s.schemaOn ? '<b>But the JSON-LD in the &lt;head&gt; is still readable.</b>' : 'With no schema, nothing reaches the model.'}</p>` : pageMock(r, s)}</div><div><div class="pk-lbl">${s.schemaOn ? 'JSON-LD in the &lt;head&gt; (what the model parses)' : 'Structured data'}</div>${s.schemaOn ? `<pre class="json">${jsonHTML(schemaFor(r.t, r.p, s), SCHEMA_HOT)}</pre>` : '<p class="pk-note miss">No schema on this page. The model has to infer facts from page text, if it can read the text at all.</p>'}</div></div></div>`;
    } else if (s.type === 'competitor') {
      body = `<div class="pk-note">A competitor’s own product page. It gives ${esc(BRANDS[s.brand].n)} first-party evidence (fees, features, offers) the same way pnc.com does for PNC.</div>`;
    } else {
      body = `<div class="pk-note">${s.kind === 'local' ? 'Local listing (Google Business Profile). Used for “near me” and transactional prompts: hours, reviews, address and booking links.' : 'Authority source used for facts and definitions. It doesn’t recommend brands, but it shapes how the answer frames the topic, so PNC content that agrees with it is more trusted.'}</div>`;
    }
    $('.pk-in', modal).innerHTML = head + body + (ex.length ? `<div class="pk-ex"><b>Extracted from this page</b>${ex.map(e => `<span>${favDom(BRANDS[e.b].dom)}${esc(BRANDS[e.b].n)} · ${e.kind === 'fp' ? 'first-party' : e.kind === 'soc' ? 'social ' + e.sent : 'list #' + e.pos} · weight ${e.w.toFixed(2)}</span>`).join('')}</div>` : '');
    modal.classList.add('on'); $('.pk-x', modal).focus();
  }
  function pageMock(r, s) {
    const T = r.T || TOPICS[r.t], prod = (T.products[segFor(r.t, r.p)] || T.products.default).pnc;
    return `<div class="pmk"><div class="pmk-top">${pncLogo('#333F48')}</div><small class="bc">Home › ${esc(T.name)} › ${esc(s.kind === 'offer' ? 'Bonus offer' : s.kind === 'product' ? prod[0] : 'Insights')}</small><h4>${esc(s.t)}</h4><p>${esc(s.kind === 'offer' ? 'New checking customers can earn a cash bonus with qualifying direct deposits. See how to qualify, eligible accounts and full terms.' : s.kind === 'persona' ? T.pp[s.aud] + ' ' + s.line : s.kind === 'article' ? (T.points.default[0][1]) : prod[1])}</p>${s.kind === 'offer' ? `<div class="pmk-f"><div><small>Offer</small><b>Cash bonus</b></div><div><small>How to qualify</small><b>Qualifying direct deposits</b></div><div><small>Eligible</small><b>New checking customers</b></div></div><span class="pmk-cta">Open an account</span>` : s.kind === 'product' ? `<div class="pmk-f">${T.cols.map((c, j) => `<div><small>${esc(c)}</small><b>${esc(prod[2 + j])}</b></div>`).join('')}</div><span class="pmk-cta">Apply now</span>` : `<span class="pmk-tag">${s.kind === 'persona' ? 'Written for ' + esc(PERSONAS[s.aud].aud) : 'General audience'}</span>`}</div>`;
  }
  document.addEventListener('click', e => {
    const pk = e.target.closest('[data-peek]');
    if (pk) { const host = pk.closest('[data-rid]'); openPeek(pk.dataset.peek, host ? VS.rs[host.dataset.rid] : null); return; }
    if (e.target === modal || e.target.closest('.pk-x')) modal.classList.remove('on');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('on'); if (e.key === 'Enter' && e.target.matches('.mx-r[data-peek]')) openPeek(e.target.dataset.peek); });

  /* ---------- scorecard ---------- */
  function paintScore(r) {
    const st = mentionStats(S.m, S.t, S.p, S.i, 20, S.L), p = r.pnc;
    const t1 = p.mentioned
      ? `<div class="tile hit"><small>PNC in this answer</small><div class="bigv">#${p.rank}<span>of ${p.of} brand${p.of === 1 ? '' : 's'}</span></div><div class="note">${p.named ? 'Named in the prompt, so the model had to address PNC.' : p.memOnly ? 'Named from training memory, with no citation behind it.' : 'Earned from cited evidence.'}</div><span class="flag ${p.memOnly ? 'w' : 'g'}">${p.memOnly ? '⚠ Uncited mention' : p.named ? '✓ Branded prompt' : '✓ Earned mention'}</span></div>`
      : `<div class="tile miss"><small>PNC in this answer</small><div class="bigv">Not named</div><div class="note">PNC didn’t clear the evidence bar on this run.</div><span class="flag w">✕ Visibility gap</span></div>`;
    const ownedList = r.citedOrdered.filter(isPnc).map(s => kindLabel(s));
    const t2 = `<div class="tile"><small>PNC pages cited</small><div class="bigv">${p.ownedCited}<span>of ${p.totalCited} citations</span></div><div class="note">${ownedList.length ? esc(ownedList.join(', ')) : 'No pnc.com page was cited.'}</div><span class="flag ${p.facts === 'schema' ? 'g' : p.facts === 'memory' ? 'w' : 'n'}">PNC facts from: ${{ schema: 'schema', page: 'page text', 'third-party': 'third parties', memory: 'memory' }[p.facts]}</span></div>`;
    const pct = Math.round(st.rate * 100);
    const t3 = `<div class="tile"><small>Mention rate · 20 runs</small><div class="ringw"><div class="ring" style="--p:${pct}"><b>${pct}%</b></div><div class="note" style="margin:0">Same settings, sampled 20 times.${st.avgRank ? ` Average position <b style="color:var(--dg)">#${st.avgRank.toFixed(1)}</b>.` : ''}</div></div></div>`;
    const ev = [['First-party', '#EF6A00', p.fp], ['Affiliate', '#2A6AB0', p.aff], ['Social', '#8A5CC2', p.soc], ['Memory', '#9aa4ab', p.mem]], evT = ev.reduce((x, y) => x + y[2], 0) || 1;
    const t4 = `<div class="tile"><small>Where PNC’s evidence came from</small><div class="mixbar">${ev.filter(x => x[2] > .005).map(x => `<i style="width:${x[2] / evT * 100}%;background:${x[1]}" data-tt="<b>${x[0]}</b> ${x[2].toFixed(2)}"></i>`).join('')}</div><div class="mixleg">${ev.map(x => `<span><i style="background:${x[1]}"></i>${x[0]} <em>${Math.round(x[2] / evT * 100)}%</em></span>`).join('')}</div></div>`;
    const imp = Object.keys(LEVERS).map(k => {
      const a = mentionStats(S.m, S.t, S.p, S.i, 20, Object.assign({}, S.L, { [k]: !S.L[k] })).rate;
      const on = S.L[k] ? st.rate : a, off = S.L[k] ? a : st.rate;
      return { k, on, off, d: Math.round((on - off) * 100) };
    });
    const t5 = `<div class="tile wide"><small>Lever impact on PNC mention rate · ${esc(r.M.name)}</small>${imp.map(x => `<div class="imp"><span class="nm">${LEVERS[x.k].n}</span><span class="tr"><i class="off" style="width:${x.off * 100}%" data-tt="${LEVERS[x.k].off}: ${Math.round(x.off * 100)}%"></i><i class="on" style="left:${Math.min(x.on, x.off) * 100}%;width:${Math.abs(x.on - x.off) * 100}%" data-tt="${LEVERS[x.k].on}: ${Math.round(x.on * 100)}%"></i></span><b class="${x.d > 0 ? 'up' : x.d < 0 ? 'dn' : ''}">${x.d > 0 ? '+' : ''}${x.d} pts</b></div>`).join('')}<div class="note" style="margin-top:6px">Gray = lever off, orange = added by the lever. Same 20 seeds, one lever flipped.</div></div>`;
    const tot = r.citedOrdered.length || 1, mixE = Object.entries(SRC_TYPES).filter(([k]) => r.mix[k] > 0);
    const t6 = `<div class="tile wide"><small>Who shaped this answer · citations by source type</small><div class="mixbar">${mixE.map(([k, t]) => `<i style="width:${r.mix[k] / tot * 100}%;background:${t.c}" data-tt="<b>${t.n}</b><br>${r.mix[k]} of ${tot}"></i>`).join('')}</div><div class="mixleg">${mixE.map(([k, t]) => `<span><i style="background:${t.c}"></i>${t.n} <em>${r.mix[k]}</em></span>`).join('')}</div><div class="favrow">${r.citedOrdered.map(s => `<span data-peek="${s.id}" data-tt="${esc(s.dom)}">${fav(s)}</span>`).join('')}</div></div>`;
    let alert = '';
    if (p.partial.length) alert += `<div class="alert ok"><b class="k">Schema win</b><span><b>${esc(p.partial[0].path)}</b> renders with JavaScript, but ${esc(r.M.name)} still read its JSON-LD. Without schema this page would have been dropped.</span></div>`;
    if (p.dropped.length) alert += `<div class="alert"><b class="k">Fix</b><span><b>${esc(p.dropped[0].path)}</b> was invisible to ${esc(r.M.name)}: JavaScript-rendered with no schema in this scenario.</span></div>`;
    $('#score').innerHTML = `<div class="score-h"><div><div class="eyebrow">Run ${S.seed + 1} · ${esc(r.M.name)} · ${esc(r.T.short)} · ${esc(r.P.short)} · ${esc(r.I.name)}</div><h3>What this run means for PNC</h3></div><p>Flip a lever above and run again to see it move.</p></div><div class="tiles">${t1}${t2}${t3}${t4}</div><div class="tiles two">${t5}${t6}</div>${alert}<div class="score-h" style="margin-top:22px"><h3 style="font-size:21px">AEO actions for this journey</h3></div><div class="aeo">${actions(r, imp)}</div>`;
    $('#score').classList.add('show');
  }
  function actions(r, imp) {
    const p = r.pnc, M = r.M, T = r.T, out = [], d = (k) => imp.find(x => x.k === k).d, sg = (v) => (v >= 0 ? '+' : '') + v;
    const pg = r.sources.find(s => s.kind === 'product');
    out.push(['Technical', 'Page-level schema', pg && pg.issue === 'js' ? `${esc(pg.path)} renders client-side. With JSON-LD in the static HTML, ${esc(M.name)} ${M.renders ? 'reads it even faster' : 'can still extract the product facts'}. Schema is worth <b>${sg(d('schema'))} pts</b> of mention rate here.` : `JSON-LD gives ${esc(M.name)} labeled facts (fees, features, audience, FAQ, dateModified). For this journey it’s worth <b>${sg(d('schema'))} pts</b>, and it makes PNC’s facts accurate when PNC is named.`]);
    if (r.p === 'general') out.push(['Content', 'General prompts need general strength', 'With no persona, only general content can match. Here the general SEO article and product page carry PNC, and big national brands win on training memory. Try a persona to see how targeted content changes the answer.']);
    else out.push(['Content', 'Persona-targeted content', `“${esc(T.ppages[r.p].t)}” speaks directly to ${esc(r.P.aud)}. ${p.personaPage ? 'It was cited in this run' + (p.generalArticle ? ' alongside the general article' : ', over the general article') + '.' : S.L.persona ? 'It wasn’t cited on this run; it competes on persona sub-queries.' : 'It’s switched off in this scenario.'} Worth <b>${sg(d('persona'))} pts</b> here.`]);
    const miss = r.extraction.filter(({ s, ex }) => (s.type === 'affiliate' || s.type === 'social') && !ex.some(e => e.b === 'pnc')).map(({ s }) => shortDom(s));
    out.push(['Off-site', 'Affiliate & social presence', `${miss.length ? `PNC is missing from cited pages on <b>${esc(miss.join(', '))}</b>.` : 'PNC appears on every cited third-party page.'} ${esc(M.name)} weights affiliate mentions ×${M.aff} and social ×${M.soc}. Outreach is worth <b>${sg(d('third'))} pts</b> here.`]);
    out.push(['model', 'What moves ' + M.name, esc(M.lever)]);
    return out.map(([lv, h, t]) => `<div class="aeo-c ${lv}"><div class="lv">${lv === 'model' ? `<span style="width:16px;height:16px;display:inline-block;background:#fff;border-radius:4px;padding:1px">${modelLogo(S.m)}</span>For ${esc(M.name)}` : LEVER_ICON[lv] + lv}</div><h4>${h}</h4><p>${t}</p></div>`).join('');
  }

  /* ---------- schema lab ---------- */
  function paintSchemaLab() {
    const T = TOPICS[S.t], seg = segFor(S.t, S.p), page = T.pages[seg] || T.pages.default;
    const pages = [{ id: 'pncp', kind: 'product', path: page.path, t: page.t, js: !!page.js }, { id: 'pncg', kind: 'article', path: T.article.path, t: T.article.t }];
    if (S.p !== 'general') pages.push({ id: 'pncA', kind: 'persona', path: T.ppages[S.p].path, t: T.ppages[S.p].t, aud: S.p, line: T.ppages[S.p].line });
    if (!pages.some(x => x.id === S.schemaPage)) S.schemaPage = 'pncp';
    const pgSel = pages.find(x => x.id === S.schemaPage), on = S.L.schema;
    const s = { dom: 'pnc.com', path: pgSel.path, t: pgSel.t, kind: pgSel.kind, aud: pgSel.aud, line: pgSel.line, schemaOn: on };
    $('#slTabs').innerHTML = pages.map(x => `<button data-id="${x.id}" class="${x.id === S.schemaPage ? 'on' : ''}">${esc(kindLabel(x))}${x.js ? ' <em>JS</em>' : ''}</button>`).join('') + `<span class="seg sm" data-lever="schema"><button data-v="0" class="${!on ? 'on' : ''}">Without schema</button><button data-v="1" class="${on ? 'on' : ''}">With schema</button></span>`;
    $('#slPage').innerHTML = pageMock({ T, t: S.t, p: S.p }, s);
    const head = `&lt;head&gt;\n  &lt;title&gt;${esc(pgSel.t)}&lt;/title&gt;\n  &lt;meta name="description" content="…"&gt;${on ? '\n  <span class="hl">&lt;script type="application/ld+json"&gt; { … } &lt;/script&gt;</span>' : ''}\n&lt;/head&gt;`;
    $('#slHtml').innerHTML = `<pre class="html">${head}\n&lt;body&gt;\n${pgSel.js ? '  &lt;div id="root"&gt;&lt;/div&gt;   <span class="cm">← filled by JavaScript</span>\n  &lt;script src="/app.bundle.js"&gt;&lt;/script&gt;' : `  &lt;h1&gt;${esc(pgSel.t)}&lt;/h1&gt;\n  &lt;p&gt;…&lt;/p&gt;`}\n&lt;/body&gt;</pre>` + (on ? `<pre class="json small">${jsonHTML(schemaFor(S.t, S.p, s), SCHEMA_HOT)}</pre>` : '<p class="sl-none">No JSON-LD on this page.</p>');
    const facts = [['Product / topic', 'name'], ['Fees & terms', 'fees'], ['Key features', 'feat'], ['Audience', 'aud'], ['FAQ answers', 'faq'], ['Last updated', 'date']];
    const cell = (M, f) => {
      const body = !pgSel.js || M.renders;
      if (f === 'aud') { if (pgSel.kind === 'article') return ['na', 'Not applicable: general audience']; if (on) return ['y', 'Explicit audience in schema']; return body ? ['p', 'Inferred from page text'] : ['n', 'Not visible']; }
      if (f === 'date') return on ? ['y', 'dateModified in schema'] : body ? ['p', 'Maybe, if a date is printed'] : ['n', 'Not visible'];
      if (f === 'faq') return on ? ['y', 'FAQPage Q&A pairs'] : body ? ['p', 'Scraped from accordion text'] : ['n', 'Not visible'];
      if (on) return ['y', 'Labeled field in JSON-LD'];
      return body ? ['p', 'Scraped from page text'] : ['n', 'Page body is empty to this crawler'];
    };
    $('#slMatrix').innerHTML = `<div class="slm" style="--n:${Object.keys(MODELS).length}"><div class="slm-r h"><span></span>${Object.keys(MODELS).map(k => `<span data-tt="${MODELS[k].name}">${modelLogo(k)}</span>`).join('')}</div>${facts.map(([n, f]) => `<div class="slm-r"><span>${n}</span>${Object.values(MODELS).map(M => { const [c, t] = cell(M, f); return `<span><i class="fx ${c}" data-tt="<b>${M.name}</b><br>${t}">${{ y: '✓', p: '◐', n: '✕', na: '·' }[c]}</i></span>`; }).join('')}</div>`).join('')}<div class="slm-r tot"><span>Facts reliably extracted</span>${Object.values(MODELS).map(M => { const n = facts.filter(([, f]) => cell(M, f)[0] === 'y').length, d2 = facts.filter(([, f]) => cell(M, f)[0] !== 'na').length; return `<span><b>${n}/${d2}</b></span>`; }).join('')}</div></div><div class="leg dk"><span><i class="fx y">✓</i>Reliable (structured)</span><span><i class="fx p">◐</i>Inferred from text</span><span><i class="fx n">✕</i>Not visible</span></div>`;
    $('#slNote').innerHTML = pgSel.js ? (on ? `<b>This is where schema pays off.</b> The page body is built with JavaScript, so ChatGPT, Claude and Copilot see an empty &lt;div&gt;. The JSON-LD in the &lt;head&gt; is plain text, so every model still gets the facts.` : `<b>Without schema, this page is invisible</b> to ChatGPT, Claude and Copilot because their fetchers don’t run JavaScript. Only Google’s rendered index (Gemini, AI Overviews) sees it.`)
      : pgSel.kind === 'persona' ? `Schema turns “who this is for” into a labeled fact: <code>audience.audienceType = "${esc(PERSONAS[S.p].aud)}"</code>. That’s what lets a model match this page to a ${esc(PERSONAS[S.p].short.toLowerCase())} prompt with confidence.`
      : `Readable either way, but schema turns scraped text into labeled fields, so fees and features are quoted accurately and Gemini and AI Overviews (which lean on structured data) rank it higher.`;
  }
  $('#slTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.closest('[data-lever]')) return; S.schemaPage = b.dataset.id; paintSchemaLab(); });

  /* ---------- variability ---------- */
  const RAMP = [['#FDEBDD', '#7a3500'], ['#F9C9A1', '#7a3500'], ['#F5A262', '#5a2700'], ['#EF6A00', '#2b1300'], ['#A84A00', '#fff']];
  const rampOf = (v) => RAMP[Math.min(4, Math.floor(v * 5 - 1e-9))] || RAMP[0];
  const ALL_ON = { schema: true, persona: true, third: true };
  $('#heatTabs').innerHTML = Object.entries(MODELS).map(([k, m]) => `<button data-k="${k}">${modelLogo(k)}${m.name}</button>`).join('');
  $('#heatTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.heatModel = b.dataset.k; paintVariability(); });
  $('#heatScale').innerHTML = '<span>0%</span>' + RAMP.map(r => `<i style="background:${r[0]}"></i>`).join('') + '<span>100% of runs name PNC</span>';
  function paintVariability() {
    const hm = S.heatModel;
    $$('#heatTabs button').forEach(b => b.classList.toggle('on', b.dataset.k === hm));
    $('#heatTitle').textContent = `PNC mention rate · ${TOPICS[S.t].name}`;
    let h = '<div class="hh"></div>' + Object.values(INTENTS).map(x => `<div class="hh">${x.short}</div>`).join('');
    PERSONA_ORDER.forEach(pk => {
      const P = PERSONAS[pk];
      h += `<div class="rh">${avIc(pk)}${P.short}</div>`;
      Object.keys(INTENTS).forEach(ik => {
        const st = mentionStats(hm, S.t, pk, ik, 20, S.L), [bg, fg] = rampOf(st.rate), cur = pk === S.p && ik === S.i && hm === S.m;
        h += `<button class="cell ${cur ? 'is-cur' : ''}" style="background:${bg};color:${fg}" data-p="${pk}" data-i="${ik}" data-tt="<b>${MODELS[hm].name} · ${P.short} · ${INTENTS[ik].short}</b><br>PNC named in ${Math.round(st.rate * 100)}% of 20 runs${st.avgRank ? '<br>Average position #' + st.avgRank.toFixed(1) : ''}<br><em>Click to load in simulator</em>">${Math.round(st.rate * 100)}%${st.avgRank ? `<small>avg #${st.avgRank.toFixed(1)}</small>` : ''}</button>`;
      });
    });
    $('#heat').innerHTML = h;
    $('#cmpTitle').textContent = `Across models: ${TOPICS[S.t].short} · ${PERSONAS[S.p].short} · ${INTENTS[S.i].short}`;
    $('#cmpSub').innerHTML = `“${esc(buildScenario(S.t, S.p, S.i, S.L).prompt)}”`;
    const rows = Object.keys(MODELS).map(mk => ({ mk, st: mentionStats(mk, S.t, S.p, S.i, 20, S.L), pot: mentionStats(mk, S.t, S.p, S.i, 20, ALL_ON) }));
    $('#cmp').innerHTML = rows.map(({ mk, st, pot }) => `<div class="mrow"><div class="mn">${modelLogo(mk)}${MODELS[mk].name}</div><div><div class="mbar"><span class="tr"><b class="pot" style="width:${pot.rate * 100}%" data-tt="All three levers on: ${Math.round(pot.rate * 100)}%"></b><i style="width:${st.rate * 100}%"></i></span><span class="v">${Math.round(st.rate * 100)}% named<small>${pot.rate > st.rate ? `→ ${Math.round(pot.rate * 100)}% with all levers` : st.avgRank ? 'avg position #' + st.avgRank.toFixed(1) : 'never named'}</small></span></div><div class="runs">${st.runs.map((rk, j) => `<i class="${rk ? 'y r' + Math.min(4, rk) : ''}" data-tt="Run ${j + 1}: ${rk ? 'PNC named #' + rk : 'PNC not named'}">${rk || ''}</i>`).join('')}</div></div></div>`).join('') + '<div class="leg lt"><span><i style="background:var(--orange)"></i>Current settings</span><span><i style="background:#fbd4b3"></i>Potential with all three levers on</span></div>';
    const sorted = rows.slice().sort((a, b) => b.st.rate - a.st.rate), best = sorted[0], worst = sorted[sorted.length - 1], spread = Math.round((best.st.rate - worst.st.rate) * 100);
    const bigLift = rows.slice().sort((a, b) => (b.pot.rate - b.st.rate) - (a.pot.rate - a.st.rate))[0];
    $('#cmpInsight').innerHTML = (spread < 10 ? `All five models land within ${spread} pts here. ` : `<b>${MODELS[best.mk].name}</b> names PNC in ${Math.round(best.st.rate * 100)}% of runs and <b>${MODELS[worst.mk].name}</b> in ${Math.round(worst.st.rate * 100)}%, a ${spread}-point spread for the same question. `) + (bigLift.pot.rate - bigLift.st.rate > .05 ? `The biggest opportunity is <b>${MODELS[bigLift.mk].name}</b> (+${Math.round((bigLift.pot.rate - bigLift.st.rate) * 100)} pts with all levers), because it ${esc(MODELS[bigLift.mk].tip)}` : '');
  }
  $('#heat').addEventListener('click', e => {
    const b = e.target.closest('.cell'); if (!b) return;
    S.p = b.dataset.p; S.i = b.dataset.i; S.m = S.heatModel; repaintDD(); onChange();
    document.getElementById('sim').scrollIntoView({ behavior: 'smooth' }); setTimeout(() => run(false), 700);
  });

  /* =====================================================================
     PRESENTATION MODE
     ===================================================================== */
  const PR = { on: false, step: 0, phase: 'pick', k: 0, r: null, token: 0, peekR: null };
  const PR_PICK = [['m', 'Choose a model', 'Which AI assistant is the customer using?'], ['t', 'Choose a product topic', 'What is the customer researching?'], ['p', 'Choose a persona', 'Who is asking? Personas carry memory and audience signals.'], ['i', 'Choose an intent', 'What does the customer want from the answer?']];
  const prEl = $('#pres');
  function prOpen() { PR.on = true; PR.step = 0; PR.phase = 'pick'; prEl.hidden = false; document.body.classList.add('noscroll'); $('#prMain').innerHTML = ''; prRender(); }
  function prClose() { PR.on = false; PR.token++; PR.peekR = null; prEl.hidden = true; document.body.classList.remove('noscroll'); repaintDD(); onChange(); }
  $$('[data-open="pres"]').forEach(b => b.addEventListener('click', prOpen));
  $('#prExit').addEventListener('click', prClose);
  function prProgress() {
    const labels = ['Model', 'Topic', 'Persona', 'Intent', 'Answer', 'Retrieval'];
    const at = PR.phase === 'pick' ? PR.step : PR.phase === 'front' ? 4 : 5;
    $('#prSteps').innerHTML = labels.map((l, j) => `<span class="${j < at ? 'done' : j === at ? 'on' : ''}"><i>${j < at ? '✓' : j + 1}</i>${l}</span>`).join('');
  }
  function prRender() {
    prProgress();
    const main = $('#prMain'), back = $('#prBack'), next = $('#prNext');
    if (PR.phase === 'pick') {
      const [key, title, sub] = PR_PICK[PR.step], opts = OPTS[key]();
      const sel = { m: S.m, t: S.t, p: S.p, i: S.i }[key];
      main.innerHTML = `<div class="pr-pick"><div class="pr-q"><span class="pr-n">Step ${PR.step + 1} of 4</span><h2>${title}</h2><p>${sub}</p></div><div class="pr-grid g-${key}">${opts.map(o => `<button class="pr-card ${o.k === sel ? 'on' : ''}" data-k="${o.k}">${o.big}<b>${o.b}</b><small>${esc(key === 'p' ? PERSONAS[o.k].who : o.s)}</small>${key === 'p' ? `<em>${esc(PERSONAS[o.k].blurb)}</em>` : key === 'i' ? `<em>${esc(o.d)}</em>` : ''}</button>`).join('')}</div>${PR.step === 3 ? `<div class="pr-sum">${avIc(S.p)}<span><b>${esc(MODELS[S.m].name)}</b> · ${esc(TOPICS[S.t].name)} · ${esc(PERSONAS[S.p].name)}</span><q>${esc(buildScenario(S.t, S.p, S.i, S.L).prompt)}</q></div>` : ''}</div>`;
      $$('.pr-card', main).forEach(c => c.addEventListener('click', () => { S[key] = c.dataset.k; prRender(); }));
      back.hidden = PR.step === 0; back.textContent = '← Back';
      next.hidden = false; next.textContent = PR.step === 3 ? '▶ Run prompt' : 'Next →'; next.className = 'btn or pr-go' + (PR.step === 3 ? ' run' : '');
      return;
    }
    if (!$('.pr-flip', main)) {
      main.innerHTML = `<div class="pr-stage"><div class="pr-flip"><div class="pr-face front"><div class="pr-front-h">${avIc(S.p)}<div><small>What the customer sees</small><b>${esc(PERSONAS[S.p].name)} asks ${esc(MODELS[S.m].name)}</b></div></div><div class="device pr-dev">${DEVICE_HTML}</div><button class="btn or pr-how" id="prHow" hidden>How did ${esc(MODELS[S.m].name)} arrive at this answer? →</button></div><div class="pr-face backf"><div class="pr-rail" id="prRail"></div><div class="pr-bwrap"><div class="pr-panel" id="prPanel"></div><aside class="pr-levers" id="prLevers"></aside></div></div></div></div>`;
      $('#prHow').addEventListener('click', () => { PR.phase = 'back'; PR.k = 0; prRender(); });
    }
    $('.pr-flip', main).classList.toggle('flipped', PR.phase === 'back');
    back.hidden = false; back.textContent = PR.phase === 'front' ? '← Change selections' : PR.k === 0 ? '← Back to the answer' : '← Previous step';
    if (PR.phase === 'front') { next.hidden = true; return; }
    next.hidden = false; next.className = 'btn or pr-go'; next.textContent = PR.k < 6 ? `Next: ${PIPELINE[PR.k + 1].n} →` : 'Back to the answer ↺';
    prStage(true);
  }
  async function prAnswer(instant) {
    const tok = ++PR.token, live = () => tok === PR.token;
    PR.r = simulate(S.m, S.t, S.p, S.i, S.seed, S.L); PR.peekR = PR.r;
    const dev = $('.pr-dev'), view = chatView(dev, PR.r);
    const ctx = { sleep: (ms) => new Promise(res => setTimeout(res, ms)), live, instant: !!instant, status: view.status, spin };
    $('#prHow').hidden = true;
    await view.type(ctx); if (!live()) return;
    if (!instant) { for (const t of ['Thinking', PR.r.modelKey === 'aio' ? 'Searching' : 'Searching the web', 'Reading sources']) { view.status(spin(t)); await ctx.sleep(900); if (!live()) return; } }
    await view.stream(ctx); if (!live()) return;
    $('#prHow').hidden = false;
  }
  const STEP_METRIC = [
    r => r.p === 'general' ? 'No audience signal to match' : `Audience signal: ${r.P.aud}`,
    r => { const n = r.queries.filter(q => q.type === 'persona').length; return `${n} persona sub-quer${n === 1 ? 'y' : 'ies'} · persona page ${r.sc.src.some(s => s.kind === 'persona') ? 'available' : 'not available'}`; },
    r => { const o = r.sources.filter(isPnc), ok = o.filter(s => s.status !== 'dropped'), part = o.filter(s => s.partial).length; return `PNC pages readable: ${ok.length} of ${o.length}${part ? ` (${part} via JSON-LD only)` : ''} · with JSON-LD: ${o.filter(x => x.schemaOn).length}`; },
    r => { const c = r.cited.filter(isPnc); const best = r.sources.findIndex(isPnc); return `PNC pages in the top ${r.cited.length}: ${c.length}${best >= 0 ? ` · best rank #${best + 1}` : ''}`; },
    r => { const tp = r.extraction.filter(({ s }) => s.type === 'affiliate' || s.type === 'social'); const w = tp.filter(({ ex }) => ex.some(e => e.b === 'pnc')).length; return `Third-party pages naming PNC: ${w} of ${tp.length} · schema facts ${r.cited.some(s => isPnc(s) && s.schemaOn) ? 'parsed' : 'none'}`; },
    r => { const b = r.brandScores.find(x => x.b === 'pnc'); return `PNC evidence ${b.total.toFixed(2)} · ${r.pnc.mentioned ? 'in the answer at #' + r.pnc.rank : 'below the bar'}`; },
    r => `PNC ${r.pnc.mentioned ? 'named #' + r.pnc.rank + ' of ' + r.pnc.of : 'not named'} · facts from ${{ schema: 'schema', page: 'page text', 'third-party': 'third parties', memory: 'memory' }[r.pnc.facts]}`
  ];
  async function prStage(animate) {
    const k = PR.k, r = PR.r; PR.peekR = r;
    $('#prRail').innerHTML = PIPELINE.map((p, j) => `<button class="${j < k ? 'done' : j === k ? 'on' : ''}" data-k="${j}"><i>${j + 1}</i>${p.n}</button>`).join('');
    $$('#prRail button').forEach(b => b.addEventListener('click', () => { PR.k = +b.dataset.k; prRender(); }));
    const panel = $('#prPanel');
    panel.innerHTML = `<div class="pr-ph"><span class="pr-n">Step ${k + 1} of 7 · ${esc(SUB[k](r))}</span><h2>${PIPELINE[k].n}</h2><p>${PIPELINE[k].d}</p></div><div class="pr-body stg"><div class="stg-c"></div></div>`;
    const tok = ++PR.token, live = () => tok === PR.token;
    const ctx = { sleep: (ms) => animate ? new Promise(res => setTimeout(res, ms * .6)) : Promise.resolve(), live, log: () => { }, status: () => { }, spin, scroll: () => { }, instant: !animate };
    prLevers();
    await STAGES[k](r, $('.stg-c', panel), ctx);
  }
  function prLevers() {
    const k = PR.k, r = PR.r, now = STEP_METRIC[k](r);
    $('#prLevers').innerHTML = `<h3>AEO levers <small>at this step</small></h3><div class="pr-now"><small>PNC right now</small><b>${esc(now)}</b></div>` + Object.entries(LEVERS).map(([lk, l]) => {
      const rOn = simulate(S.m, S.t, S.p, S.i, S.seed, Object.assign({}, S.L, { [lk]: true })), rOff = simulate(S.m, S.t, S.p, S.i, S.seed, Object.assign({}, S.L, { [lk]: false }));
      const a = STEP_METRIC[k](rOff), b = STEP_METRIC[k](rOn), same = a === b;
      return `<div class="pr-lv ${same ? 'same' : ''}"><div class="pr-lv-h"><b>${l.n}</b>${leverSeg(lk)}</div>${same ? `<p class="pr-eff">No change at this step${k < 2 ? '. Levers act on what the model finds next.' : '.'}</p>` : `<div class="pr-cmp"><div><small>${esc(l.off)}</small>${esc(a)}</div><div class="on"><small>${esc(l.on)}</small>${esc(b)}</div></div>`}</div>`;
    }).join('') + '<p class="pr-tip">Toggle a lever to replay this step with the change.</p>';
  }
  PR.relever = () => { PR.r = simulate(S.m, S.t, S.p, S.i, S.seed, S.L); prStage(false); };
  $('#prNext').addEventListener('click', () => {
    if (PR.phase === 'pick') {
      if (PR.step < 3) { PR.step++; prRender(); return; }
      PR.phase = 'front'; S.seed = 0; $('#prMain').innerHTML = ''; prRender(); prAnswer(false); return;
    }
    if (PR.phase === 'back') {
      if (PR.k < 6) { PR.k++; prRender(); return; }
      PR.phase = 'front'; prRender(); prAnswer(true);
    }
  });
  $('#prBack').addEventListener('click', () => {
    if (PR.phase === 'pick') { if (PR.step > 0) { PR.step--; prRender(); } return; }
    if (PR.phase === 'front') { PR.token++; PR.phase = 'pick'; PR.step = 3; prRender(); return; }
    if (PR.phase === 'back') { if (PR.k > 0) { PR.k--; prRender(); } else { PR.phase = 'front'; prRender(); prAnswer(true); } }
  });
  document.addEventListener('keydown', e => {
    if (!PR.on || modal.classList.contains('on')) return;
    if (e.key === 'ArrowRight' && !$('#prNext').hidden) $('#prNext').click();
    if (e.key === 'ArrowLeft' && !$('#prBack').hidden) $('#prBack').click();
    if (e.key === 'Escape') prClose();
  });

  /* =====================================================================
     VS MODE
     ===================================================================== */
  const VS = { a: { m: 'chatgpt', p: 'student', L: { schema: false, persona: false, third: false } }, b: { m: 'chatgpt', p: 'student', L: { schema: true, persona: true, third: true } }, rs: {}, token: 0 };
  const LK = Object.keys(LEVERS);
  const VS_PRESETS = [
    ['Persona vs persona', () => { const m = VS.a.m, L = Object.assign({}, S.L); VS.a = { m, p: 'general', L }; VS.b = { m, p: VS.b.p === 'general' ? 'student' : VS.b.p, L: Object.assign({}, L) }; }],
    ['Model vs model', () => { const p = VS.a.p, L = Object.assign({}, S.L); VS.a = { m: 'chatgpt', p, L }; VS.b = { m: 'claude', p, L: Object.assign({}, L) }; }],
    ['Schema off vs on', () => lvPreset({ schema: false }, { schema: true })],
    ['Persona content off vs on', () => lvPreset({ persona: false }, { persona: true })],
    ['Outreach off vs on', () => lvPreset({ third: false }, { third: true })],
    ['All levers off vs on', () => lvPreset({ schema: false, persona: false, third: false }, { schema: true, persona: true, third: true })]
  ];
  function lvPreset(a, b) { const base = { schema: true, persona: true, third: false }; VS.b.m = VS.a.m; VS.b.p = VS.a.p === 'general' ? 'student' : VS.a.p; VS.a.p = VS.b.p; VS.a.L = Object.assign({}, base, a); VS.b.L = Object.assign({}, base, b); }
  const vsLeverHTML = (sd) => `<div class="vs-row"><span class="vs-k">Levers</span><div class="vs-levers">${LK.map(k => `<div class="vs-lvt"><span>${LEVERS[k].n}</span><span class="seg sm" data-vside="${sd}" data-vlk="${k}"><button data-v="0" class="${!VS[sd].L[k] ? 'on' : ''}">Off</button><button data-v="1" class="${VS[sd].L[k] ? 'on' : ''}">On</button></span></div>`).join('')}</div></div>`;
  const lvBadges = (L) => LK.map(k => `<span class="lvb ${L[k] ? 'on' : ''}" data-tt="${esc(LEVERS[k].n)}: ${L[k] ? esc(LEVERS[k].on) : esc(LEVERS[k].off)}">${{ schema: 'Schema', persona: 'Persona content', third: 'Outreach' }[k]} ${L[k] ? 'on' : 'off'}</span>`).join('');
  const vsEl = $('#vs');
  function vsOpen() { VS.t = VS.t || S.t; VS.i = VS.i || S.i; vsEl.hidden = false; document.body.classList.add('noscroll'); vsPaint(); }
  function vsClose() { vsEl.hidden = true; VS.token++; document.body.classList.remove('noscroll'); }
  $$('[data-open="vs"]').forEach(b => b.addEventListener('click', vsOpen));
  $('#vsExit').addEventListener('click', vsClose);
  function chipsHTML(kind, side, sel) {
    if (kind === 't') return Object.entries(TOPICS).map(([k, x]) => `<button class="vchip ${k === sel ? 'on' : ''}" data-set="t" data-k="${k}"><span class="ic it sm">${TOPIC_ICON[x.ic]}</span>${x.short}</button>`).join('');
    if (kind === 'i') return Object.entries(INTENTS).map(([k, x]) => `<button class="vchip ${k === sel ? 'on' : ''}" data-set="i" data-k="${k}"><span class="ic it sm">${INTENT_ICON[k]}</span>${x.name}</button>`).join('');
    if (kind === 'm') return Object.entries(MODELS).map(([k, x]) => `<button class="vchip ${k === sel ? 'on' : ''}" data-side="${side}" data-set="m" data-k="${k}"><span class="ic sm">${modelLogo(k)}</span>${x.name}</button>`).join('');
    return PERSONA_ORDER.map(k => `<button class="vchip pp ${k === sel ? 'on' : ''}" data-side="${side}" data-set="p" data-k="${k}">${avIc(k, 'sm')}${PERSONAS[k].short}</button>`).join('');
  }
  function vsPaint() {
    $('#vsShared').innerHTML = `<div class="vs-row"><span class="vs-k">Topic</span><div class="vchips">${chipsHTML('t', '', VS.t)}</div></div><div class="vs-row"><span class="vs-k">Intent</span><div class="vchips">${chipsHTML('i', '', VS.i)}</div></div>`;
    $('#vsPresets').innerHTML = '<span class="vs-k">Quick</span>' + VS_PRESETS.map(([n], j) => `<button class="vchip qp" data-preset="${j}">${n}</button>`).join('');
    ['a', 'b'].forEach(sd => { $(`#vsCfg-${sd}`).innerHTML = `<div class="vs-side-h"><span class="vs-tag">${sd.toUpperCase()}</span>${avIc(VS[sd].p)}<b>${esc(PERSONAS[VS[sd].p].short)} · ${esc(MODELS[VS[sd].m].name)}</b></div><div class="vs-row"><span class="vs-k">Model</span><div class="vchips">${chipsHTML('m', sd, VS[sd].m)}</div></div><div class="vs-row"><span class="vs-k">Persona</span><div class="vchips">${chipsHTML('p', sd, VS[sd].p)}</div></div>${vsLeverHTML(sd)}`; });
    const dm = VS.a.m !== VS.b.m, dp = VS.a.p !== VS.b.p, dl = LK.filter(k => VS.a.L[k] !== VS.b.L[k]);
    const parts = [dm && 'model', dp && 'persona', dl.length && (dl.length === 1 ? LEVERS[dl[0]].n.toLowerCase() : 'AEO levers')].filter(Boolean);
    const cmpHint = dl.length && VS.i === 'compare' ? ' <span class="vs-hint">Tip: in “Comparing options” PNC is named in the prompt, so it always appears. Try “Looking for recommendations” to see visibility move.</span>' : '';
    $('#vsNote').innerHTML = !parts.length ? 'A and B are identical. Change the model, persona or a lever on one side to compare.' : parts.length === 1 ? `Only the <b>${parts[0]}</b> differs, so every difference below comes from it.` : `<b>${parts.join(' and ')}</b> all differ, so the differences mix those effects.`;
    $('#vsNote').innerHTML += cmpHint;
  }
  vsEl.addEventListener('click', e => {
    const pr = e.target.closest('[data-preset]'); if (pr) { VS_PRESETS[+pr.dataset.preset][1](); vsPaint(); return; }
    const lb = e.target.closest('[data-vlk] button'); if (lb) { const g = lb.parentNode; VS[g.dataset.vside].L[g.dataset.vlk] = lb.dataset.v === '1'; vsPaint(); return; }
    const b = e.target.closest('[data-set]'); if (!b) return;
    const k = b.dataset.set, v = b.dataset.k;
    if (b.dataset.side) VS[b.dataset.side][k] = v; else VS[k] = v;
    vsPaint();
  });
  $('#vsRun').addEventListener('click', vsRun);
  async function vsRun() {
    const tok = ++VS.token, live = () => tok === VS.token;
    const rs = ['a', 'b'].map(sd => simulate(VS[sd].m, VS.t, VS[sd].p, VS.i, 0, VS[sd].L));
    VS.rs = { a: rs[0], b: rs[1] };
    $('#vsOut').innerHTML = `<div class="vs-cols">${['a', 'b'].map((sd, j) => `<div class="vs-col" data-rid="${sd}"><div class="vs-col-h"><span class="vs-tag">${sd.toUpperCase()}</span>${avIc(rs[j].p)}<div><b>${esc(rs[j].P.name)}</b><small><span class="ml">${modelLogo(rs[j].modelKey)}</span>${esc(rs[j].M.name)}</small><div class="lvbs">${lvBadges(rs[j].L)}</div></div></div><div class="device vs-dev">${DEVICE_HTML}</div><div class="vs-sum" id="vsSum-${sd}"></div></div>`).join('')}</div><div class="vs-diff" id="vsDiff"></div>`;
    $('#vsOut').scrollIntoView({ behavior: 'smooth', block: 'start' });
    const ctx = { sleep: (ms) => new Promise(res => setTimeout(res, ms / 1.5)), live, instant: false, spin };
    await Promise.all(rs.map(async (r, j) => {
      const sd = ['a', 'b'][j], view = chatView($(`[data-rid="${sd}"] .vs-dev`), r), c2 = Object.assign({}, ctx, { status: view.status });
      await view.type(c2); if (!live()) return;
      view.status(spin('Searching')); await c2.sleep(900); if (!live()) return;
      await view.stream(c2); if (!live()) return;
      $(`#vsSum-${sd}`).innerHTML = vsSummary(r);
    }));
    if (!live()) return;
    $('#vsDiff').innerHTML = vsDiff(rs[0], rs[1]);
  }
  function vsSummary(r) {
    const st = mentionStats(r.modelKey, r.t, r.p, r.i, 20, r.L), p = r.pnc;
    const ev = [['First-party', '#EF6A00', p.fp], ['Affiliate', '#2A6AB0', p.aff], ['Social', '#8A5CC2', p.soc], ['Memory', '#9aa4ab', p.mem]], evT = ev.reduce((x, y) => x + y[2], 0) || 1;
    return `<div class="vs-k2">Behind the answer</div>
      <div class="vs-out ${p.mentioned ? 'hit' : 'miss'}"><b>${p.mentioned ? `PNC #${p.rank} of ${p.of}` : 'PNC not named'}</b><span>${Math.round(st.rate * 100)}% mention rate over 20 runs</span></div>
      <div class="vs-blk"><small>Fan-out queries (${r.queries.length})</small><div class="vs-q">${r.queries.map(q => `<span class="${q.type === 'persona' ? 'per' : ''}">${esc(q.q)}</span>`).join('')}</div></div>
      <div class="vs-blk"><small>Cited sources (${r.citedOrdered.length})</small><div class="vs-src">${r.citedOrdered.map(s => `<span class="${isPnc(s) ? 'pnc' : ''}" data-peek="${s.id}">${fav(s)}${esc(s.type === 'owned' ? 'pnc · ' + s.kind : shortDom(s))}</span>`).join('')}</div></div>
      <div class="vs-blk"><small>Brands named</small><div class="vs-src">${r.order.map((b, j) => `<span class="${b === 'pnc' ? 'pnc' : ''}"><em>${j + 1}</em>${favDom(BRANDS[b].dom)}${esc(BRANDS[b].n)}</span>`).join('')}</div></div>
      <div class="vs-blk"><small>Where PNC’s evidence came from</small><div class="mixbar">${ev.filter(x => x[2] > .005).map(x => `<i style="width:${x[2] / evT * 100}%;background:${x[1]}" data-tt="<b>${x[0]}</b> ${x[2].toFixed(2)}"></i>`).join('')}</div><div class="mixleg">${ev.map(x => `<span><i style="background:${x[1]}"></i>${x[0]} <em>${Math.round(x[2] / evT * 100)}%</em></span>`).join('')}</div></div>`;
  }
  const evMini = (r) => { const p = r.pnc, ev = [['First-party', '#EF6A00', p.fp], ['Affiliate', '#2A6AB0', p.aff], ['Social', '#8A5CC2', p.soc], ['Memory', '#9aa4ab', p.mem]], t2 = ev.reduce((x, y) => x + y[2], 0) || 1; return `<span class="evm"><span class="mixbar sm">${ev.filter(x => x[2] > .005).map(x => `<i style="width:${x[2] / t2 * 100}%;background:${x[1]}" data-tt="<b>${x[0]}</b> ${x[2].toFixed(2)}"></i>`).join('')}</span><small>total evidence ${(p.fp + p.aff + p.soc + p.mem).toFixed(2)}</small></span>`; };
  function vsDiff(a, b) {
    const sa = mentionStats(a.modelKey, a.t, a.p, a.i, 20, a.L), sb = mentionStats(b.modelKey, b.t, b.p, b.i, 20, b.L);
    const only = (x, y, f) => x.filter(v => !y.some(w => f(w) === f(v)));
    const qa = only(a.queries, b.queries, q => q.q), qb = only(b.queries, a.queries, q => q.q);
    const ca = only(a.citedOrdered, b.citedOrdered, s => s.id), cb = only(b.citedOrdered, a.citedOrdered, s => s.id);
    const ba = a.order.filter(x => !b.order.includes(x)), bb = b.order.filter(x => !a.order.includes(x));
    const row = (lab, x, y, win) => `<div class="vd-r"><div class="vd-a ${win === 'a' ? 'win' : ''}">${x}</div><div class="vd-l">${lab}</div><div class="vd-b ${win === 'b' ? 'win' : ''}">${y}</div></div>`;
    const lst = (arr, f) => arr.length ? arr.map(f).join('') : '<em class="none">None</em>';
    const outcome = (r) => r.pnc.mentioned ? `PNC #${r.pnc.rank} of ${r.pnc.of}` : 'Not named';
    const w = (x, y) => x > y ? 'a' : y > x ? 'b' : '';
    const srcChip = (s) => `<span class="vq ${isPnc(s) ? 'pnc' : ''}">${fav(s)}${esc(s.type === 'owned' ? 'pnc · ' + s.kind : shortDom(s))}</span>`;
    const why = [];
    if (a.p !== b.p) why.push(`${a.p === 'general' || b.p === 'general' ? 'Only the persona side fans out persona sub-queries and can match a persona guide. ' : ''}Different personas pull different source pools and needs.`);
    if (a.modelKey !== b.modelKey) why.push(`${a.M.name} ${a.M.tip} ${b.M.name} ${b.M.tip}`);
    LK.filter(k => a.L[k] !== b.L[k]).forEach(k => { const on = a.L[k] ? 'A' : 'B'; why.push(`${on} has ${LEVERS[k].n.toLowerCase()} on (${LEVERS[k].d.replace(/\.$/, '')}). ${{ schema: 'Readable, labeled PNC facts lift PNC pages in ranking and make its details exact.', persona: 'The persona guide matches the persona sub-queries the model fans out.', third: 'PNC appears on more of the affiliate lists and threads the model reads, so more independent sources vote for PNC.' }[k]}`); });
    return `<h3>What changed between A and B</h3><div class="vd-hd"><span>${avIc(a.p, 'sm')}A · ${esc(a.P.short)} · ${esc(a.M.name)}</span><span></span><span>${avIc(b.p, 'sm')}B · ${esc(b.P.short)} · ${esc(b.M.name)}</span></div>
      ${row('PNC in the answer', outcome(a), outcome(b), w(a.pnc.mentioned ? 10 - a.pnc.rank : 0, b.pnc.mentioned ? 10 - b.pnc.rank : 0))}
      ${row('Mention rate · 20 runs', Math.round(sa.rate * 100) + '%', Math.round(sb.rate * 100) + '%', w(sa.rate, sb.rate))}
      ${row('PNC pages cited', a.pnc.ownedCited + ' of ' + a.pnc.totalCited, b.pnc.ownedCited + ' of ' + b.pnc.totalCited, w(a.pnc.ownedCited, b.pnc.ownedCited))}
      ${LK.some(k => a.L[k] !== b.L[k]) ? row('AEO levers', `<span class="lvbs">${lvBadges(a.L)}</span>`, `<span class="lvbs">${lvBadges(b.L)}</span>`) : ''}
      ${row('Where PNC’s evidence came from', evMini(a), evMini(b))}
      ${row('Persona sub-queries', a.queries.filter(q => q.type === 'persona').length, b.queries.filter(q => q.type === 'persona').length)}
      ${row('Queries only on this side', lst(qa, q => `<span class="vq ${q.type === 'persona' ? 'per' : ''}">${esc(q.q)}</span>`), lst(qb, q => `<span class="vq ${q.type === 'persona' ? 'per' : ''}">${esc(q.q)}</span>`))}
      ${row('Sources only on this side', lst(ca, srcChip), lst(cb, srcChip))}
      ${row('Brands only on this side', lst(ba, x => `<span class="vq ${x === 'pnc' ? 'pnc' : ''}">${favDom(BRANDS[x].dom)}${esc(BRANDS[x].n)}</span>`), lst(bb, x => `<span class="vq ${x === 'pnc' ? 'pnc' : ''}">${favDom(BRANDS[x].dom)}${esc(BRANDS[x].n)}</span>`))}
      ${why.length ? `<div class="insight" style="margin-top:14px"><b>Why:</b> ${esc(why.join(' '))}</div>` : ''}`;
  }

  /* ---------- how it works ---------- */
  const STEP_LEVER = ['Write for the implied need and the persona, in the customer’s words.', 'Cover every sub-query: entity, compare, persona, local, fresh.', 'Be crawlable, and put facts in JSON-LD so they survive JavaScript.', 'Rank organically and match the audience. AI Overviews cite page one.', 'Get named on affiliate lists and in community threads.', 'Get independent sources to agree about PNC.', 'Publish structured, extractable facts for tables and steps.'];
  $('#flow6').innerHTML = PIPELINE.map((p, i) => `<div class="f6"><div class="n">Step ${i + 1}</div><h4>${p.n}</h4><p>${p.d}</p><div class="lv"><b>AEO lever</b>${STEP_LEVER[i]}</div></div>`).join('');
  const meter = (v, n) => `<div class="meter">${Array.from({ length: n }, (_, j) => `<i class="${j < v ? 'on' : ''}"></i>`).join('')}</div>`;
  $('#models4').innerHTML = Object.entries(MODELS).map(([k, m]) => `<div class="mc"><div class="mc-h"><span class="lg">${modelLogo(k)}</span><div><b>${m.name}</b><small>${m.maker} · ${m.ver}</small></div></div><dl>
    <dt>Retrieval index</dt><dd>${esc(m.index)}</dd>
    <dt>Crawlers to allow</dt><dd class="bots">${m.bots.map(b => `<code>${esc(b)}</code>`).join('')}</dd>
    <dt>Weight on page-one SEO</dt><dd>${meter(Math.round(m.seo * 5), 5)}</dd>
    <dt>Weight on affiliate lists</dt><dd>${meter(Math.round(m.aff * 3.6), 5)}</dd>
    <dt>Weight on Reddit & YouTube</dt><dd>${meter(Math.round(m.soc * 3.6), 5)}</dd>
    <dt>Lift from schema</dt><dd>${meter(Math.round(m.schema * 14), 5)}</dd>
    <dt>Uses persona memory</dt><dd>${m.mem ? 'Yes' : 'No. Only the words in the query'}</dd>
    <dt>Reads JavaScript pages</dt><dd>${m.renders ? 'Yes, via Google’s rendered index' : 'No. Content must be in HTML or JSON-LD'}</dd>
    <dt>AEO lever</dt><dd class="lvx">${esc(m.lever)}</dd></dl></div>`).join('');

  /* ---------- team ---------- */
  const ini = (n) => n.split(' ').map(x => x[0]).join('');
  $('#teamBody').innerHTML = `<div class="tm-mgr">${TEAM.managers.map(x => `<div class="tm-card mgr"><span class="tm-av">${ini(x.n)}</span><div><b>${esc(x.n)}</b><small>${esc(x.r)}</small><p>${esc(x.d)}</p></div></div>`).join('')}</div><div class="tm-k">Digital Organic Growth Marketing Team</div><div class="tm-list">${TEAM.members.map(x => `<div class="tm-card"><span class="tm-av sm">${ini(x.n)}</span><div><b>${esc(x.n)}</b><small>${esc(x.r)}</small><p>${esc(x.d)}</p></div></div>`).join('')}</div>`;

  /* ---------- hero ---------- */
  (function hero() {
    const qs = ['best student checking', 'checking for college students', 'PNC Simple Checking', 'banks near Penn State', 'reddit college bank', 'student account 2026'];
    const src = ['nerdwallet.com', 'pnc.com', 'reddit.com', 'youtube.com'];
    let s = '<svg viewBox="0 0 560 400">';
    qs.forEach((q, i) => { const y = 40 + i * 62; s += `<path class="hv-line" d="M120 200 C 160 200, 160 ${y}, 200 ${y}"/>`; });
    qs.forEach((q, i) => { const y = 40 + i * 62; src.forEach((x, j) => { if ((i + j) % 2) return; const sy = 70 + j * 86; s += `<path class="hv-line ${x === 'pnc.com' ? 'o' : ''}" d="M330 ${y} C 360 ${y}, 360 ${sy}, 392 ${sy}"/>`; }); });
    src.forEach((x, j) => { const sy = 70 + j * 86; s += `<path class="hv-line ${x === 'pnc.com' ? 'o' : ''}" d="M420 ${sy} C 450 ${sy}, 450 200, 470 200"/>`; });
    s += `<g class="hv-node"><rect x="8" y="160" width="112" height="80" rx="16" fill="#fff"/><text x="22" y="186" font-family="Outfit" font-weight="700" font-size="11" fill="#EF6A00" letter-spacing="1.5">PROMPT</text><text x="22" y="206" font-family="Source Sans 3" font-size="12.5" fill="#333F48">Best bank account</text><text x="22" y="222" font-family="Source Sans 3" font-size="12.5" fill="#333F48">for a student?</text></g>`;
    qs.forEach((q, i) => { const y = 40 + i * 62; s += `<g class="hv-node" style="animation-delay:${.15 + i * .1}s"><rect x="200" y="${y - 15}" width="130" height="30" rx="15" fill="${i === 1 ? '#5a3a20' : '#44505A'}" stroke="${i === 1 ? '#EF6A00' : '#5c6973'}"/><text x="214" y="${y + 4}" font-family="ui-monospace,Menlo,monospace" font-size="10" fill="#e6ecef">${q.length > 20 ? q.slice(0, 19) + '…' : q}</text></g>`; });
    src.forEach((x, j) => { const sy = 70 + j * 86; s += `<g class="hv-node" style="animation-delay:${.8 + j * .12}s"><circle cx="406" cy="${sy}" r="19" fill="#fff"/><text x="406" y="${sy + 34}" text-anchor="middle" font-family="Source Sans 3" font-size="11" fill="#c4ccd2">${x.replace('.com', '')}</text></g>`; });
    s += `<g class="hv-node" style="animation-delay:1.3s"><rect x="470" y="140" width="86" height="120" rx="14" fill="#fff"/><text x="482" y="162" font-family="Outfit" font-weight="700" font-size="10" fill="#EF6A00" letter-spacing="1.4">ANSWER</text>${[0, 1, 2, 3].map(k => `<rect x="482" y="${174 + k * 18}" width="${k === 1 ? 62 : 52 + (k % 2) * 8}" height="8" rx="4" fill="${k === 1 ? '#EF6A00' : '#E2E3E4'}"/>`).join('')}<text x="482" y="252" font-family="Source Sans 3" font-size="10" fill="#5E6B75">PNC #2 of 3</text></g>`;
    s += '<text x="200" y="392" font-family="Outfit" font-weight="700" font-size="10.5" fill="#8fa1ad" letter-spacing="1.6">FAN-OUT QUERIES</text><text x="370" y="392" font-family="Outfit" font-weight="700" font-size="10.5" fill="#8fa1ad" letter-spacing="1.6">SOURCES</text></svg>';
    const host = $('#heroViz'); host.innerHTML = '<div class="hv-wrap">' + s + '</div>'; const hv = $('.hv-wrap', host);
    src.forEach((x, j) => { const d = document.createElement('div'); d.className = 'hv-fav'; d.style.top = ((70 + j * 86) / 400 * 100) + '%'; d.style.left = (406 / 560 * 100) + '%'; d.style.animationDelay = (.8 + j * .12) + 's'; d.innerHTML = favDom(x); hv.appendChild(d); });
    const pa = document.createElement('div'); pa.className = 'hv-av'; pa.innerHTML = avatar('student'); hv.appendChild(pa);
  })();

  /* ---------- nav ---------- */
  const navLinks = $$('.nav a');
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
  ['sim', 'schema', 'variability', 'how', 'playbook'].forEach(id => obs.observe(document.getElementById(id)));

  /* ---------- init ---------- */
  paintLevers(); paintPrompt(); paintDevice(); paintSchemaLab(); paintVariability();
})();
