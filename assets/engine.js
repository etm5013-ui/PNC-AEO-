/* =====================================================================
   PNC AEO Lab: retrieval simulation engine
   ---------------------------------------------------------------------
   A deliberately simple, explainable model of LLM answer generation:
     1. understand → 2. fan out → 3. retrieve → 4. rank → 5. synthesize → 6. render
   Every number is produced from the scenario data + model profile + a
   seeded random "temperature", so the same settings with a new seed give
   a slightly different answer, just like the real thing.
   ===================================================================== */

function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rngFrom(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function simulate(modelKey, personaKey, intentKey, seed) {
  const M = MODELS[modelKey], P = PERSONAS[personaKey], I = INTENTS[intentKey];
  const sc = SCEN[personaKey + '_' + intentKey];
  const rnd = rngFrom(hashStr(modelKey + personaKey + intentKey) + (seed || 0) * 7919);
  const jitter = (amt) => 1 + (rnd() - .5) * 2 * amt;

  /* ---- 1. Understand ---- */
  const usesMemory = P.mem.length > 0;
  const understand = {
    explicit: sc.explicit,
    inferred: personaKey === 'general' ? sc.inferred.slice(0, 2) : sc.inferred,
    implied: sc.implied,
    memory: P.mem,
    intent: I.name,
    confidence: Math.round((personaKey === 'general' ? 62 : 84) + (rnd() * 10))
  };

  /* ---- 2. Fan out ---- */
  const pref = M.qpref;
  const ranked = sc.fan.map((q, i) => ({ q: q[0], type: q[1], i, p: pref.indexOf(q[1]) + i * .35 + rnd() * 1.2 }))
    .sort((a, b) => a.p - b.p);
  let nFan = Math.min(sc.fan.length, Math.max(3, Math.round(M.fan * jitter(.12))));
  const queries = ranked.slice(0, nFan).map(q => {
    let text = q.q;
    if (q.type === 'local' && usesMemory && !/near|Columbus|Philadelphia|Penn State|Pittsburgh|State College/i.test(text)) text += ' ' + P.city;
    return { q: text, type: q.type, hits: Math.round(6 + rnd() * 14) };
  });
  if (modelKey === 'gemini' && usesMemory && !queries.some(q => q.type === 'local')) {
    queries.push({ q: sc.fan[0][0].split(' ').slice(0, 4).join(' ') + ' near ' + P.city, type: 'local', hits: Math.round(5 + rnd() * 8), added: true });
  }
  const typesFanned = new Set(queries.map(q => q.type));

  /* ---- 3. Retrieve + 4. Rank ---- */
  const fmtW = INTENT_FMT[intentKey];
  const sources = sc.src.map(s => {
    const o = Object.assign({}, s);
    let score = s.rel * (M.w[s.type] || 1) * (fmtW[s.fmt] || 1);
    // Local listings only show up if a local query was fanned out
    if (s.fmt === 'local' && !typesFanned.has('local')) score *= .45;
    // Community content gets a lift if the model searched communities
    if (s.type === 'ugc' && typesFanned.has('community')) score *= 1.12;
    // Persona memory nudges toward the brand the user already has a relationship with
    if (usesMemory && personaKey === 'student' && s.b.includes('pnc')) score *= 1.1;
    o.status = 'kept';
    if (s.issue === 'js' && !M.renders) { o.status = 'dropped'; o.reason = 'JavaScript-rendered: ' + M.bots[0] + ' saw an empty page'; score = 0; }
    if (s.issue === 'stale') { score *= intentKey === 'txn' ? 1 / (M.fresh * 1.6) : 1 / M.fresh; o.reason = 'Stale (' + (s.date || 'old') + '), down-weighted'; }
    o.score = score > 0 ? Math.max(.01, score * jitter(.16)) : 0;
    return o;
  }).sort((a, b) => b.score - a.score);
  const k = Math.max(3, Math.round(M.k * jitter(.1)));
  let kept = 0;
  sources.forEach(s => {
    if (s.status === 'dropped') return;
    if (kept < k) { s.status = 'cited'; kept++; } else { s.status = 'considered'; }
  });
  const cited = sources.filter(s => s.status === 'cited');
  const citedIds = new Set(cited.map(s => s.id));

  /* ---- 5. Synthesize: who earns a mention? ---- */
  const brandsInItems = [...new Set(sc.items.filter(it => it.b).map(it => it.b))];
  const named = sc.named || [];
  const brandScores = brandsInItems.map(b => {
    const ev = cited.filter(s => s.b.includes(b));
    const evidence = ev.reduce((a, s) => a + s.score, 0);
    const memoryScore = M.param * BRANDS[b].prior * .9;
    let total = (evidence + memoryScore) * jitter(.2);
    const isNamed = named.includes(b); // named in the prompt → always addressed
    return { b, evidence, memoryScore, total, named: isNamed, ev: ev.map(s => s.dom), memOnly: ev.length === 0 };
  }).sort((a, b) => b.total - a.total);
  const threshold = .55;
  const maxB = sc.maxBrands || 3;
  const chosen = brandScores.filter(x => x.total >= threshold || named.includes(x.b)).slice(0, Math.max(maxB, named.length));
  // keep named brands in their prompt order for compare tables; others by score
  let order = chosen.map(x => x.b);
  if (intentKey === 'compare' && named.length) order = named.filter(b => order.includes(b)).concat(order.filter(b => !named.includes(b)));

  /* ---- 6. Render ---- */
  const citeNum = new Map();
  const cite = (ids) => (ids || []).filter(id => citedIds.has(id)).map(id => {
    if (!citeNum.has(id)) citeNum.set(id, citeNum.size + 1);
    return citeNum.get(id);
  });
  const blocks = [];
  sc.items.forEach(it => { if (!it.b) blocks.push(Object.assign({}, it, { cites: cite(it.src) })); });
  const brandBlocks = order.map(b => {
    const it = sc.items.find(x => x.b === b);
    const bs = brandScores.find(x => x.b === b);
    return Object.assign({}, it, { cites: cite(it.src), memOnly: cite(it.src).length === 0, score: bs.total });
  });
  // where brand blocks sit: info → after topic points, others → main body
  const answer = { intro: '', blocks, brandBlocks, steps: sc.steps, cols: sc.cols, close: sc.close || '', verdict: '' };
  if (sc.verdict) {
    const lead = order[0];
    answer.verdict = (lead && sc.verdict[lead]) || sc.verdict._ || '';
    answer.verdictBrand = lead;
  }

  const sources_cited_order = [...citeNum.entries()].sort((a, b) => a[1] - b[1]).map(([id]) => sources.find(s => s.id === id));

  /* ---- PNC scorecard ---- */
  const pncRank = chosen.map(x => x.b).indexOf('pnc'); // rank by evidence strength, not display order
  // count only sources that actually appear as citations in the rendered answer
  const pncOwnedCited = sources_cited_order.filter(s => s.type === 'owned').length;
  const mix = {};
  Object.keys(SRC_TYPES).forEach(t => mix[t] = 0);
  sources_cited_order.forEach(s => mix[s.type]++);
  const pncBs = brandScores.find(x => x.b === 'pnc');

  return {
    modelKey, personaKey, intentKey, seed, M, P, I, sc,
    understand, queries, sources, cited, citedOrdered: sources_cited_order,
    brandScores, order, answer, threshold,
    pnc: {
      mentioned: pncRank >= 0, rank: pncRank + 1, of: chosen.length,
      ownedCited: pncOwnedCited, totalCited: sources_cited_order.length,
      memOnly: pncBs ? pncBs.memOnly && pncRank >= 0 : false,
      dropped: sources.filter(s => s.status === 'dropped' && s.type === 'owned'),
      stale: sources.filter(s => s.issue === 'stale' && s.type === 'owned'),
      eligible: !!pncBs
    },
    mix
  };
}

/* How often does PNC appear across N sampled runs? (the variability lens) */
function mentionStats(modelKey, personaKey, intentKey, n) {
  n = n || 20;
  let m = 0, rankSum = 0, top = 0, cites = 0;
  for (let s = 1; s <= n; s++) {
    const r = simulate(modelKey, personaKey, intentKey, s * 13);
    if (r.pnc.mentioned) { m++; rankSum += r.pnc.rank; if (r.pnc.rank === 1) top++; }
    cites += r.pnc.ownedCited;
  }
  return { rate: m / n, avgRank: m ? rankSum / m : null, topRate: top / n, avgOwned: cites / n, n };
}
