/* =====================================================================
   PNC AEO Lab: UI
   ===================================================================== */
(function () {
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const S = { m: 'chatgpt', p: 'student', i: 'rec', speed: 2, seed: 0, token: 0, running: false, ran: false, heatModel: 'chatgpt' };

  /* ---------- logos ---------- */
  let uid = 0;
  function modelLogo(k) {
    // give gradient ids a unique suffix so hidden copies never break visible ones
    const n = ++uid;
    let svg = MODEL_SVG[k];
    if (k === 'chatgpt') svg = svg.replace('<svg', '<svg style="color:#0d0d0d"');
    return svg.replace(/id="([^"]+)"/g, `id="$1-${n}"`).replace(/url\(#([^)]+)\)/g, `url(#$1-${n})`);
  }
  $$('[data-logo="pnc-white"]').forEach(el => el.innerHTML = pncLogo('#FFFFFF'));

  const INTENT_ICON = {
    info: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M10 9v5M10 6.2v.1" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
    rec: '<svg viewBox="0 0 20 20"><path d="M10 2.8l2.2 4.6 5 .6-3.7 3.4 1 5-4.5-2.5-4.5 2.5 1-5L2.8 8l5-.6z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    compare: '<svg viewBox="0 0 20 20"><rect x="2.5" y="4" width="6" height="12" rx="1.5" fill="none" stroke="#fff" stroke-width="1.8"/><rect x="11.5" y="4" width="6" height="12" rx="1.5" fill="none" stroke="#fff" stroke-width="1.8"/></svg>',
    txn: '<svg viewBox="0 0 20 20"><path d="M3 4h2l2 9h8l2-6H6.2" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="8" cy="16.5" r="1.3" fill="#fff"/><circle cx="14" cy="16.5" r="1.3" fill="#fff"/></svg>'
  };
  const LEVER_ICON = {
    Content: '<svg viewBox="0 0 16 16"><path d="M3 3h10M3 7h10M3 11h6" stroke="#EF6A00" stroke-width="2" stroke-linecap="round"/></svg>',
    Technical: '<svg viewBox="0 0 16 16"><path d="M5 4L1.5 8 5 12M11 4l3.5 4L11 12" fill="none" stroke="#2A6AB0" stroke-width="2" stroke-linecap="round"/></svg>',
    'Off-site': '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="#1E9E8A" stroke-width="2"/><path d="M2 8h12M8 2c2.5 3 2.5 9 0 12M8 2c-2.5 3-2.5 9 0 12" fill="none" stroke="#1E9E8A" stroke-width="1.4"/></svg>',
    Measurement: '<svg viewBox="0 0 16 16"><path d="M2 14V9M6 14V5M10 14V7M14 14V2" stroke="#8A5CC2" stroke-width="2.2" stroke-linecap="round"/></svg>'
  };

  /* ---------- favicons ---------- */
  const FAV_PAL = ['#2A6AB0', '#1E9E8A', '#8A5CC2', '#C2416B', '#44505A', '#0b5d85', '#7a5a14'];
  const isPnc = (s) => s.type === 'owned';
  function favColor(dom) { if (dom === 'pnc.com') return '#EF6A00'; let h = 0; for (const c of dom) h = (h * 31 + c.charCodeAt(0)) >>> 0; return FAV_PAL[h % FAV_PAL.length]; }
  function fav(s) { const d = s.dom; const own = d === 'pnc.com' || (s.type === 'owned'); return `<span class="fav" style="background:${own ? '#EF6A00' : favColor(d)}">${d === 'google.com' ? 'M' : d[0].toUpperCase()}</span>`; }
  const shortDom = (s) => s.dom === 'google.com' ? 'Google Maps' : s.dom.replace(/\.(com|org|gov)$/, '');

  /* ---------- tooltip ---------- */
  const tt = $('#tt');
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-tt]'); if (!t) { tt.classList.remove('on'); return; }
    tt.innerHTML = t.getAttribute('data-tt'); tt.classList.add('on');
  });
  document.addEventListener('mousemove', e => {
    if (!tt.classList.contains('on')) return;
    const w = tt.offsetWidth, h = tt.offsetHeight;
    let x = e.clientX + 14, y = e.clientY + 16;
    if (x + w > innerWidth - 8) x = e.clientX - w - 14;
    if (y + h > innerHeight - 8) y = e.clientY - h - 12;
    tt.style.left = x + 'px'; tt.style.top = y + 'px';
  });

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
    paint();
    return { paint };
  }
  document.addEventListener('click', e => { if (!e.target.closest('.dd')) $$('.dd.open').forEach(d => { d.classList.remove('open'); $('.dd-btn', d).setAttribute('aria-expanded', 'false'); }); });

  const ddModel = makeDD($('#dd-model'), 'Model', Object.entries(MODELS).map(([k, m]) => ({ k, icon: `<span class="ic">${modelLogo(k)}</span>`, b: m.name, s: m.maker + ' · ' + m.ver, d: m.maker + ' · ' + m.index })), () => S.m, v => { S.m = v; onChange(); });
  const ddPersona = makeDD($('#dd-persona'), 'Persona', Object.entries(PERSONAS).map(([k, p]) => ({ k, icon: `<span class="ic av ${k === 'general' ? 'g' : ''}">${p.av}</span>`, b: p.name, s: p.who, d: p.who + '. ' + p.blurb })), () => S.p, v => { S.p = v; onChange(); });
  const ddIntent = makeDD($('#dd-intent'), 'Intent', Object.entries(INTENTS).map(([k, x]) => ({ k, icon: `<span class="ic it">${INTENT_ICON[k]}</span>`, b: x.name, s: 'Answer shape: ' + x.fmt, d: x.d })), () => S.i, v => { S.i = v; onChange(); });

  function onChange() {
    S.seed = 0;
    paintPrompt();
    paintChatTop();
    $('#againBtn').disabled = true;
    paintVariability();
  }
  function paintPrompt() {
    const sc = SCEN[S.p + '_' + S.i], P = PERSONAS[S.p];
    $('#promptText').textContent = sc.prompt;
    $('#promptType').textContent = INTENTS[S.i].name;
    $('#persLine').innerHTML = P.mem.length
      ? `<span class="ic av" style="width:26px;height:26px;font-size:12px">${P.av}</span><span><b>${esc(P.who)}.</b> The model’s ${MODELS[S.m].memory.toLowerCase()} knows: ${P.mem.map(esc).join(' · ')}</span>`
      : `<span class="ic av g" style="width:26px;height:26px;font-size:12px">?</span><span><b>No persona.</b> Anonymous session with no memory or personal context.</span>`;
  }

  /* ---------- speed ---------- */
  $('#speedSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.speed = +b.dataset.s; $$('#speedSeg button').forEach(x => x.classList.toggle('on', x === b)); });

  /* ---------- split divider ---------- */
  const split = $('#split');
  (function () {
    let drag = false;
    const move = (e) => { if (!drag) return; const r = split.getBoundingClientRect(); const x = Math.min(72, Math.max(28, (e.clientX - r.left) / r.width * 100)); split.style.setProperty('--x', x + '%'); };
    $('#divider').addEventListener('pointerdown', e => { drag = true; e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); e.preventDefault(); });
    addEventListener('pointermove', move); addEventListener('pointerup', () => drag = false);
    $('#knob').addEventListener('keydown', e => { const cur = parseFloat(getComputedStyle(split).getPropertyValue('--x')) || 50; if (e.key === 'ArrowLeft') split.style.setProperty('--x', Math.max(28, cur - 4) + '%'); if (e.key === 'ArrowRight') split.style.setProperty('--x', Math.min(72, cur + 4) + '%'); });
    $('#mtabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; split.dataset.mode = b.dataset.mode; $$('#mtabs button').forEach(x => x.classList.toggle('on', x === b)); });
  })();

  /* ---------- chat chrome ---------- */
  function paintChatTop() {
    const M = MODELS[S.m], dev = $('#device');
    dev.dataset.m = S.m;
    $('#chatTop').innerHTML = `<span class="mk">${modelLogo(S.m)}</span><b>${M.name}</b><span class="mv">${M.ver}</span><span class="tb"><i></i><i></i></span>`;
    $('#emptyLogo').innerHTML = `<span style="width:34px;height:34px;display:block">${modelLogo(S.m)}</span>`;
    $('#custSub').textContent = M.name + ' · ' + PERSONAS[S.p].short;
    $('#techSub').textContent = M.index;
    $('#chatIn span').textContent = S.m === 'gemini' ? 'Ask Gemini' : S.m === 'claude' ? 'Reply to Claude…' : S.m === 'copilot' ? 'Message Copilot' : 'Ask anything';
  }

  /* ---------- pipeline rail ---------- */
  $('#rail').innerHTML = PIPELINE.map((p, i) => `<div data-i="${i}"><i>${i + 1}</i><span>${p.n}</span></div>`).join('');
  function railSet(i) { $$('#rail div').forEach((d, j) => { d.classList.toggle('on', j === i); d.classList.toggle('done', j < i || i === 99); }); }

  /* ---------- console ---------- */
  let clock = 0;
  function logReset() { $('#conB').innerHTML = ''; clock = 9 * 3600000 + 41 * 60000 + 2000 + Math.floor(Math.random() * 900); }
  function log(tag, text, cls) {
    clock += 40 + Math.floor(Math.random() * 260);
    const d = new Date(clock), ts = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}.${String(d.getUTCMilliseconds()).padStart(3, '0')}`;
    const b = $('#conB');
    b.insertAdjacentHTML('beforeend', `<div class="cl"><span class="ct">${ts}</span><span class="tg ${tag}">${tag}</span><span class="cx ${cls || ''}">${text}</span></div>`);
    b.scrollTop = b.scrollHeight;
  }

  /* ---------- run ---------- */
  const sleep = (ms) => new Promise(r => setTimeout(r, ms / S.speed));
  $('#runBtn').addEventListener('click', () => run(false));
  $('#againBtn').addEventListener('click', () => run(true));

  function stageCard(i, sub) {
    $$('#techBody .stg.on').forEach(x => x.classList.remove('on'));
    const p = PIPELINE[i];
    const el = document.createElement('div');
    el.className = 'stg on';
    el.innerHTML = `<div class="stg-h"><span class="n">${i + 1}</span><b>${p.n}</b><small>${sub || ''}</small></div><div class="stg-c"></div>`;
    $('#techBody').appendChild(el);
    railSet(i);
    scrollTech(el);
    return $('.stg-c', el);
  }
  function scrollTech(el) { const b = $('#techBody'); b.scrollTop = el.offsetTop - 8; }
  function scrollChat() { const b = $('#chatBody'); b.scrollTop = b.scrollHeight; }
  const lever = (t) => `<div class="lever"><b>AEO lever</b><span>${t}</span></div>`;

  async function run(again) {
    const tok = ++S.token;
    const live = () => tok === S.token;
    if (again) S.seed++; else S.seed = S.seed || 0;
    S.running = true; S.ran = true;
    $('#againBtn').disabled = false;
    const r = simulate(S.m, S.p, S.i, S.seed);
    const M = r.M, P = r.P;

    // reset panes
    paintChatTop();
    $('#custEmpty').style.display = 'none';
    $('#techBody').innerHTML = '';
    $('#score').classList.remove('show');
    railSet(-1);
    logReset();
    $('#liveDot').classList.add('on'); $('#conS').textContent = M.name + ' · run ' + (S.seed + 1);
    const chat = $('#chatBody');
    chat.innerHTML = '';
    if (P.mem.length) chat.insertAdjacentHTML('beforeend', `<div class="mem"><b>${M.memory}:</b>${P.mem.map(m => `<span>${esc(m)}</span>`).join('')}</div>`);

    // type prompt into input
    const inp = $('#chatIn span');
    inp.style.color = '#1f1f1f';
    const words = r.sc.prompt.split(' ');
    for (let w = 1; w <= words.length; w++) { inp.textContent = words.slice(0, w).join(' '); await sleep(28); if (!live()) return; }
    await sleep(200); if (!live()) return;
    inp.style.color = '';
    paintChatTop();
    chat.insertAdjacentHTML('beforeend', `<div class="u-msg">${esc(r.sc.prompt)}</div>`);
    const holder = document.createElement('div');
    chat.appendChild(holder);
    const status = (html, done) => { holder.innerHTML = S.m === 'gemini' ? `<div class="g-head"><span class="sp ${done ? '' : 'go'}">${modelLogo('gemini')}</span><div class="status ${done ? 'done' : ''}" style="margin-top:3px">${html}</div></div>` : `<div class="status ${done ? 'done' : ''}">${html}</div>`; scrollChat(); };
    const spin = (t) => `<span class="spin"></span><span class="shim">${t}</span>`;

    log('PARSE', `prompt received · ${r.sc.prompt.length} chars · model=${M.name.toLowerCase()}`);

    /* 1. Understand */
    status(spin('Thinking'));
    let c = stageCard(0, r.I.name);
    c.innerHTML = `<dl class="kv">
      <dt>Explicit</dt><dd><div class="chips">${r.understand.explicit.map(x => `<span class="chp">${esc(x)}</span>`).join('')}</div></dd>
      <dt>Memory</dt><dd>${r.understand.memory.length ? `<div class="chips">${r.understand.memory.map(x => `<span class="chp mem">${esc(x)}</span>`).join('')}</div>` : '<span style="color:#8fa1ad">None. Anonymous session, so the answer will be generic.</span>'}</dd>
      <dt>Inferred</dt><dd><div class="chips">${r.understand.inferred.map(x => `<span class="chp inf">${esc(x)}</span>`).join('')}</div></dd>
      <dt>Intent</dt><dd>${r.I.name} <span style="color:#8fa1ad">· confidence ${r.understand.confidence}%</span></dd>
    </dl><div class="implied" style="margin-top:8px"><b>Implied need</b>${esc(r.understand.implied)}</div>` +
      lever(`Models answer the <em>implied</em> need, not just the words. PNC content that speaks to it in the customer’s language (“${esc(r.understand.inferred[0].toLowerCase())}”) matches more of the sub-queries that follow.`);
    if (P.mem.length) log('MEM', `${M.memory.toLowerCase()} applied: ${P.mem.length} facts`, 'w'); else log('MEM', 'no memory or personal context', 't');
    log('PARSE', `intent=${S.i} · confidence=${r.understand.confidence}% · implied need extracted`, 'ai');
    await sleep(1500); if (!live()) return;

    /* 2. Fan out */
    c = stageCard(1, `1 prompt → ${r.queries.length} queries`);
    for (const q of r.queries) {
      c.insertAdjacentHTML('beforeend', `<div class="qrow ${q.added ? 'add' : ''}"><span class="qt ${q.type}">${q.type}</span><span>${esc(q.q)}${q.added ? ' <em style="color:#8fa1ad">(added from memory)</em>' : ''}</span><span class="h">${q.hits} hits</span></div>`);
      log('FAN', `q: "${esc(q.q)}" [${q.type}]`);
      const sq = esc(q.q);
      if (S.m === 'copilot') status(spin(`Searching for: ${sq}`));
      else if (S.m === 'gemini') status(spin(`Searching Google for “${sq}”`));
      else status(spin(`Searching “${sq}”`));
      await sleep(380); if (!live()) return;
    }
    c.insertAdjacentHTML('beforeend', lever(`Each sub-query is its own retrieval contest. Ranking for “${esc(r.queries[0].q)}” alone isn’t enough. PNC needs strong pages for the entity, comparison, local and freshness variants too.`));
    scrollTech(c.parentNode);
    await sleep(500); if (!live()) return;

    /* 3. Retrieve */
    const all = r.sc.src.map(s => r.sources.find(x => x.id === s.id));
    c = stageCard(2, M.index);
    status(spin(`Reading ${all.length} pages`));
    for (const s of all) {
      const drop = s.status === 'dropped', stale = s.issue === 'stale';
      c.insertAdjacentHTML('beforeend', `<div class="srow ${drop ? 'drop' : ''}">${fav(s)}<span class="t"><b>${esc(s.t)}</b><small>${esc(s.dom + (s.path || ''))}${drop ? ' · ' + esc(s.reason) : stale ? ' · ' + esc(s.date) : ''}</small></span><span class="tg ${drop ? 'drop' : stale ? 'stale' : 'ok'}">${drop ? 'Dropped' : stale ? 'Stale' : SRC_TYPES[s.type].n.split(' ')[0]}</span></div>`);
      if (drop) log('DROP', `${s.dom}${s.path || ''} → ${esc(s.reason)}`, 'w');
      else log('IDX', `fetch ${s.dom}${s.path || ''} · 200 · ${Math.round(800 + s.rel * 2400)} tokens${stale ? ' · ' + s.date : ''}`, stale ? 'w' : 'ok');
      await sleep(170); if (!live()) return;
    }
    const pncDrop = all.filter(s => isPnc(s) && s.status === 'dropped');
    const pncStale = all.filter(s => isPnc(s) && s.issue === 'stale');
    c.insertAdjacentHTML('beforeend', lever(pncDrop.length
      ? `<b style="background:none;padding:0;color:#ffb27a;letter-spacing:0;text-transform:none;font:600 12.8px var(--body)">${esc(pncDrop[0].dom + (pncDrop[0].path || ''))}</b> was dropped. ${esc(M.bots[0])} doesn’t execute JavaScript, so the key content never reached the model. Server-render it.${S.m !== 'gemini' ? ' Gemini, which reads Google’s rendered index, can see it.' : ''}`
      : pncStale.length ? `PNC’s page was found but is stale (${esc(pncStale[0].date)}). For time-sensitive prompts, ${M.name} discounts it heavily. Update it and set <code>dateModified</code>.`
      : `Every PNC page in this set was readable. Keep ${M.bots.slice(0, 2).map(esc).join(' and ')} allowed in robots.txt, and keep key facts in the HTML.`));
    scrollTech(c.parentNode);
    await sleep(600); if (!live()) return;

    /* 4. Rank */
    c = stageCard(3, `top ${r.cited.length} of ${all.length} kept`);
    status(spin('Ranking sources'));
    const maxS = Math.max(...r.sources.map(s => s.score), .01);
    let html = '<div class="rank">', passedCut = false;
    r.sources.forEach((s, idx) => {
      if (!passedCut && s.status !== 'cited') { html += `<div class="cut">CUTOFF · ${M.name} cites ~${r.cited.length}</div>`; passedCut = true; }
      const w = s.score / maxS * 100;
      html += `<div class="rk ${s.status}" data-tt="<b>${esc(s.dom)}</b><br>${esc(s.t)}<br>${SRC_TYPES[s.type].n} · score ${s.score.toFixed(2)}${s.reason ? '<br>' + esc(s.reason) : ''}"><span class="d">${s.type === 'owned' ? '<b style="color:#ffb27a">' + esc(shortDom(s)) + '</b>' : esc(shortDom(s))}</span><span class="tr"><i style="width:0;background:${SRC_TYPES[s.type].c}" data-w="${w}"></i></span><span class="v">${s.status === 'dropped' ? '—' : s.score.toFixed(2)}</span></div>`;
    });
    html += '</div><div class="leg">' + Object.entries(SRC_TYPES).map(([k, t]) => `<span><i style="background:${t.c}"></i>${t.n}</span>`).join('') + '<span><i style="background:#4d5c67"></i>Not cited</span></div>';
    c.innerHTML = html;
    await sleep(60);
    $$('.rk .tr i', c).forEach(i => i.style.width = i.dataset.w + '%');
    r.cited.forEach((s, j) => log('RANK', `#${j + 1} ${s.dom} score=${s.score.toFixed(2)} (${s.type}/${s.fmt})`, s.type === 'owned' ? 'w' : ''));
    const pncCitedIdx = r.cited.findIndex(isPnc);
    c.insertAdjacentHTML('beforeend', lever(pncCitedIdx >= 0
      ? `pnc.com made the cut at #${pncCitedIdx + 1}. Answer-first structure, a visible “last updated” date and authority signals keep it there across runs.`
      : `No pnc.com page made ${M.name}’s top ${r.cited.length}. The winners answer in the first paragraph and match the intent’s format (${r.I.fmt}). ${M.tip}`));
    scrollTech(c.parentNode);
    await sleep(1300); if (!live()) return;

    /* 5. Synthesize */
    c = stageCard(4, 'evidence + memory → mentions');
    status(spin('Pulling it together'));
    const maxB = Math.max(...r.brandScores.map(b => b.total), r.threshold * 1.4);
    const chosenSet = new Set(r.order);
    html = r.brandScores.map(b => {
      const inA = chosenSet.has(b.b);
      const rank = r.brandScores.filter(x => chosenSet.has(x.b)).indexOf(b) + 1;
      // bars show the sampled total, split by where it came from
      const raw = (b.evidence + b.memoryScore) || 1, ew = b.evidence / raw * b.total / maxB * 100, mw = b.memoryScore / raw * b.total / maxB * 100;
      const st = inA ? (b.named ? 'Named · in' : `In answer · #${rank}`) : (b.total >= r.threshold ? 'Cut (no room)' : 'Below bar');
      return `<div class="bev ${b.b === 'pnc' ? 'pnc' : ''}" data-tt="<b>${esc(BRANDS[b.b].n)}</b><br>Evidence from ${b.ev.length} cited source${b.ev.length === 1 ? '' : 's'}${b.ev.length ? ': ' + esc([...new Set(b.ev)].join(', ')) : ''}<br>Training-memory prior: ${b.memoryScore.toFixed(2)}<br>Sampled score this run: ${b.total.toFixed(2)}${b.named ? '<br>Named in the prompt' : ''}"><span class="nm">${esc(BRANDS[b.b].n)}</span><span class="tr"><i class="e" style="width:0" data-w="${ew}"></i><i class="m" style="width:0" data-w="${mw}"></i><u style="left:${r.threshold / maxB * 100}%"></u></span><span class="st ${inA ? 'in' : ''}">${st}</span></div>`;
    }).join('') + `<div class="leg"><span><i style="background:#8DC8E8"></i>Evidence from cited sources</span><span><i style="background:repeating-linear-gradient(135deg,#6f808b 0 3px,#4d5c67 3px 6px)"></i>Training memory</span><span><i style="background:#fff;width:2px"></i>Mention bar</span></div>`;
    c.innerHTML = html;
    await sleep(60);
    $$('.bev .tr i', c).forEach(i => i.style.width = i.dataset.w + '%');
    r.brandScores.forEach(b => log('SYN', `${BRANDS[b.b].n}: evidence=${b.evidence.toFixed(2)} memory=${b.memoryScore.toFixed(2)} → ${chosenSet.has(b.b) ? 'MENTION' : 'omit'}`, chosenSet.has(b.b) ? (b.b === 'pnc' ? 'w' : 'ok') : ''));
    const pb = r.brandScores.find(b => b.b === 'pnc');
    let lv;
    if (!pb) lv = 'This answer is brand-neutral by design. The win here is being the <em>cited explainer</em>, which builds trust upstream of a later recommendation prompt.';
    else if (r.pnc.mentioned && pb.named) lv = `PNC is in the answer because the user named it. The real question is whether PNC’s facts are right. ${pb.ev.length ? `Its row draws on ${new Set(pb.ev).size} source(s).` : 'No PNC source was cited, so its facts came from memory.'}`;
    else if (r.pnc.mentioned && r.pnc.memOnly) lv = 'PNC was named from training memory alone, with no supporting citation. Mentions like this are fragile across runs and more likely to contain outdated facts.';
    else if (r.pnc.mentioned) lv = `PNC earned its mention from ${new Set(pb.ev).size} cited source(s). When several independent sources agree about PNC, the mention holds up across runs.`;
    else lv = `PNC didn’t clear the bar. Competitors appear in more of the cited sources${pb.ev.length ? '' : ', and no cited source mentions PNC at all'}. Third-party coverage is the fix.`;
    c.insertAdjacentHTML('beforeend', lever(lv));
    scrollTech(c.parentNode);
    await sleep(1300); if (!live()) return;

    /* 6. Render */
    const nC = r.citedOrdered.length;
    c = stageCard(5, M.name + ' answer style');
    const fmtName = { explainer: 'Explainer', shortlist: 'Shortlist', table: 'Comparison table', steps: 'Steps + call to action' }[r.I.fmt];
    c.innerHTML = `<div class="fmt"><span class="big">${fmtName}</span><span>${r.order.length} brand${r.order.length === 1 ? '' : 's'} named · ${nC} citation${nC === 1 ? '' : 's'}</span></div><p style="font-size:13px;color:#aab5bd;margin:6px 0 0">${esc(M.style)}</p>` +
      lever({ info: 'Explainers reward clear definitions, FAQs and authority. Being the cited explainer earns trust before the customer ever asks “which bank?”', rec: 'Shortlists are assembled from roundups and community threads. If PNC isn’t on the lists, it rarely makes the shortlist.', compare: 'Tables need structured, comparable facts. Vague cells like “qualifying balances” lose the verdict line to competitors who publish exact numbers.', txn: 'Transactional answers hand off to one or two links. Make sure the PNC link lands on a working, crawlable application path, and measure the referral.' }[S.i]);
    log('OUT', `render format=${r.I.fmt} brands=[${r.order.map(b => BRANDS[b].n).join(', ')}] citations=${nC}`, 'ai');

    // done line in chat
    const doneTxt = { chatgpt: `Searched ${r.queries.length} queries · ${nC} sources`, gemini: 'Show thinking', claude: `Searched the web · ${nC} results`, copilot: `Searched ${r.queries.length} queries · ${nC} sources` }[S.m];
    status(`<span class="chev"></span><span>${doneTxt}</span>`, true);

    /* stream the answer */
    const box = document.createElement('div');
    box.className = 'ans';
    let target = box;
    if (S.m === 'copilot') { const w = document.createElement('div'); w.className = 'ans-wrap'; w.appendChild(box); chat.appendChild(w); }
    else if (S.m === 'gemini') { const g = document.createElement('div'); g.className = 'g-head'; g.innerHTML = `<span class="sp">${modelLogo('gemini')}</span>`; g.appendChild(box); box.style.flex = '1'; box.style.minWidth = '0'; chat.appendChild(g); holder.remove(); g.insertAdjacentElement('beforebegin', holder); holder.innerHTML = `<div class="status done" style="margin-left:34px"><span class="chev"></span><span>${doneTxt}</span></div>`; }
    else chat.appendChild(box);
    const chunks = buildAnswer(r);
    for (const ch of chunks) {
      if (ch.li) {
        const ols = target.querySelectorAll('ol');
        ols[ols.length - 1].insertAdjacentHTML('beforeend', ch.li);
        scrollChat(); await sleep(260); if (!live()) return;
        continue;
      }
      if (ch.stream) {
        const el = document.createElement(ch.tag || 'p');
        target.appendChild(el);
        const ws = ch.stream.split(' ');
        for (let w = 1; w <= ws.length; w += 2) { el.innerHTML = (ch.pre || '') + esc(ws.slice(0, w).join(' ')) + '<span class="cur"></span>'; scrollChat(); await sleep(26); if (!live()) return; }
        el.innerHTML = (ch.pre || '') + esc(ch.stream) + (ch.post || '');
      } else {
        target.insertAdjacentHTML('beforeend', ch.html);
        scrollChat();
        await sleep(ch.wait || 160); if (!live()) return;
      }
    }
    railSet(99);
    $$('#techBody .stg.on').forEach(x => x.classList.remove('on'));
    log('OUT', 'stream complete', 'ok');
    $('#liveDot').classList.remove('on'); $('#conS').textContent = 'complete';
    S.running = false;
    paintScore(r);
  }

  /* ---------- answer composition ---------- */
  const INTRO = {
    chatgpt: { info: 'Here’s a clear breakdown.', rec: 'Here are the options that come up most often for what you described:', compare: 'Here’s how they compare on the things that matter most:', txn: 'Here’s the quickest way to get this done.' },
    gemini: { info: 'Here’s an overview of what you need to know.', rec: 'Here are some top options to consider, depending on your priorities.', compare: 'Here is a side-by-side look at the key differences.', txn: 'Here’s where to start and what you’ll need.' },
    claude: { info: 'Here’s how I’d think about it.', rec: 'A few options stand out, though the right one depends on what you value most.', compare: 'These are closer than they look. Here’s where they actually differ.', txn: 'Here’s a practical path to getting this done.' },
    copilot: { info: 'Here’s what you should know:', rec: 'Here are some top picks:', compare: 'Here’s a quick comparison:', txn: 'Here’s how to get started:' }
  };
  const HOOK = {
    student: 'Since you’re a student working part-time, I focused on no-fee options that protect you from overdrafts.',
    starter: 'Since you just started your first job and are paying down student loans, I kept this practical.',
    fthb: 'Since you’re buying in the Columbus area in the next year, I included Ohio-specific help.',
    ema: 'Given your savings and equity compensation, I focused on options that scale as your finances get more complex.'
  };
  function cites(r, nums) {
    if (!nums || !nums.length) return '';
    const srcs = nums.map(n => r.citedOrdered[n - 1]);
    const ttOf = (s) => `data-tt="<b>${esc(s.dom)}</b><br>${esc(s.t)}"`;
    const pc = (s) => isPnc(s) ? ' pnc' : '';
    if (S.m === 'chatgpt') { const s = srcs[0]; return ` <span class="cp${pc(s)}" ${ttOf(s)}>${esc(shortDom(s))}${srcs.length > 1 ? ' +' + (srcs.length - 1) : ''}</span>`; }
    if (S.m === 'claude') return srcs.map((s, j) => `<span class="cn${pc(s)}" ${ttOf(s)}>${nums[j]}</span>`).join('');
    if (S.m === 'copilot') return srcs.map((s, j) => `<span class="cs${pc(s)}" ${ttOf(s)}>${nums[j]}</span>`).join('');
    return `<span class="cg" data-tt="${srcs.map(s => '<b>' + esc(s.dom) + '</b> ' + esc(s.t)).join('<br>')}">${srcs.slice(0, 3).map(s => `<i style="background:${isPnc(s) ? '#EF6A00' : favColor(s.dom)}">${s.dom[0].toUpperCase()}</i>`).join('')}</span>`;
  }
  const hl = (b, h) => b === 'pnc' ? `<span class="pnc-hl">${esc(h)}</span>` : esc(h);

  function buildAnswer(r) {
    const a = r.answer, out = [], m = S.m;
    const head = (t) => m === 'claude' || m === 'copilot' ? `<p style="margin-bottom:4px"><b>${esc(t)}</b></p>` : `<h4>${esc(t)}</h4>`;
    out.push({ stream: INTRO[m][S.i] + (HOOK[S.p] ? ' ' + HOOK[S.p] : '') });

    if (S.i === 'info') {
      a.blocks.forEach(b => out.push({ html: head(b.h) + `<p>${esc(b.t)}${cites(r, b.cites)}</p>` }));
      if (a.brandBlocks.length) {
        out.push({ html: head('Where specific banks fit in') });
        out.push({ html: '<ul>' + a.brandBlocks.map(b => `<li><b>${hl(b.b, b.h)}</b>: ${esc(b.t)}${cites(r, b.cites)}</li>`).join('') + '</ul>' });
      }
      if (a.close) out.push({ html: `<p>${esc(a.close)}</p>` });
    }
    if (S.i === 'rec') {
      if (!a.brandBlocks.length) out.push({ html: '<p>There isn’t a clear consensus pick, but these criteria matter most.</p>' });
      out.push({ html: '<ol></ol>', wait: 10 });
      a.brandBlocks.forEach(b => out.push({ li: `<li><b>${hl(b.b, b.h)}</b>: ${esc(b.t)}${cites(r, b.cites)}</li>` }));
      if (a.close) out.push({ html: `<p>${m === 'gemini' ? '<b>Things to consider:</b> ' : m === 'claude' ? '' : '<b>Tip:</b> '}${esc(a.close)}</p>` });
    }
    if (S.i === 'compare') {
      const rows = a.blocks.concat(a.brandBlocks);
      out.push({ html: `<table><thead><tr><th></th>${a.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(b => `<tr><td>${hl(b.b, b.h)}${cites(r, b.cites)}</td>${b.cells.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`, wait: 400 });
      if (a.verdict) out.push({ html: `<p><b>${m === 'claude' ? 'My take' : 'Bottom line'}:</b> ${esc(a.verdict)}</p>` });
    }
    if (S.i === 'txn') {
      const [first, ...rest] = a.brandBlocks;
      if (first) {
        out.push({ html: head(m === 'claude' ? 'Where I’d start' : 'Best place to start') });
        const col = first.b === 'pnc' ? '#EF6A00' : favColor(first.b + '.com');
        out.push({ html: `<div class="cta"><span class="lg" style="background:${col}">${esc(BRANDS[first.b].n[0])}</span><span class="cx"><b>${hl(first.b, first.h)}</b><span>${esc(first.t)}${cites(r, first.cites)}</span></span><span class="go">${esc(first.cta)} ↗</span></div>`, wait: 300 });
      }
      if (rest.length) out.push({ html: `<p class="alt" style="margin-bottom:4px"><b>Also worth a look:</b></p><ul class="alt">${rest.map(b => `<li><b>${hl(b.b, b.h)}</b>: ${esc(b.t)}${cites(r, b.cites)}</li>`).join('')}</ul>` });
      out.push({ html: head('What you’ll need') });
      out.push({ html: '<ol>' + a.steps.map(s => `<li>${esc(s)}</li>`).join('') + '</ol>' });
    }

    // outro
    if (m === 'chatgpt') out.push({ html: '<p>If you want, I can compare fees side by side or check what’s available near you.</p>' });
    if (m === 'claude') out.push({ html: '<p>One caveat: fees, rates and offers change often, so confirm current terms directly with each bank before you decide.</p>' });

    // sources
    const srcs = r.citedOrdered;
    if (srcs.length) {
      if (m === 'copilot') {
        out.push({ html: `<div class="learn">Learn more: ${srcs.map((s, j) => `<a class="${isPnc(s) ? 'pnc' : ''}" data-tt="${esc(s.t)}"><em>${j + 1}</em>${esc(s.dom)}</a>`).join('')}</div><div class="fups">${['Which is best for me?', 'Show fees side by side', 'Find a branch near me'].map(x => `<span>${x}</span>`).join('')}</div>` });
      } else {
        const btn = m === 'chatgpt' ? `<div class="srcbtn"><span class="st">${srcs.slice(0, 4).map(fav).join('')}</span>Sources</div>` : `<div style="font:600 13.5px var(--body);color:#555">Sources</div>`;
        out.push({ html: `<div class="srcs">${btn}<div class="srccards">${srcs.map(s => `<div class="srccard ${isPnc(s) ? 'pnc' : ''}"><div class="d">${fav(s)}${esc(shortDom(s))}</div><b>${esc(s.t)}</b></div>`).join('')}</div></div>` });
      }
    }
    out.push({ html: '<div class="actions"><i></i><i></i><i></i></div>', wait: 0 });

    return out;
  }

  /* ---------- scorecard ---------- */
  function paintScore(r) {
    const st = statsFor(S.m, S.p, S.i);
    const p = r.pnc;
    const named = (r.sc.named || []).includes('pnc');
    const t1 = p.mentioned
      ? `<div class="tile hit"><small>PNC in this answer</small><div class="bigv">#${p.rank}<span>of ${p.of} brand${p.of === 1 ? '' : 's'}</span></div><div class="note">${named ? 'Named in the prompt, so the model had to address PNC.' : p.memOnly ? 'Named from training memory, with no citation behind it.' : 'Earned from cited evidence.'}</div><span class="flag ${p.memOnly ? 'w' : 'g'}">${p.memOnly ? '⚠ Uncited mention' : named ? '✓ Branded prompt' : '✓ Earned mention'}</span></div>`
      : `<div class="tile miss"><small>PNC in this answer</small><div class="bigv">Not named</div><div class="note">${p.eligible ? 'PNC had a shot but didn’t clear the evidence bar.' : 'This answer is brand-neutral by design.'}</div><span class="flag w">✕ Visibility gap</span></div>`;
    const t2 = `<div class="tile"><small>PNC-owned sources cited</small><div class="bigv">${p.ownedCited}<span>of ${p.totalCited} citations</span></div><div class="note">${p.ownedCited ? (p.mentioned ? 'pnc.com is shaping the facts in this answer.' : 'pnc.com was cited for background, but PNC itself wasn’t recommended.') : 'No pnc.com page was cited. Other sources define PNC’s story here.'}</div></div>`;
    const pct = Math.round(st.rate * 100);
    const t3 = `<div class="tile"><small>Mention rate · 20 runs</small><div class="ringw"><div class="ring" style="--p:${pct}"><b>${pct}%</b></div><div class="note" style="margin:0">Same settings, sampled 20 times.${st.avgRank ? ` Average position <b style="color:var(--dg)">#${st.avgRank.toFixed(1)}</b>.` : ''}</div></div></div>`;
    const tot = r.citedOrdered.length || 1;
    const mixEntries = Object.entries(SRC_TYPES).filter(([k]) => r.mix[k] > 0);
    const t4 = `<div class="tile"><small>Who shaped this answer · citations by source type</small><div class="mixbar" role="img" aria-label="Citation mix">${mixEntries.map(([k, t]) => `<i style="width:${r.mix[k] / tot * 100}%;background:${t.c}" data-tt="<b>${t.n}</b><br>${r.mix[k]} of ${tot} citations"></i>`).join('')}</div><div class="mixleg">${mixEntries.map(([k, t]) => `<span><i style="background:${t.c}"></i>${t.n} <em>${r.mix[k]}</em></span>`).join('')}</div></div>`;
    let alert = '';
    if (p.dropped.length) alert += `<div class="alert"><b class="k">Fix</b><span><b>${esc(p.dropped[0].dom + (p.dropped[0].path || ''))}</b> was invisible to ${esc(r.M.name)}: its key content is rendered with JavaScript. Gemini can read it via Google’s rendered index, but ChatGPT, Claude and Copilot can’t.</span></div>`;
    if (p.stale.length) alert += `<div class="alert"><b class="k">Fix</b><span><b>${esc(p.stale[0].dom + (p.stale[0].path || ''))}</b> looks stale (${esc(p.stale[0].date)}). For “right now” prompts, freshness-sensitive models like Copilot and Gemini push it down or out.</span></div>`;
    const cards = r.sc.aeo.map(a => `<div class="aeo-c ${a.lever}"><div class="lv">${LEVER_ICON[a.lever]}${a.lever}</div><h4>${esc(a.t)}</h4><p>${esc(a.d)}</p></div>`).join('') +
      `<div class="aeo-c model"><div class="lv"><span style="width:16px;height:16px;display:inline-block;background:#fff;border-radius:4px;padding:1px">${modelLogo(S.m)}</span>For ${esc(r.M.name)}</div><h4>What moves ${esc(r.M.name)}</h4><p>${esc(r.M.lever)}</p></div>`;
    const sc = $('#score');
    sc.innerHTML = `<div class="score-h"><div><div class="eyebrow">Run ${S.seed + 1} · ${esc(r.M.name)} · ${esc(r.P.short)} · ${esc(r.I.name)}</div><h3>What this run means for PNC</h3></div><p>Run it again to see how much the answer moves.</p></div><div class="tiles">${t1}${t2}${t3}${t4}</div>${alert}<div class="score-h" style="margin-top:22px"><h3 style="font-size:21px">AEO actions for this journey</h3></div><div class="aeo">${cards}</div>`;
    sc.classList.add('show');
  }

  /* ---------- variability ---------- */
  const CACHE = {};
  function statsFor(m, p, i) { const k = m + p + i; return CACHE[k] || (CACHE[k] = Object.assign(mentionStats(m, p, i, 20), { runs: runsFor(m, p, i) })); }
  function runsFor(m, p, i) { const out = []; for (let s = 1; s <= 20; s++) { const r = simulate(m, p, i, s * 13); out.push(r.pnc.mentioned ? r.pnc.rank : 0); } return out; }
  const RAMP = [['#FDEBDD', '#7a3500'], ['#F9C9A1', '#7a3500'], ['#F5A262', '#5a2700'], ['#EF6A00', '#fff'], ['#A84A00', '#fff']];
  const rampOf = (v) => RAMP[Math.min(4, Math.floor(v * 5 - 1e-9))] || RAMP[0];

  $('#heatTabs').innerHTML = Object.entries(MODELS).map(([k, m]) => `<button data-k="${k}">${modelLogo(k)}${m.name}</button>`).join('');
  $('#heatTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.heatModel = b.dataset.k; paintVariability(); });
  $('#heatScale').innerHTML = '<span>0%</span>' + RAMP.map(r => `<i style="background:${r[0]}"></i>`).join('') + '<span>100% of runs name PNC</span>';

  function paintVariability() {
    const hm = S.heatModel;
    $$('#heatTabs button').forEach(b => b.classList.toggle('on', b.dataset.k === hm));
    let h = '<div class="hh"></div>' + Object.entries(INTENTS).map(([k, x]) => `<div class="hh">${x.name.replace('Looking for ', '').replace(' / transactional', '')}</div>`).join('');
    Object.entries(PERSONAS).forEach(([pk, P]) => {
      h += `<div class="rh"><span class="ic av ${pk === 'general' ? 'g' : ''}">${P.av}</span>${P.short}</div>`;
      Object.keys(INTENTS).forEach(ik => {
        const st = statsFor(hm, pk, ik), [bg, fg] = rampOf(st.rate);
        const cur = pk === S.p && ik === S.i && hm === S.m;
        h += `<button class="cell ${cur ? 'cur' : ''}" style="background:${bg};color:${fg}" data-p="${pk}" data-i="${ik}" data-tt="<b>${MODELS[hm].name} · ${P.short} · ${INTENTS[ik].short}</b><br>PNC named in ${Math.round(st.rate * 100)}% of 20 runs${st.avgRank ? '<br>Average position #' + st.avgRank.toFixed(1) : ''}<br>Avg pnc.com citations: ${st.avgOwned.toFixed(1)}<br><em>Click to load in simulator</em>" aria-label="${P.short}, ${INTENTS[ik].short}: ${Math.round(st.rate * 100)} percent">${Math.round(st.rate * 100)}%${st.avgRank ? `<small>avg #${st.avgRank.toFixed(1)}</small>` : ''}</button>`;
      });
    });
    $('#heat').innerHTML = h;

    // model comparison for the current persona × intent
    $('#cmpTitle').textContent = 'Across models: ' + PERSONAS[S.p].short + ' · ' + INTENTS[S.i].short;
    $('#cmpSub').innerHTML = `“${esc(SCEN[S.p + '_' + S.i].prompt)}”`;
    const rows = Object.keys(MODELS).map(mk => ({ mk, st: statsFor(mk, S.p, S.i) }));
    $('#cmp').innerHTML = rows.map(({ mk, st }) => `<div class="mrow"><div class="mn">${modelLogo(mk)}${MODELS[mk].name}</div><div><div class="mbar"><span class="tr"><i style="width:${st.rate * 100}%"></i></span><span class="v">${Math.round(st.rate * 100)}% named<small>${st.avgRank ? 'avg position #' + st.avgRank.toFixed(1) : 'never named'}</small></span></div><div class="runs">${st.runs.map((rk, j) => `<i class="${rk ? 'y r' + Math.min(4, rk) : ''}" data-tt="Run ${j + 1}: ${rk ? 'PNC named #' + rk : 'PNC not named'}">${rk || ''}</i>`).join('')}</div></div></div>`).join('');
    const sorted = rows.slice().sort((a, b) => b.st.rate - a.st.rate);
    const best = sorted[0], worst = sorted[sorted.length - 1];
    const spread = Math.round((best.st.rate - worst.st.rate) * 100);
    $('#cmpInsight').innerHTML = spread < 10
      ? `All four models behave about the same here (within ${spread} pts). ${(SCEN[S.p + '_' + S.i].named || []).includes('pnc') ? 'PNC is named in the prompt, so the battle is over <b>accuracy and the verdict line</b>, not visibility.' : 'Visibility is driven by the content itself more than by model differences.'}`
      : `<b>${MODELS[best.mk].name}</b> names PNC in ${Math.round(best.st.rate * 100)}% of runs and <b>${MODELS[worst.mk].name}</b> in ${Math.round(worst.st.rate * 100)}%, a ${spread}-point spread for the same question. How ${MODELS[worst.mk].name} retrieves: ${esc(MODELS[worst.mk].tip)}`;
  }
  $('#heat').addEventListener('click', e => {
    const b = e.target.closest('.cell'); if (!b) return;
    S.p = b.dataset.p; S.i = b.dataset.i; S.m = S.heatModel;
    ddModel.paint(); ddPersona.paint(); ddIntent.paint(); onChange();
    document.getElementById('sim').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => run(false), 700);
  });

  /* ---------- how it works ---------- */
  const STEP_LEVER = ['Write for the implied need, in the customer’s words.', 'Cover every sub-query: entity, compare, local, fresh.', 'Be crawlable and server-rendered. Allow AI search bots.', 'Answer first, date it, and earn authority signals.', 'Get independent sources to agree about PNC.', 'Publish structured, extractable facts for tables and steps.'];
  $('#flow6').innerHTML = PIPELINE.map((p, i) => `<div class="f6"><div class="n">Step ${i + 1}</div><h4>${p.n}</h4><p>${p.d}</p><div class="lv"><b>AEO lever</b>${STEP_LEVER[i]}</div></div>`).join('');
  const meter = (v, n) => `<div class="meter">${Array.from({ length: n }, (_, j) => `<i class="${j < v ? 'on' : ''}"></i>`).join('')}</div>`;
  $('#models4').innerHTML = Object.entries(MODELS).map(([k, m]) => `<div class="mc"><div class="mc-h"><span class="lg">${modelLogo(k)}</span><div><b>${m.name}</b><small>${m.maker} · ${m.ver}</small></div></div><dl>
    <dt>Retrieval index</dt><dd>${esc(m.index)}</dd>
    <dt>Crawlers to allow</dt><dd class="bots">${m.bots.map(b => `<code>${esc(b)}</code>`).join('')}</dd>
    <dt>Fan-out breadth</dt><dd>${meter(Math.round(m.fan / 2), 5)}</dd>
    <dt>Leans on training memory</dt><dd>${meter(Math.round(m.param * 10), 5)}</dd>
    <dt>Reads JavaScript pages</dt><dd>${m.renders ? 'Yes, via Google’s rendered index' : 'No. Content must be in the HTML'}</dd>
    <dt>Answer style</dt><dd>${esc(m.style)}</dd>
    <dt>AEO lever</dt><dd class="lvx">${esc(m.lever)}</dd></dl></div>`).join('');

  /* ---------- hero diagram ---------- */
  (function hero() {
    const qs = ['best student checking', 'no overdraft fees', 'PNC Virtual Wallet Student', 'banks near Penn State', 'reddit college bank', 'student account 2026'];
    const src = [['N', '#2A6AB0', 'nerdwallet'], ['P', '#EF6A00', 'pnc.com'], ['R', '#8A5CC2', 'reddit'], ['C', '#1E9E8A', 'cfpb.gov']];
    let s = '<svg viewBox="0 0 560 400">';
    // lines prompt → queries
    qs.forEach((q, i) => { const y = 40 + i * 62; s += `<path class="hv-line" d="M120 200 C 160 200, 160 ${y}, 200 ${y}"/>`; });
    qs.forEach((q, i) => { const y = 40 + i * 62; src.forEach((x, j) => { if ((i + j) % 2) return; const sy = 70 + j * 86; s += `<path class="hv-line ${x[2] === 'pnc.com' ? 'o' : ''}" d="M330 ${y} C 360 ${y}, 360 ${sy}, 392 ${sy}"/>`; }); });
    src.forEach((x, j) => { const sy = 70 + j * 86; s += `<path class="hv-line ${x[2] === 'pnc.com' ? 'o' : ''}" d="M420 ${sy} C 450 ${sy}, 450 200, 470 200"/>`; });
    // prompt node
    s += `<g class="hv-node"><rect x="8" y="160" width="112" height="80" rx="16" fill="#fff"/><text x="22" y="186" font-family="Outfit" font-weight="700" font-size="11" fill="#EF6A00" letter-spacing="1.5">PROMPT</text><text x="22" y="206" font-family="Source Sans 3" font-size="12.5" fill="#333F48">Best bank account</text><text x="22" y="222" font-family="Source Sans 3" font-size="12.5" fill="#333F48">for a student?</text></g>`;
    qs.forEach((q, i) => { const y = 40 + i * 62; s += `<g class="hv-node" style="animation-delay:${.15 + i * .1}s"><rect x="200" y="${y - 15}" width="130" height="30" rx="15" fill="#44505A" stroke="#5c6973"/><text x="214" y="${y + 4}" font-family="ui-monospace,Menlo,monospace" font-size="10" fill="#e6ecef">${q.length > 20 ? q.slice(0, 19) + '…' : q}</text></g>`; });
    src.forEach((x, j) => { const sy = 70 + j * 86; s += `<g class="hv-node" style="animation-delay:${.8 + j * .12}s"><circle cx="406" cy="${sy}" r="16" fill="${x[1]}"/><text x="406" y="${sy + 5}" text-anchor="middle" font-family="Outfit" font-weight="700" font-size="14" fill="#fff">${x[0]}</text><text x="406" y="${sy + 32}" text-anchor="middle" font-family="Source Sans 3" font-size="11" fill="#c4ccd2">${x[2]}</text></g>`; });
    s += `<g class="hv-node" style="animation-delay:1.3s"><rect x="470" y="140" width="86" height="120" rx="14" fill="#fff"/><text x="482" y="162" font-family="Outfit" font-weight="700" font-size="10" fill="#EF6A00" letter-spacing="1.4">ANSWER</text>${[0, 1, 2, 3].map(k => `<rect x="482" y="${174 + k * 18}" width="${k === 1 ? 62 : 52 + (k % 2) * 8}" height="8" rx="4" fill="${k === 1 ? '#EF6A00' : '#E2E3E4'}"/>`).join('')}<text x="482" y="252" font-family="Source Sans 3" font-size="10" fill="#5E6B75">PNC #2 of 4</text></g>`;
    s += '<text x="200" y="392" font-family="Outfit" font-weight="700" font-size="10.5" fill="#8fa1ad" letter-spacing="1.6">FAN-OUT QUERIES</text><text x="370" y="392" font-family="Outfit" font-weight="700" font-size="10.5" fill="#8fa1ad" letter-spacing="1.6">SOURCES</text>';
    s += '</svg>';
    $('#heroViz').innerHTML = s;
  })();

  /* ---------- nav highlight ---------- */
  const navLinks = $$('.nav a');
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
  ['sim', 'variability', 'how', 'playbook'].forEach(id => obs.observe(document.getElementById(id)));

  /* ---------- init ---------- */
  paintPrompt(); paintChatTop(); paintVariability();
})();
