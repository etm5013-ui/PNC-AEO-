/* =====================================================================
   PNC AEO Lab: retrieval simulation engine
   ---------------------------------------------------------------------
   1 understand → 2 fan out → 3 retrieve → 4 rank → 5 extract → 6 synthesize → 7 render
   Deterministic given (model, topic, persona, intent, seed, levers), so
   "run again" = new seed, and lever impact = same seeds with a lever flipped.
   ===================================================================== */

function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rngFrom(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const DEFAULT_LEVERS = { schema: true, persona: true, third: false };

function segFor(t, p) { return TOPICS[t].segOf[p] || 'default'; }

/* Assemble a scenario from the topic / persona / intent building blocks */
function buildScenario(t, p, i, L) {
  const T = TOPICS[t], P = PERSONAS[p], I = INTENTS[i];
  const seg = segFor(t, p);
  const prod = T.products[seg] || T.products.default;
  const pool = T.pools[seg] || T.pools.default;
  const page = T.pages[seg] || T.pages.default;
  const [cat, catP] = T.cat[seg] || T.cat.default;
  const named = i === 'compare' ? (T.compare[seg] || T.compare.default) : [];
  const prompt = T.prompts[i][PERSONA_ORDER.indexOf(p)];
  const need = NEEDS[p][t];

  // sources: third-party pool (+ PNC added after outreach) and first-party pages
  const src = pool.map(s => {
    const o = Object.assign({}, s, { m: (s.m || []).map(x => x.slice()) });
    o.boosted = false;
    if (L.third && s.boost) {
      if (s.type === 'affiliate' || s.type === 'authority') { o.m.splice(s.boost[0] - 1, 0, ['pnc', s.boost[1], true]); }
      else { o.m.push(['pnc', s.boost[0], s.boost[1], s.boost[2], true]); }
      o.boosted = true;
    }
    return o;
  });
  src.push({ id: 'pncp', dom: 'pnc.com', path: page.path, t: page.t, type: 'owned', fmt: 'product', rel: .74, seo: .72, brand: 'pnc', issue: page.js ? 'js' : null, schema: true, kind: 'product' });
  src.push({ id: 'pncg', dom: 'pnc.com', path: T.article.path, t: T.article.t, type: 'owned', fmt: 'explainer', rel: .68, seo: .8, brand: 'pnc', schema: true, kind: 'article' });
  if (L.persona && p !== 'general' && T.ppages[p]) {
    const pp = T.ppages[p];
    src.push({ id: 'pncA', dom: 'pnc.com', path: pp.path, t: pp.t, type: 'owned', fmt: 'guide', rel: .76, seo: .48, brand: 'pnc', aud: p, schema: true, kind: 'persona', line: pp.line });
  }
  // PNC's dedicated checking bonus page: one of pnc.com's most-cited pages in AI answers
  const bonusAsk = t === 'checking' && /bonus|offer|promotion/i.test(prompt);
  if (bonusAsk && T.bonusSrc) T.bonusSrc.forEach(b => src.push(Object.assign({}, b, { m: (b.m || []).map(x => x.slice()) })));
  if (bonusAsk) src.push({ id: 'pncO', dom: 'pnc.com', path: '/personal-banking/banking/checking/bonus-offer.html', t: 'Checking Account Bonus Offer | PNC', type: 'owned', fmt: 'product', rel: .8, seo: .9, brand: 'pnc', schema: true, kind: 'offer', line: 'PNC lists its current checking bonus, how to qualify and the terms on its dedicated Bonus Offer page.' });
  if (i === 'txn') src.push({ id: 'pncL', dom: 'google.com', path: '/maps', t: `PNC Bank: ${T.localQ.replace('PNC ', '')}s near ${P.city}`, type: 'owned', fmt: 'local', rel: .62, seo: .78, brand: 'pnc', kind: 'local' });

  // fan-out query candidates
  const aud = P.aud;
  const nm = (b) => (prod[b] ? prod[b][0] : BRANDS[b].n);
  const fq = {
    info: [[`how does a ${cat} work`, 'explainer'], [`${cat} ${T.feeword} explained`, 'explainer'], [T.trustQ, 'trust'], [`${cat} pros and cons`, 'explainer'], [`reddit ${cat} advice`, 'community'], [`PNC ${cat}`, 'entity'], [`${catP} explained youtube`, 'community']],
    rec: [[`best ${catP} 2026`, 'commercial'], [`${cat} reviews`, 'trust'], [`reddit best ${cat}`, 'community'], [`PNC ${cat} review`, 'entity'], [`top rated ${catP} nerdwallet`, 'commercial'], [`best ${catP} youtube`, 'community'], [`${T.localQ} near ${P.city}`, 'local']],
    compare: named.length ? [[`${nm(named[0])} vs ${nm(named[1])}`, 'compare'], [`${nm(named[0])} ${T.feeword}`, 'entity'], [`${nm(named[1])} ${T.feeword}`, 'entity'], [`${nm(named[2])} ${T.feeword}`, 'entity'], [`${catP} comparison 2026`, 'freshness'], [`reddit ${BRANDS[named[0]].n} vs ${BRANDS[named[1]].n}`, 'community']] : [],
    txn: [[`apply ${cat} online`, 'howto'], [`${nm('pnc')} apply`, 'entity'], [`what do I need to open a ${cat}`, 'howto'], [`${cat} offers November 2026`, 'freshness'], [`${T.localQ} near ${P.city}`, 'local'], [`best ${cat} to open now`, 'commercial']]
  }[i];
  if (p !== 'general') fq.splice(1, 0, [`${catP} for ${aud}`, 'persona'], [`${cat} tips for ${aud}`, 'persona']);
  if (bonusAsk) fq.unshift(['PNC checking account bonus offer', 'entity'], ['checking account bonus offers this month', 'commercial']);

  // answer blocks
  const points = (T.points[seg] || T.points.default).map(([h, x]) => ({ b: null, h, t: x }));
  const ppoint = p !== 'general' ? { b: null, h: `For ${aud}`, t: T.pp[p], persona: true } : null;
  const brands = Object.keys(prod).map(b => ({ b, h: prod[b][0], t: prod[b][1], cells: prod[b].slice(2, 5), best: prod[b][5], cta: `${i === 'txn' && /card|loan|lend|mortgage/i.test(T.name) ? 'Apply' : 'Start'} at ${BRANDS[b].dom}` }));

  return {
    t, p, i, T, P, I, seg, prompt, named, cat, catP, need, src, fq, points, ppoint, brands,
    cols: T.cols, steps: (T.steps[seg] || T.steps.default), close: '',
    implied: I.implied(need[0]), explicit: [cat, I.cue].concat(p !== 'general' ? [aud] : []).concat(named.map(b => BRANDS[b].n)),
    inferred: need.slice(1),
    maxBrands: { info: 2, rec: 3, compare: 3, txn: 2 }[i]
  };
}

function simulate(modelKey, t, p, i, seed, levers) {
  const L = Object.assign({}, DEFAULT_LEVERS, levers || {});
  const M = MODELS[modelKey];
  const sc = buildScenario(t, p, i, L);
  const P = sc.P, I = sc.I;
  const rnd = rngFrom(hashStr(modelKey + t + p + i) + (seed || 0) * 7919);
  const jitter = (amt) => 1 + (rnd() - .5) * 2 * amt;

  /* ---- 1. Understand ---- */
  const usesMemory = P.mem.length > 0 && M.mem;
  const understand = {
    explicit: sc.explicit, inferred: p === 'general' ? sc.inferred.slice(0, 2) : sc.inferred,
    implied: sc.implied, memory: usesMemory ? P.mem : [], memBlocked: P.mem.length > 0 && !M.mem,
    confidence: Math.round((p === 'general' ? 62 : 84) + rnd() * 10)
  };

  /* ---- 2. Fan out ---- */
  const ranked = sc.fq.map((q, idx) => ({ q: q[0], type: q[1], p: M.qpref.indexOf(q[1]) + idx * .35 + rnd() * 1.2 })).sort((a, b) => a.p - b.p);
  const nFan = Math.min(sc.fq.length, Math.max(3, Math.round(M.fan * jitter(.12))));
  const queries = ranked.slice(0, nFan).map(q => {
    let text = q.q;
    if (q.type === 'local' && !usesMemory) text = text.replace(/near .*/, 'near me');
    return { q: text, type: q.type, hits: Math.round(6 + rnd() * 14) };
  });
  const typesFanned = new Set(queries.map(q => q.type));

  /* ---- 3. Retrieve + 4. Rank ---- */
  const fmtW = INTENT_FMT[i];
  const sources = sc.src.map(s => {
    const o = Object.assign({}, s);
    let score = s.rel * (M.w[s.type] || 1) * (fmtW[s.fmt] || 1);
    const seoF = (1 - M.seo) + M.seo * (s.seo == null ? .6 : s.seo);
    score *= seoF;
    o.tags = [];
    if (s.fmt === 'local' && !typesFanned.has('local')) score *= .45;
    if (s.type === 'social' && typesFanned.has('community')) score *= 1.12;
    // audience match: persona-targeted page vs general SEO article
    if (s.aud) {
      const m = s.aud === p ? (typesFanned.has('persona') ? 1.65 : 1.35) : .55;
      score *= m; o.audMatch = s.aud === p; o.tags.push(o.audMatch ? 'Audience match' : 'Audience mismatch');
    } else if (s.kind === 'article' && p !== 'general') { score *= .85; o.tags.push('General audience'); }
    // structured data
    o.schemaOn = !!(s.schema && L.schema);
    if (o.schemaOn) { score *= 1 + M.schema; o.tags.push('JSON-LD'); }
    o.status = 'kept';
    if (s.issue === 'js' && !M.renders) {
      if (o.schemaOn) { o.partial = true; score *= .55; o.reason = 'Body is JavaScript-rendered; facts read from JSON-LD in the static HTML'; }
      else { o.status = 'dropped'; o.reason = `JavaScript-rendered: ${M.bots[0]} saw an empty page`; score = 0; }
    }
    o.score = score > 0 ? Math.max(.01, score * jitter(.16)) : 0;
    return o;
  }).sort((a, b) => b.score - a.score);
  const k = Math.max(3, Math.round(M.k * jitter(.1)));
  let kept = 0;
  sources.forEach(s => { if (s.status === 'dropped') return; if (kept < k) { s.status = 'cited'; kept++; } else s.status = 'considered'; });
  const cited = sources.filter(s => s.status === 'cited');

  // organic SERP (for AI Overviews and the SEO lesson)
  const organic = sources.filter(s => s.fmt !== 'local').map(s => ({ s, v: (s.seo == null ? .6 : s.seo) * jitter(.08) })).sort((a, b) => b.v - a.v).map((x, idx) => Object.assign(x.s, { org: idx + 1 }) && x.s);

  /* ---- 5. Extract: which brands do the kept pages mention? ---- */
  const brandKeys = sc.brands.map(x => x.b);
  const posW = (pos) => 1 / (1 + .28 * (pos - 1));
  const sentW = { '+': 1, '~': .62, '-': .25 };
  const extraction = cited.map(s => {
    const ex = [];
    if (s.type === 'owned' || s.type === 'competitor') {
      if (s.brand && brandKeys.includes(s.brand)) ex.push({ b: s.brand, kind: 'fp', label: s.schemaOn ? 'Schema: product facts' : 'Page text', w: s.score * M.fp * (s.schemaOn ? 1.2 : 1) * (s.partial ? .8 : 1) * ({ article: .4, persona: .6, local: .8, offer: .55 }[s.kind] || 1) });
    } else if (s.m && s.m.length) {
      s.m.forEach((x, idx) => {
        if (!brandKeys.includes(x[0])) return;
        if (s.type === 'social') { const n = x[2]; ex.push({ b: x[0], kind: 'soc', sent: x[1], n, quote: x[3], boosted: !!x[4], w: s.score * M.soc * sentW[x[1]] * Math.min(1.4, .55 + .07 * n) }); }
        else ex.push({ b: x[0], kind: s.type === 'authority' ? 'auth' : 'aff', pos: idx + 1, label: x[1], boosted: !!x[2], w: s.score * (s.type === 'authority' ? .9 : M.aff) * posW(idx + 1) });
      });
    }
    return { s, ex };
  });

  /* ---- 6. Synthesize ---- */
  const named = sc.named;
  const brandScores = brandKeys.map(b => {
    let fp = 0, aff = 0, soc = 0; const ev = [];
    extraction.forEach(({ s, ex }) => ex.forEach(e => { if (e.b !== b) return; if (e.kind === 'fp') fp += e.w; else if (e.kind === 'soc') soc += e.w; else aff += e.w; ev.push(s.dom); }));
    const mem = M.param * BRANDS[b].prior * .9;
    const total = (fp + aff + soc + mem) * jitter(.2);
    return { b, fp, aff, soc, mem, total, named: named.includes(b), ev, memOnly: ev.length === 0 };
  }).sort((a, b) => b.total - a.total);
  // a brand needs absolute evidence AND to be competitive with the leader
  const threshold = Math.max(.6, .42 * (brandScores[0] ? brandScores[0].total : 0));
  const chosen = named.length ? brandScores.filter(x => x.named) : brandScores.filter(x => x.total >= threshold).slice(0, sc.maxBrands);
  let order = chosen.map(x => x.b);
  if (i === 'compare' && named.length) order = named.filter(b => order.includes(b)).concat(order.filter(b => !named.includes(b)));

  /* ---- 7. Render ---- */
  const citeNum = new Map();
  const citedIds = new Set(cited.map(s => s.id));
  const cite = (ids) => ids.filter(id => citedIds.has(id)).map(id => { if (!citeNum.has(id)) citeNum.set(id, citeNum.size + 1); return citeNum.get(id); });
  const topicSrc = cited.filter(s => s.type === 'authority' || (s.fmt === 'explainer' || s.fmt === 'guide' || s.fmt === 'review' || s.fmt === 'listicle'));
  const personaPage = cited.find(s => s.kind === 'persona');
  const generalArticle = cited.find(s => s.kind === 'article');
  const blocks = sc.points.map((pt, j) => Object.assign({}, pt, { cites: cite(topicSrc.slice(j % Math.max(1, topicSrc.length), j % Math.max(1, topicSrc.length) + 2).map(s => s.id)) }));
  if (sc.ppoint) {
    const ids = personaPage ? [personaPage.id] : cited.filter(s => s.type === 'social').slice(0, 1).map(s => s.id);
    blocks.push(Object.assign({}, sc.ppoint, { cites: cite(ids), fromPersonaPage: !!personaPage }));
  }
  const brandBlocks = order.map(b => {
    const it = sc.brands.find(x => x.b === b);
    const ids = extraction.filter(e => e.ex.some(x => x.b === b)).map(e => e.s.id);
    const c = cite(ids);
    const o = Object.assign({}, it, { cites: c, memOnly: c.length === 0 });
    if (b === 'pnc' && personaPage) o.t = it.t + ' ' + personaPage.line;
    const offerPage = cited.find(s => s.kind === 'offer');
    if (b === 'pnc' && offerPage) { o.t = o.t + ' ' + offerPage.line; o.cta = 'See the bonus offer at pnc.com'; }
    return o;
  });
  const answer = { blocks, brandBlocks, steps: sc.steps, cols: sc.cols, verdict: '' };
  if (i === 'compare' && order.length) { const lead = chosen[0].b; const it = sc.brands.find(x => x.b === lead); answer.verdict = `If ${it.best}, ${it.h} is the strongest fit.`; answer.verdictBrand = lead; }
  const citedOrdered = [...citeNum.entries()].sort((a, b) => a[1] - b[1]).map(([id]) => sources.find(s => s.id === id));

  /* ---- PNC scorecard ---- */
  const pncRank = chosen.map(x => x.b).indexOf('pnc');
  const pb = brandScores.find(x => x.b === 'pnc');
  const pncOwnedCited = citedOrdered.filter(s => s.type === 'owned');
  const mix = {}; Object.keys(SRC_TYPES).forEach(k2 => mix[k2] = 0); citedOrdered.forEach(s => mix[s.type]++);
  let facts = 'memory';
  if (cited.some(s => s.type === 'owned' && s.schemaOn)) facts = 'schema';
  else if (cited.some(s => s.type === 'owned')) facts = 'page';
  else if (pb && (pb.aff + pb.soc) > 0) facts = 'third-party';

  return {
    modelKey, t, p, i, seed, L, M, P, I, T: sc.T, sc,
    understand, queries, sources, cited, citedOrdered, extraction, organic,
    brandScores, order, chosen, answer, threshold,
    pnc: {
      mentioned: pncRank >= 0, rank: pncRank + 1, of: chosen.length, named: named.includes('pnc'),
      ownedCited: pncOwnedCited.length, totalCited: citedOrdered.length,
      memOnly: pb ? pb.memOnly && pncRank >= 0 : false,
      dropped: sources.filter(s => s.status === 'dropped' && s.type === 'owned'),
      partial: sources.filter(s => s.partial),
      personaPage: !!personaPage, generalArticle: !!generalArticle,
      fp: pb ? pb.fp : 0, aff: pb ? pb.aff : 0, soc: pb ? pb.soc : 0, mem: pb ? pb.mem : 0,
      facts
    },
    mix
  };
}

/* How often does PNC appear across N sampled runs? */
function mentionStats(m, t, p, i, n, levers) {
  n = n || 20;
  let c = 0, rankSum = 0, owned = 0; const runs = [];
  for (let s = 1; s <= n; s++) {
    const r = simulate(m, t, p, i, s * 13, levers);
    if (r.pnc.mentioned) { c++; rankSum += r.pnc.rank; }
    owned += r.pnc.ownedCited; runs.push(r.pnc.mentioned ? r.pnc.rank : 0);
  }
  return { rate: c / n, avgRank: c ? rankSum / c : null, avgOwned: owned / n, n, runs };
}
