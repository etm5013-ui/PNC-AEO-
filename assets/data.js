/* =====================================================================
   PNC AEO Lab: scenario data
   ---------------------------------------------------------------------
   Everything here is ILLUSTRATIVE. Model behaviors are simplified from
   public documentation and observed patterns; product details must be
   validated with PNC Product, Legal and Compliance before external use.
   ===================================================================== */

/* ---------- Brands that can appear in answers ----------
   prior = how "known" the brand is in a model's training data (parametric
   memory). Big national brands get named even when no source is retrieved. */
const BRANDS = {
  pnc:      { n: 'PNC',              prior: .50, c: '#EF6A00' },
  chase:    { n: 'Chase',            prior: .95 },
  boa:      { n: 'Bank of America',  prior: .90 },
  wf:       { n: 'Wells Fargo',      prior: .82 },
  capone:   { n: 'Capital One',      prior: .85 },
  citi:     { n: 'Citi',             prior: .72 },
  ally:     { n: 'Ally',             prior: .70 },
  sofi:     { n: 'SoFi',             prior: .62 },
  discover: { n: 'Discover',         prior: .66 },
  rocket:   { n: 'Rocket Mortgage',  prior: .80 },
  fidelity: { n: 'Fidelity',         prior: .82 },
  schwab:   { n: 'Charles Schwab',   prior: .78 },
  usbank:   { n: 'U.S. Bank',        prior: .55 }
};

/* ---------- Source types (chart categories, fixed order) ---------- */
const SRC_TYPES = {
  owned:      { n: 'PNC-owned',            c: '#EF6A00' },
  publisher:  { n: 'Publishers & reviews', c: '#2A6AB0' },
  authority:  { n: 'Gov & authority',      c: '#1E9E8A' },
  ugc:        { n: 'Community & video',    c: '#8A5CC2' },
  competitor: { n: 'Competitor sites',     c: '#C2416B' }
};

/* ---------- Models ----------
   w      = how strongly the model's retrieval favors each source type
   fan    = typical number of fan-out queries
   k      = number of sources typically cited
   param  = reliance on parametric memory (training data) vs live retrieval
   renders= whether its crawler/fetcher reliably executes JavaScript
   fresh  = how hard stale content is penalized (1 = normal)            */
const MODELS = {
  chatgpt: {
    name: 'ChatGPT', maker: 'OpenAI', ver: 'GPT-5 with search',
    index: 'Bing index + OpenAI search index',
    bots: ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot (training)'],
    fan: 7, k: 6, param: .32, renders: false, fresh: 1.1,
    w: { owned: .95, publisher: 1.18, authority: .95, ugc: 1.32, competitor: .9 },
    qpref: ['entity', 'commercial', 'community', 'explainer', 'compare', 'freshness', 'trust', 'local', 'howto'],
    memory: 'Memory',
    style: 'Conversational, skimmable headings, inline source pills, ends with an offer to go deeper.',
    lever: 'Allow OAI-SearchBot in robots.txt, make sure Bing indexes your key pages, and earn mentions in Reddit threads and the publisher roundups ChatGPT cites most.',
    tip: 'Leans hardest on publishers and Reddit. Cites roughly 5 to 8 sources and favors pages that answer in the first paragraph.'
  },
  gemini: {
    name: 'Gemini', maker: 'Google', ver: '3 Pro · Google Search grounding',
    index: 'Google Search index + Knowledge Graph',
    bots: ['Googlebot', 'Google-Extended (training control)'],
    fan: 9, k: 7, param: .22, renders: true, fresh: 1.35,
    w: { owned: 1.18, publisher: 1.0, authority: 1.05, ugc: 1.08, competitor: 1.05 },
    qpref: ['explainer', 'entity', 'local', 'compare', 'commercial', 'freshness', 'howto', 'trust', 'community'],
    memory: 'Personal context',
    style: 'Structured: bold headers, tables, "things to consider", then source chips.',
    lever: 'Classic Google SEO still applies. Add structured data (FAQPage, FinancialProduct), keep Google Business Profiles complete for local intent, and publish YouTube explainers.',
    tip: 'Fans out to the most queries, uses Google’s rendered index (so JavaScript pages count), and weights local and freshness signals.'
  },
  claude: {
    name: 'Claude', maker: 'Anthropic', ver: 'Opus with web search',
    index: 'Third-party web search (Brave) + live page fetch',
    bots: ['Claude-SearchBot', 'Claude-User', 'ClaudeBot (training)'],
    fan: 4, k: 5, param: .42, renders: false, fresh: 1.0,
    w: { owned: 1.05, publisher: 1.05, authority: 1.38, ugc: .72, competitor: .95 },
    qpref: ['explainer', 'trust', 'compare', 'entity', 'commercial', 'howto', 'freshness', 'local', 'community'],
    memory: 'Memory',
    style: 'Measured prose with caveats and numbered citations. Fewer, more authoritative sources.',
    lever: 'Be the authoritative primary source. Use clear, factual, server-rendered pages with dates and disclosures, cited by .gov and educational sources. Allow Claude-SearchBot.',
    tip: 'Runs fewer, broader searches, favors authoritative and primary sources, and relies more on what it already knows.'
  },
  copilot: {
    name: 'Copilot', maker: 'Microsoft', ver: 'Copilot with Bing grounding',
    index: 'Bing index (IndexNow-aware)',
    bots: ['Bingbot'],
    fan: 5, k: 5, param: .28, renders: false, fresh: 1.3,
    w: { owned: 1.22, publisher: 1.1, authority: .95, ugc: .85, competitor: 1.15 },
    qpref: ['entity', 'commercial', 'freshness', 'compare', 'howto', 'local', 'explainer', 'trust', 'community'],
    memory: 'Personalization',
    style: 'Concise, numbered superscript citations, a "Learn more" list and suggested follow-ups.',
    lever: 'Be in Bing. Verify in Bing Webmaster Tools, push updates with IndexNow, and keep product pages fresh. Copilot is the most willing to cite brand sites directly.',
    tip: 'Grounded on Bing and quick to cite brand and product pages, especially fresh ones.'
  }
};

/* ---------- Personas ---------- */
const PERSONAS = {
  general: {
    name: 'General / none specified', short: 'General', who: 'Anonymous user', av: '?',
    city: 'Pittsburgh, PA',
    mem: [],
    blurb: 'No memory or context. The model only has the prompt, so it falls back on generic, national answers.'
  },
  student: {
    name: 'College Student', short: 'Student', who: 'Maya, 19 · sophomore at Penn State', av: 'M',
    city: 'State College, PA',
    mem: ['Is a sophomore at Penn State', 'Works part-time, about $1,200/mo', 'Parents bank with PNC'],
    blurb: 'Low balances, irregular income, first account of her own. She cares about no fees, a good app, and not getting hit with overdrafts.'
  },
  starter: {
    name: 'The Starter', short: 'Starter', who: 'Jordan, 23 · first salaried job', av: 'J',
    city: 'Pittsburgh, PA',
    mem: ['Started first full-time job in July', 'Paying off $28k in student loans', 'Just signed a lease in Pittsburgh'],
    blurb: 'First paycheck, first lease, first real credit decisions. Wants to build credit, start saving, and not mess it up.'
  },
  fthb: {
    name: 'First-Time Home Buyer', short: 'Home buyer', who: 'Sam & Riley, 31 · renting in Columbus', av: 'S',
    city: 'Columbus, OH',
    mem: ['Renting in Columbus, OH', 'Household income about $115k', 'Saving for a first home in the next year'],
    blurb: 'A big, emotional, multi-month decision. They want down-payment help, a lender they trust, and to understand the process.'
  },
  ema: {
    name: 'Emerging Mass Affluent', short: 'Emerging affluent', who: 'Priya, 38 · director in Philadelphia', av: 'P',
    city: 'Philadelphia, PA',
    mem: ['Director-level role in Philadelphia', 'About $180k in savings and investments', 'Has a 401(k) and RSUs'],
    blurb: 'Growing income and complexity. Wants relationship pricing, premium perks, and a path to advice without “private bank” minimums.'
  }
};

/* ---------- Intents ---------- */
const INTENTS = {
  info:    { name: 'Information gathering',        short: 'Learn',     fmt: 'explainer', d: 'The user wants to understand a topic. Brands are incidental, and the model mostly cites explainers and authorities.' },
  rec:     { name: 'Looking for recommendations',  short: 'Recommend', fmt: 'shortlist', d: 'The user wants a shortlist. Publisher roundups and community threads decide who makes the cut.' },
  compare: { name: 'Comparing options',            short: 'Compare',   fmt: 'table',     d: 'The user names options or criteria. The model builds a side-by-side table from product pages and comparison content.' },
  txn:     { name: 'Purchase / transactional',     short: 'Act',       fmt: 'steps',     d: 'The user is ready to act. Product pages, application flows, and local signals carry the most weight.' }
};

/* How much each content format is boosted by each intent */
const INTENT_FMT = {
  info:    { explainer: 1.35, howto: 1.15, tool: 1.0, listicle: .85, compare: .9, product: .78, review: .85, thread: .95, local: .6, video: 1.0 },
  rec:     { explainer: .8, howto: .85, tool: .8, listicle: 1.45, compare: 1.1, product: .9, review: 1.25, thread: 1.2, local: .9, video: .95 },
  compare: { explainer: .8, howto: .8, tool: .9, listicle: 1.05, compare: 1.5, product: 1.2, review: 1.15, thread: 1.0, local: .7, video: .9 },
  txn:     { explainer: .7, howto: 1.2, tool: 1.3, listicle: .75, compare: .9, product: 1.55, review: .9, thread: .75, local: 1.35, video: .8 }
};

/* ---------- Scenarios (persona × intent) ----------
   fan:   fan-out queries [query, type]
   src:   candidate sources the retriever can find
   items: answer building blocks. b=null → always included (topic point);
          b=brand → included only if that brand wins enough evidence.
   named: brands named in the prompt (always discussed)
   aeo:   scenario-specific AEO recommendations                         */
const SCEN = {

/* ======================= GENERAL ======================= */
general_info: {
  prompt: 'How do high-yield savings accounts work, and is my money actually safe in one?',
  implied: 'Wants to earn more on idle cash without taking on risk. The real question is about trust: is an online bank as safe as a big bank?',
  explicit: ['high-yield savings', 'safety'],
  inferred: ['Risk-averse saver', 'Probably has cash in a low-rate account', 'Will compare online banks against traditional banks next'],
  fan: [
    ['how do high yield savings accounts work', 'explainer'],
    ['high yield savings account FDIC insurance limit', 'trust'],
    ['high yield savings vs traditional savings rates 2026', 'freshness'],
    ['are online banks safe', 'trust'],
    ['best high yield savings accounts', 'commercial'],
    ['PNC high yield savings', 'entity'],
    ['high yield savings pros and cons', 'explainer'],
    ['reddit is a HYSA worth it', 'community']
  ],
  src: [
    { id: 'fdic', dom: 'fdic.gov', t: 'Deposit Insurance FAQs', type: 'authority', fmt: 'explainer', rel: .92, b: [] },
    { id: 'inv', dom: 'investopedia.com', t: 'What Is a High-Yield Savings Account?', type: 'publisher', fmt: 'explainer', rel: .9, b: [] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'Best High-Yield Online Savings Accounts of 2026', type: 'publisher', fmt: 'listicle', rel: .78, b: ['ally', 'capone', 'sofi'] },
    { id: 'br', dom: 'bankrate.com', t: 'High-yield savings vs. traditional savings', type: 'publisher', fmt: 'compare', rel: .8, b: ['ally', 'capone', 'pnc'] },
    { id: 'pncp', dom: 'pnc.com', path: '/personal-banking/banking/savings/high-yield-savings', t: 'PNC High Yield Savings℠', type: 'owned', fmt: 'product', rel: .66, b: ['pnc'], issue: 'js' },
    { id: 'pnci', dom: 'pnc.com', path: '/insights/personal-finance/save', t: 'What Is a High-Yield Savings Account?', type: 'owned', fmt: 'explainer', rel: .74, b: ['pnc'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/personalfinance', t: 'Is a HYSA actually safe? What happens if the bank fails?', type: 'ugc', fmt: 'thread', rel: .7, b: ['ally', 'sofi', 'capone'] },
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'Checking and savings account basics', type: 'authority', fmt: 'explainer', rel: .74, b: [] },
    { id: 'ally', dom: 'ally.com', t: 'Online Savings Account', type: 'competitor', fmt: 'product', rel: .6, b: ['ally'] }
  ],
  items: [
    { b: null, h: 'How they work', t: 'A high-yield savings account pays a higher APY than a typical savings account. That’s often because online banks have lower overhead. Interest usually compounds daily and posts monthly, and the rate is variable, so it can move with the Fed.', src: ['inv', 'pnci', 'br'] },
    { b: null, h: 'Is your money safe?', t: 'Yes, as long as the bank is FDIC-insured. Deposits are covered up to $250,000 per depositor, per insured bank, per ownership category. You can confirm a bank’s status with the FDIC’s BankFind tool.', src: ['fdic', 'cfpb'] },
    { b: null, h: 'Trade-offs to know', t: 'Rates aren’t locked, some accounts need a minimum balance for the top rate, and moving money to an outside checking account can take 1 to 3 business days.', src: ['inv', 'rd'] },
    { b: 'pnc', h: 'PNC High Yield Savings', t: 'Traditional banks compete here too. PNC offers a High Yield Savings account, which suits you if you want a higher rate with an established bank you can also visit in person. Availability varies by market.', src: ['pncp', 'pnci', 'br'] },
    { b: 'ally', h: 'Ally', t: 'Online-only banks like Ally come up often for competitive APYs, no monthly fees, and no minimums.', src: ['ally', 'nw', 'rd'] },
    { b: 'capone', h: 'Capital One 360', t: 'Capital One 360 Performance Savings is a common pick if you want an online rate with some branch and café access.', src: ['nw', 'br', 'rd'] },
    { b: 'sofi', h: 'SoFi', t: 'SoFi pairs savings with checking and usually advertises its best APY with direct deposit.', src: ['nw', 'rd'] }
  ],
  maxBrands: 2,
  aeo: [
    { lever: 'Content', t: 'Own the definition', d: 'Open the PNC Insights explainer with a 40 to 60 word definition, then FDIC facts and a dated example. Models lift answer-first paragraphs almost verbatim.' },
    { lever: 'Technical', t: 'Server-render the rate module', d: 'The High Yield Savings product page loads its rate and features client-side. Bing-based and fetch-based retrievers see an empty shell.' },
    { lever: 'Off-site', t: 'Be in the roundups', d: 'NerdWallet and Reddit decide the shortlist. Make sure PNC High Yield Savings is reviewed and current on the top three publisher lists.' }
  ]
},

general_rec: {
  prompt: 'What’s the best bank for everyday checking? I want a good app and no surprise fees.',
  implied: 'Wants a primary checking account and is fee-averse, likely after a bad overdraft or fee experience. Digital experience matters as much as the rate.',
  explicit: ['checking', 'good app', 'no surprise fees'],
  inferred: ['Switching banks', 'Has been burned by overdraft fees', 'Values budgeting tools'],
  fan: [
    ['best checking accounts 2026', 'commercial'],
    ['banks with no overdraft fees', 'commercial'],
    ['best banking app ratings 2026', 'freshness'],
    ['checking account with no monthly fee', 'commercial'],
    ['PNC Virtual Wallet review', 'entity'],
    ['reddit best bank for checking', 'community'],
    ['J.D. Power retail banking app satisfaction', 'trust'],
    ['how to choose a checking account', 'explainer']
  ],
  src: [
    { id: 'nw', dom: 'nerdwallet.com', t: 'Best Checking Accounts of 2026', type: 'publisher', fmt: 'listicle', rel: .9, b: ['capone', 'ally', 'chase', 'sofi'] },
    { id: 'fa', dom: 'forbes.com', path: '/advisor', t: 'Best Free Checking Accounts', type: 'publisher', fmt: 'listicle', rel: .82, b: ['capone', 'sofi', 'discover'] },
    { id: 'br', dom: 'bankrate.com', t: 'PNC Virtual Wallet review 2026', type: 'publisher', fmt: 'review', rel: .72, b: ['pnc'] },
    { id: 'jdp', dom: 'jdpower.com', t: 'U.S. Banking Mobile App Satisfaction Study', type: 'authority', fmt: 'review', rel: .7, b: ['chase', 'capone', 'pnc', 'boa'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/personalfinance', t: 'Which big bank has the least annoying fees?', type: 'ugc', fmt: 'thread', rel: .74, b: ['capone', 'ally', 'chase'] },
    { id: 'pncv', dom: 'pnc.com', path: '/personal-banking/banking/checking/virtual-wallet', t: 'Virtual Wallet® | Checking + Savings', type: 'owned', fmt: 'product', rel: .66, b: ['pnc'] },
    { id: 'pncl', dom: 'pnc.com', path: '/personal-banking/banking/low-cash-mode', t: 'Low Cash Mode® | Overdraft Help', type: 'owned', fmt: 'explainer', rel: .62, b: ['pnc'] },
    { id: 'chase', dom: 'chase.com', t: 'Chase Total Checking®', type: 'competitor', fmt: 'product', rel: .58, b: ['chase'] },
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'Overdraft and NSF fees: what to know', type: 'authority', fmt: 'explainer', rel: .55, b: [] }
  ],
  items: [
    { b: 'capone', h: 'Capital One 360 Checking', t: 'Frequently ranked first for no monthly fees, no overdraft fees, and a highly rated app.', src: ['nw', 'fa', 'rd', 'jdp'] },
    { b: 'pnc', h: 'PNC Virtual Wallet', t: 'Pairs checking with savings and built-in budgeting tools like Spend Analyzer and the Money Bar. Low Cash Mode gives you extra time to cover a negative balance before an overdraft fee.', src: ['br', 'pncv', 'pncl', 'jdp'] },
    { b: 'ally', h: 'Ally Spending Account', t: 'Online-only with no monthly fees and strong savings-bucket tools. There are no branches, though.', src: ['nw', 'rd'] },
    { b: 'chase', h: 'Chase Total Checking', t: 'The largest branch and ATM network and a polished app. The monthly fee is waivable with direct deposit.', src: ['nw', 'chase', 'jdp', 'rd'] },
    { b: 'sofi', h: 'SoFi Checking & Savings', t: 'No account fees and early direct deposit, with the best APY tied to direct deposit.', src: ['nw', 'fa'] },
    { b: 'discover', h: 'Discover Cashback Debit', t: 'No fees and cash back on debit purchases, which is unusual for a checking account.', src: ['fa'] }
  ],
  close: 'If branch access matters, a national bank with fee-avoidance tools may suit you. If you’re fine being fully digital, online banks are usually cheapest.',
  maxBrands: 4,
  aeo: [
    { lever: 'Off-site', t: 'Win the “best checking” roundups', d: 'For broad recommendation prompts, the publisher listicle is the answer. PNC needs Virtual Wallet placements, with accurate fee data, on NerdWallet and Forbes Advisor.' },
    { lever: 'Content', t: 'Name the differentiator the way users ask', d: 'Users ask about “no surprise fees.” Publish a plain-language Low Cash Mode explainer that answers “Does PNC charge overdraft fees?” directly.' },
    { lever: 'Off-site', t: 'Seed authentic community proof', d: 'Reddit threads drive ChatGPT shortlists. Support genuine customer stories and staff-disclosed answers in relevant subreddits.' }
  ]
},

general_compare: {
  prompt: 'PNC vs Chase vs Wells Fargo for checking: which one is actually better?',
  implied: 'Already has a shortlist of national banks and is likely in a PNC footprint market. Wants a tie-breaker on fees, perks, and app quality.',
  explicit: ['PNC', 'Chase', 'Wells Fargo', 'checking'],
  inferred: ['Branch access matters', 'Likely moving or switching banks', 'Decision within weeks'],
  named: ['pnc', 'chase', 'wf'],
  fan: [
    ['PNC vs Chase checking', 'compare'],
    ['PNC Virtual Wallet monthly fee waive', 'entity'],
    ['Chase Total Checking fee requirements', 'entity'],
    ['Wells Fargo Everyday Checking fees', 'entity'],
    ['PNC vs Wells Fargo overdraft policy', 'compare'],
    ['bank app ratings PNC Chase Wells Fargo', 'trust'],
    ['checking account sign-up bonus 2026', 'freshness'],
    ['reddit PNC vs Chase', 'community']
  ],
  src: [
    { id: 'pncv', dom: 'pnc.com', path: '/personal-banking/banking/checking/virtual-wallet', t: 'Compare Virtual Wallet® accounts', type: 'owned', fmt: 'product', rel: .84, b: ['pnc'] },
    { id: 'pncc', dom: 'pnc.com', path: '/personal-banking/banking/checking/compare', t: 'Compare checking accounts', type: 'owned', fmt: 'compare', rel: .7, b: ['pnc'], issue: 'js' },
    { id: 'chase', dom: 'chase.com', t: 'Chase Total Checking®: fees and requirements', type: 'competitor', fmt: 'product', rel: .82, b: ['chase'] },
    { id: 'wf', dom: 'wellsfargo.com', t: 'Everyday Checking', type: 'competitor', fmt: 'product', rel: .78, b: ['wf'] },
    { id: 'br', dom: 'bankrate.com', t: 'Chase vs. PNC: Which bank is right for you?', type: 'publisher', fmt: 'compare', rel: .86, b: ['pnc', 'chase'] },
    { id: 'gb', dom: 'gobankingrates.com', t: 'Chase vs. Wells Fargo checking compared', type: 'publisher', fmt: 'compare', rel: .72, b: ['chase', 'wf'] },
    { id: 'jdp', dom: 'jdpower.com', t: 'U.S. Retail Banking Satisfaction Study', type: 'authority', fmt: 'review', rel: .66, b: ['chase', 'pnc', 'wf'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/banking', t: 'PNC or Chase? Moving to Pittsburgh', type: 'ugc', fmt: 'thread', rel: .68, b: ['pnc', 'chase'] }
  ],
  cols: ['Monthly fee & waiver', 'Overdraft approach', 'Standout feature'],
  items: [
    { b: 'pnc', h: 'PNC Virtual Wallet', cells: ['Fee waivable with qualifying direct deposit or balance', 'Low Cash Mode: alerts plus extra time to fix a negative balance', 'Built-in Spend, Reserve and Growth accounts with budgeting tools'], src: ['pncv', 'pncc', 'br', 'jdp'] },
    { b: 'chase', h: 'Chase Total Checking', cells: ['Fee waivable with direct deposit or balance', 'Overdraft assist on small overdrafts', 'Largest branch and ATM network; frequent sign-up bonus'], src: ['chase', 'br', 'gb'] },
    { b: 'wf', h: 'Wells Fargo Everyday Checking', cells: ['Fee waivable with direct deposit or balance', 'Extra Day Grace Period', 'Large footprint, especially in the West and South'], src: ['wf', 'gb'] }
  ],
  verdict: { pnc: 'Pick PNC if budgeting tools and overdraft protection matter most and you live in its footprint.', chase: 'Pick Chase if you travel and want the biggest ATM network or a sign-up bonus.', wf: 'Pick Wells Fargo for its footprint in the West and South.' },
  maxBrands: 3,
  aeo: [
    { lever: 'Technical', t: 'Fix the comparison page', d: 'pnc.com’s “compare checking” page renders its table with JavaScript. Most retrievers read the static HTML, so PNC’s own comparison is invisible on head-to-head prompts.' },
    { lever: 'Content', t: 'Publish fair head-to-heads', d: 'Models trust comparison content that names competitors. A factual “PNC vs. Chase checking” page with a dated table gives models a primary source to cite.' },
    { lever: 'Measurement', t: 'Track branded comparison prompts', d: 'Named comparisons are where PNC is guaranteed to appear. Measure whether the facts are right (fees, waivers, overdraft), not just whether PNC shows up.' }
  ]
},

general_txn: {
  prompt: 'I want to open a checking account online today. Which one has a good sign-up bonus right now, and how do I apply?',
  implied: 'Ready to convert now. Wants a current promotion, and the answer needs to hand off to a live application.',
  explicit: ['open online', 'today', 'sign-up bonus'],
  inferred: ['High purchase intent', 'Rate and bonus sensitive', 'Needs fresh, dated information'],
  fan: [
    ['checking account bonus offers November 2026', 'freshness'],
    ['open checking account online same day', 'howto'],
    ['PNC checking account bonus', 'entity'],
    ['Chase checking bonus requirements', 'entity'],
    ['best bank bonuses this month', 'commercial'],
    ['what do I need to open a bank account online', 'howto'],
    ['bank near me open account', 'local'],
    ['doctor of credit bank bonuses', 'community']
  ],
  src: [
    { id: 'pncb', dom: 'pnc.com', path: '/personal-banking/banking/checking/offers', t: 'Virtual Wallet: current offer, terms and apply', type: 'owned', fmt: 'product', rel: .82, b: ['pnc'], issue: 'stale', date: 'Updated Jan 2025' },
    { id: 'chase', dom: 'chase.com', path: '/personal/checking/coupon', t: 'Chase checking: new customer offer', type: 'competitor', fmt: 'product', rel: .84, b: ['chase'] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'Best Bank Bonuses and Promotions, November 2026', type: 'publisher', fmt: 'listicle', rel: .88, b: ['chase', 'wf', 'capone', 'pnc'] },
    { id: 'doc', dom: 'doctorofcredit.com', t: 'Best Bank Account Bonuses', type: 'ugc', fmt: 'thread', rel: .74, b: ['chase', 'pnc', 'citi'] },
    { id: 'wf', dom: 'wellsfargo.com', t: 'Everyday Checking: new account offer', type: 'competitor', fmt: 'product', rel: .7, b: ['wf'] },
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'What do I need to open a bank account?', type: 'authority', fmt: 'howto', rel: .66, b: [] },
    { id: 'pncg', dom: 'google.com', path: '/maps', t: 'PNC Bank branches near you', type: 'owned', fmt: 'local', rel: .6, b: ['pnc'] },
    { id: 'capone', dom: 'capitalone.com', t: '360 Checking: open in 5 minutes', type: 'competitor', fmt: 'product', rel: .66, b: ['capone'] }
  ],
  steps: ['Pick an account and check the bonus terms (qualifying direct deposits and the deadline).', 'Have your SSN, a government ID, and a funding account ready.', 'Apply online. It usually takes 5 to 10 minutes.', 'Set up direct deposit before the promo window closes.'],
  items: [
    { b: 'chase', h: 'Chase Total Checking', t: 'Usually has a new-customer bonus that requires qualifying direct deposits within 90 days.', cta: 'Open at chase.com', src: ['chase', 'nw', 'doc'] },
    { b: 'pnc', h: 'PNC Virtual Wallet', t: 'Periodically offers a bonus tied to qualifying direct deposits. Check pnc.com for the current offer and terms in your area.', cta: 'Apply at pnc.com', src: ['pncb', 'nw', 'doc', 'pncg'] },
    { b: 'wf', h: 'Wells Fargo Everyday Checking', t: 'Runs seasonal new-account offers with direct deposit requirements.', cta: 'Open at wellsfargo.com', src: ['wf', 'nw'] },
    { b: 'capone', h: 'Capital One 360 Checking', t: 'No bonus most months, but the fastest no-fee online opening.', cta: 'Open at capitalone.com', src: ['capone', 'nw'] }
  ],
  maxBrands: 2,
  aeo: [
    { lever: 'Technical', t: 'Freshness is a ranking factor', d: 'The PNC offers page shows a last-modified date from early 2025. For “right now” prompts, Gemini and Copilot heavily discount stale pages. Update it, set dateModified, and ping IndexNow.' },
    { lever: 'Content', t: 'Make the offer extractable', d: 'Put the bonus amount, requirements, and expiration in plain HTML near the top, with Offer schema. Models will not dig through accordions.' },
    { lever: 'Off-site', t: 'Feed the deal trackers', d: 'Doctor of Credit and NerdWallet’s monthly bonus lists are top-cited for transactional bonus prompts. Brief them on every promotion launch.' }
  ]
},

/* ======================= COLLEGE STUDENT ======================= */
student_info: {
  prompt: 'What should a college student look for in a bank account?',
  implied: 'Opening a first independent account. Worried about fees and overdrafts on a small, irregular income. Will likely ask “which bank?” next.',
  explicit: ['college student', 'bank account'],
  inferred: ['Low, irregular balance', 'Overdraft risk', 'Wants to send money to friends easily', 'May be near campus ATMs'],
  fan: [
    ['what to look for in a student bank account', 'explainer'],
    ['student checking account no monthly fee', 'commercial'],
    ['how to avoid overdraft fees in college', 'howto'],
    ['student bank account Zelle Venmo', 'explainer'],
    ['banks near Penn State campus', 'local'],
    ['PNC Virtual Wallet Student', 'entity'],
    ['CFPB college banking guide', 'trust'],
    ['reddit first bank account college', 'community']
  ],
  src: [
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'Choosing a college bank account', type: 'authority', fmt: 'explainer', rel: .9, b: [] },
    { id: 'inv', dom: 'investopedia.com', t: 'How to Choose a Student Bank Account', type: 'publisher', fmt: 'explainer', rel: .84, b: ['chase', 'capone'] },
    { id: 'pncs', dom: 'pnc.com', path: '/personal-banking/banking/checking/virtual-wallet-student', t: 'Virtual Wallet® Student', type: 'owned', fmt: 'product', rel: .74, b: ['pnc'] },
    { id: 'pnci', dom: 'pnc.com', path: '/insights/personal-finance/college', t: 'Banking tips for college students', type: 'owned', fmt: 'explainer', rel: .72, b: ['pnc'] },
    { id: 'yt', dom: 'youtube.com', t: 'Banking 101 for college students (video)', type: 'ugc', fmt: 'video', rel: .64, b: ['chase'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/college', t: 'What bank do you use in college?', type: 'ugc', fmt: 'thread', rel: .66, b: ['chase', 'capone', 'pnc'] },
    { id: 'gmb', dom: 'google.com', path: '/maps', t: 'Banks & ATMs near Penn State, University Park', type: 'owned', fmt: 'local', rel: .55, b: ['pnc'] },
    { id: 'chase', dom: 'chase.com', t: 'Chase College Checking℠', type: 'competitor', fmt: 'product', rel: .58, b: ['chase'] }
  ],
  items: [
    { b: null, h: 'No monthly fee while you’re in school', t: 'Many banks waive fees for students, often until graduation or for a set number of years. Read how “student status” is verified and when the waiver ends.', src: ['cfpb', 'inv', 'pncs'] },
    { b: null, h: 'Overdraft protection that fits a tight budget', t: 'Look for low-balance alerts, no or low overdraft fees, and a grace period to fix a negative balance.', src: ['cfpb', 'pnci'] },
    { b: null, h: 'A strong app plus Zelle', t: 'Mobile deposit, instant alerts, and Zelle make splitting rent and dinner easier.', src: ['inv', 'yt', 'rd'] },
    { b: null, h: 'ATMs where you actually are', t: 'Check for fee-free ATMs on or near campus and in your hometown.', src: ['gmb', 'rd'] },
    { b: 'pnc', h: 'Example: PNC Virtual Wallet Student', t: 'No monthly service charge while you’re a student, budgeting tools built in, and Low Cash Mode to help avoid overdraft fees. It also links easily to a parent’s PNC account.', src: ['pncs', 'pnci', 'rd', 'gmb'] },
    { b: 'chase', h: 'Example: Chase College Checking', t: 'No monthly fee for up to five years while in school, with a large ATM network.', src: ['chase', 'inv', 'yt'] },
    { b: 'capone', h: 'Example: Capital One 360 Checking', t: 'No fees at all, which works for students who don’t need branches.', src: ['inv', 'rd'] }
  ],
  maxBrands: 2,
  aeo: [
    { lever: 'Content', t: 'Answer the checklist question', d: 'Info prompts reward checklist-style explainers. A PNC Insights “student bank account checklist” with FAQ schema can become the cited source, with Virtual Wallet Student shown as the example.' },
    { lever: 'Off-site', t: 'Get into campus community content', d: 'Students trust r/college and YouTube creators. Campus ambassador content and university financial-literacy partnerships feed both.' },
    { lever: 'Technical', t: 'Claim every campus location', d: 'Gemini adds a local query for students. Complete Google Business Profiles for on-campus PNC branches and ATMs.' }
  ]
},

student_rec: {
  prompt: 'What’s the best bank account for a college student with no fees?',
  implied: 'Wants a short, trustworthy pick list. Fee-free is the main filter, and an easy app is the tie-breaker.',
  explicit: ['college student', 'no fees'],
  inferred: ['Low balance', 'Parents may co-sign or transfer money', 'Mobile-first'],
  fan: [
    ['best student checking accounts 2026', 'commercial'],
    ['best bank for college students no fees', 'commercial'],
    ['student checking account comparison', 'compare'],
    ['PNC Virtual Wallet Student review', 'entity'],
    ['reddit best bank for college student', 'community'],
    ['bank near Penn State', 'local'],
    ['student bank account sign up bonus', 'freshness']
  ],
  src: [
    { id: 'nw', dom: 'nerdwallet.com', t: 'Best Student Checking Accounts', type: 'publisher', fmt: 'listicle', rel: .9, b: ['capone', 'chase', 'discover', 'pnc'] },
    { id: 'fa', dom: 'forbes.com', path: '/advisor', t: 'Best Student Bank Accounts of 2026', type: 'publisher', fmt: 'listicle', rel: .84, b: ['chase', 'capone', 'boa'] },
    { id: 'cs', dom: 'cnbc.com', path: '/select', t: 'Best checking accounts for college students', type: 'publisher', fmt: 'listicle', rel: .78, b: ['capone', 'discover', 'chase'] },
    { id: 'pncs', dom: 'pnc.com', path: '/personal-banking/banking/checking/virtual-wallet-student', t: 'Virtual Wallet® Student', type: 'owned', fmt: 'product', rel: .7, b: ['pnc'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/college', t: 'Best bank for a broke college student?', type: 'ugc', fmt: 'thread', rel: .76, b: ['capone', 'discover', 'chase'] },
    { id: 'tk', dom: 'tiktok.com', t: '“Bank accounts I wish I had in college”', type: 'ugc', fmt: 'video', rel: .52, b: ['sofi', 'capone'] },
    { id: 'chase', dom: 'chase.com', t: 'Chase College Checking℠', type: 'competitor', fmt: 'product', rel: .6, b: ['chase'] },
    { id: 'pnci', dom: 'pnc.com', path: '/insights/personal-finance/college', t: 'Banking tips for college students', type: 'owned', fmt: 'explainer', rel: .55, b: ['pnc'] }
  ],
  items: [
    { b: 'capone', h: 'Capital One 360 Checking', t: 'No monthly fees, no minimums, no overdraft fees, and a top-rated app. A favorite on Reddit.', src: ['nw', 'cs', 'rd', 'tk'] },
    { b: 'chase', h: 'Chase College Checking', t: 'No monthly fee for up to five years while enrolled, plus a large branch and ATM network.', src: ['chase', 'fa', 'nw', 'rd'] },
    { b: 'pnc', h: 'PNC Virtual Wallet Student', t: 'No monthly service charge while you’re a student, with checking and savings bundled. Low Cash Mode and budgeting tools fit a tight budget, and PNC has branches and ATMs on many campuses.', src: ['pncs', 'nw', 'pnci'] },
    { b: 'discover', h: 'Discover Cashback Debit', t: 'No fees and cash back on debit purchases.', src: ['cs', 'rd'] },
    { b: 'boa', h: 'Bank of America Advantage SafeBalance', t: 'Monthly fee waived for students under 24, and no overdraft fees because it can’t overdraw.', src: ['fa'] },
    { b: 'sofi', h: 'SoFi Checking & Savings', t: 'No account fees, early paycheck access, and a high APY with direct deposit.', src: ['tk'] }
  ],
  close: 'If your parents already bank somewhere, check whether that bank has a student account. Linking accounts makes transfers instant.',
  maxBrands: 4,
  aeo: [
    { lever: 'Off-site', t: 'Make the NerdWallet and Forbes lists', d: '“Best” prompts are answered almost entirely from publisher roundups. PNC appears on some and not others, which is the main source of run-to-run variability.' },
    { lever: 'Content', t: 'Lead with the family-banking angle', d: 'This persona’s memory says “parents bank with PNC.” Content about linking a student account to a parent’s account gives models a reason to personalize toward PNC.' },
    { lever: 'Off-site', t: 'Short-form video', d: 'TikTok and YouTube are increasingly retrieved for student prompts. Creator partnerships around first-account tips can shift what gets cited.' }
  ]
},

student_compare: {
  prompt: 'Compare PNC Virtual Wallet Student vs Chase College Checking vs Bank of America for a college student.',
  implied: 'Down to three options, possibly influenced by parents (PNC) and campus presence. Wants a clear table and a recommendation.',
  explicit: ['PNC Virtual Wallet Student', 'Chase College Checking', 'Bank of America'],
  inferred: ['Branch presence on campus matters', 'Wants a verdict, not only a table'],
  named: ['pnc', 'chase', 'boa'],
  fan: [
    ['PNC Virtual Wallet Student vs Chase College Checking', 'compare'],
    ['PNC Virtual Wallet Student monthly fee', 'entity'],
    ['Chase College Checking fee after graduation', 'entity'],
    ['Bank of America Advantage SafeBalance student', 'entity'],
    ['student checking overdraft policy comparison', 'compare'],
    ['which banks have ATMs at Penn State', 'local'],
    ['reddit PNC vs Chase college', 'community']
  ],
  src: [
    { id: 'pncs', dom: 'pnc.com', path: '/personal-banking/banking/checking/virtual-wallet-student', t: 'Virtual Wallet® Student: features and fees', type: 'owned', fmt: 'product', rel: .86, b: ['pnc'] },
    { id: 'chase', dom: 'chase.com', t: 'Chase College Checking℠', type: 'competitor', fmt: 'product', rel: .84, b: ['chase'] },
    { id: 'boa', dom: 'bankofamerica.com', t: 'Advantage SafeBalance Banking®', type: 'competitor', fmt: 'product', rel: .8, b: ['boa'] },
    { id: 'br', dom: 'bankrate.com', t: 'Best student checking accounts compared', type: 'publisher', fmt: 'compare', rel: .78, b: ['chase', 'boa', 'pnc'] },
    { id: 'gb', dom: 'gobankingrates.com', t: 'Chase vs. Bank of America for students', type: 'publisher', fmt: 'compare', rel: .7, b: ['chase', 'boa'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/PennStateUniversity', t: 'PNC or Chase for school?', type: 'ugc', fmt: 'thread', rel: .66, b: ['pnc', 'chase'] },
    { id: 'gmb', dom: 'google.com', path: '/maps', t: 'PNC Bank: HUB-Robeson Center ATM', type: 'owned', fmt: 'local', rel: .52, b: ['pnc'] }
  ],
  cols: ['Monthly fee', 'Overdraft approach', 'Best for'],
  items: [
    { b: 'pnc', h: 'PNC Virtual Wallet Student', cells: ['None while a student', 'Low Cash Mode: alerts plus extra time to fix a negative balance', 'Built-in savings and budgeting; easy links to a parent’s PNC account'], src: ['pncs', 'br', 'rd', 'gmb'] },
    { b: 'chase', h: 'Chase College Checking', cells: ['None for up to 5 years while enrolled', 'Overdraft assist for small amounts', 'Big ATM network; frequent student bonus'], src: ['chase', 'br', 'gb'] },
    { b: 'boa', h: 'BofA Advantage SafeBalance', cells: ['Waived for students under 24', 'No overdrafts (transactions decline)', 'Students who want zero overdraft risk'], src: ['boa', 'gb', 'br'] }
  ],
  verdict: { pnc: 'If your family already banks with PNC and you want savings and budgeting built in, PNC Virtual Wallet Student is the most complete package.', chase: 'If a sign-up bonus and ATM reach matter most, Chase has the edge.', boa: 'If you never want to risk overdrafting, BofA SafeBalance is the simplest.' },
  maxBrands: 3,
  aeo: [
    { lever: 'Content', t: 'Publish the fee facts plainly', d: 'In head-to-heads, models pull fees and waiver rules from product pages. Keep Virtual Wallet Student’s eligibility, fee, and post-graduation conversion rules in crawlable HTML.' },
    { lever: 'Technical', t: 'Add FinancialProduct schema', d: 'Structured fee and feature data helps Gemini build comparison tables accurately.' },
    { lever: 'Measurement', t: 'Audit the verdict, not just the mention', d: 'PNC always appears when named. The KPI is whether the verdict line favors PNC for the right reason.' }
  ]
},

student_txn: {
  prompt: 'How do I open a student checking account online today? I’m 19 and my parents bank with PNC.',
  implied: 'Ready to open now. The family relationship is a strong signal toward PNC, but the model needs a clear, current application path.',
  explicit: ['open online today', '19', 'parents bank with PNC'],
  inferred: ['High intent toward PNC', 'May need a parent as joint owner', 'Wants to finish on mobile'],
  named: ['pnc'],
  fan: [
    ['open PNC Virtual Wallet Student online', 'entity'],
    ['PNC student account requirements age 19', 'howto'],
    ['add student to parent PNC account', 'howto'],
    ['what documents to open student bank account', 'howto'],
    ['PNC branch near State College', 'local'],
    ['student checking bonus 2026', 'freshness']
  ],
  src: [
    { id: 'pncs', dom: 'pnc.com', path: '/personal-banking/banking/checking/virtual-wallet-student', t: 'Virtual Wallet® Student: apply online', type: 'owned', fmt: 'product', rel: .92, b: ['pnc'] },
    { id: 'pnch', dom: 'pnc.com', path: '/help/open-account', t: 'How to open an account: what you’ll need', type: 'owned', fmt: 'howto', rel: .8, b: ['pnc'], issue: 'js' },
    { id: 'gmb', dom: 'google.com', path: '/maps', t: 'PNC Bank: State College branches', type: 'owned', fmt: 'local', rel: .6, b: ['pnc'] },
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'What do I need to open a bank account?', type: 'authority', fmt: 'howto', rel: .7, b: [] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'Best Student Checking Accounts', type: 'publisher', fmt: 'listicle', rel: .58, b: ['capone', 'chase', 'pnc'] },
    { id: 'chase', dom: 'chase.com', t: 'Chase College Checking℠: open online', type: 'competitor', fmt: 'product', rel: .5, b: ['chase'] }
  ],
  steps: ['Go to pnc.com → Virtual Wallet Student → Apply Now (or use the PNC mobile app).', 'Have your SSN, a government ID, your school name, and expected graduation date.', 'Students over 18 can apply alone. A parent can be added as a joint owner, and accounts can be linked for instant transfers.', 'Fund the account, download the app, and turn on Low Cash Mode alerts.'],
  items: [
    { b: 'pnc', h: 'PNC Virtual Wallet Student', t: 'Since your parents bank with PNC, linking accounts makes transfers instant. No monthly service charge while you’re a student.', cta: 'Apply at pnc.com', src: ['pncs', 'pnch', 'gmb'] },
    { b: 'chase', h: 'Chase College Checking', t: 'An alternative if you want a new-student bonus.', cta: 'Open at chase.com', src: ['chase', 'nw'] },
    { b: 'capone', h: 'Capital One 360 Checking', t: 'Fully online with no fees.', cta: 'Open at capitalone.com', src: ['nw'] }
  ],
  maxBrands: 2,
  aeo: [
    { lever: 'Technical', t: 'Unblock the “how to open” help page', d: 'The requirements page is rendered client-side, so most retrievers can’t read the document list and fall back to the CFPB’s generic guide. Server-render it.' },
    { lever: 'Content', t: 'Answer the family question', d: 'Add a clear “Can my parent be on my student account?” FAQ. It directly matches how this persona prompts.' },
    { lever: 'Measurement', t: 'Track handoff links', d: 'Tag pnc.com application URLs so AI-referred sessions (chatgpt.com, gemini.google.com, copilot.microsoft.com and claude.ai referrers) can be measured to completion.' }
  ]
},

/* ======================= THE STARTER ======================= */
starter_info: {
  prompt: 'I just started my first real job. How should I split my paycheck between checking, savings, and paying off student loans?',
  implied: 'Wants a simple system. Underneath: fear of getting it wrong, a first emergency fund, and whether to prioritize loans or saving. They’re primed for a bank that automates this.',
  explicit: ['first job', 'paycheck split', 'student loans'],
  inferred: ['Needs an emergency fund', 'Will open a 401(k) soon', 'Responds to automation and tools', 'Rent-burdened in a new city'],
  fan: [
    ['how to budget first paycheck', 'explainer'],
    ['50/30/20 budget rule', 'explainer'],
    ['emergency fund vs paying off student loans first', 'explainer'],
    ['how much to save from each paycheck', 'howto'],
    ['split direct deposit between checking and savings', 'howto'],
    ['budgeting tools banks offer', 'commercial'],
    ['reddit first job budget advice', 'community'],
    ['student loan repayment options 2026', 'freshness']
  ],
  src: [
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'Your money, your goals: making a budget', type: 'authority', fmt: 'explainer', rel: .86, b: [] },
    { id: 'sa', dom: 'studentaid.gov', t: 'Repayment plans and how to choose', type: 'authority', fmt: 'explainer', rel: .78, b: [] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'The 50/30/20 Budget Rule Explained', type: 'publisher', fmt: 'explainer', rel: .88, b: [] },
    { id: 'pnci', dom: 'pnc.com', path: '/insights/personal-finance/spend/first-job', t: 'Starting your first job? A money checklist', type: 'owned', fmt: 'explainer', rel: .76, b: ['pnc'] },
    { id: 'pncv', dom: 'pnc.com', path: '/personal-banking/banking/checking/virtual-wallet', t: 'Virtual Wallet: Spend, Reserve and Growth', type: 'owned', fmt: 'product', rel: .58, b: ['pnc'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/personalfinance', t: 'Prime directive: how to handle your money', type: 'ugc', fmt: 'thread', rel: .82, b: ['ally', 'fidelity'] },
    { id: 'yt', dom: 'youtube.com', t: 'How I budget my first salary (video)', type: 'ugc', fmt: 'video', rel: .6, b: ['sofi'] },
    { id: 'inv', dom: 'investopedia.com', t: 'Should You Pay Off Student Loans or Save?', type: 'publisher', fmt: 'explainer', rel: .74, b: [] }
  ],
  items: [
    { b: null, h: 'Start with a simple split', t: 'A common starting point is 50/30/20: about 50% to needs (rent, loans’ minimums), 30% to wants, and 20% to savings and extra debt payments. Adjust if rent is high.', src: ['nw', 'cfpb'] },
    { b: null, h: 'Build a starter emergency fund first', t: 'Aim for $1,000 to $2,000 quickly, then grow toward 3 to 6 months of expenses in a separate savings account.', src: ['rd', 'cfpb', 'pnci'] },
    { b: null, h: 'Then decide on loans vs. saving', t: 'Always pay the minimums. Put extra toward loans with higher interest rates (roughly 6% or more), and capture any 401(k) employer match before prepaying low-rate loans.', src: ['inv', 'sa', 'rd'] },
    { b: null, h: 'Automate it', t: 'Split your direct deposit so savings happens before you see the money.', src: ['cfpb', 'pnci', 'yt'] },
    { b: 'pnc', h: 'Tools that do this for you', t: 'Some banks build this structure in. PNC’s Virtual Wallet, for example, pairs a Spend account with Reserve (short-term) and Growth (savings) accounts and lets you set automatic transfers and savings goals.', src: ['pncv', 'pnci'] },
    { b: 'ally', h: 'Savings “buckets”', t: 'Online banks like Ally let you split one savings account into labeled buckets.', src: ['rd'] },
    { b: 'sofi', h: 'Vaults', t: 'SoFi’s “Vaults” offer a similar approach.', src: ['yt'] }
  ],
  maxBrands: 1,
  aeo: [
    { lever: 'Content', t: 'Be the framework, not the ad', d: 'Info prompts cite whoever explains the framework best. A PNC Insights “first paycheck” guide that teaches 50/30/20 and shows Virtual Wallet as the worked example earns a natural mention.' },
    { lever: 'Content', t: 'Map product to job-to-be-done', d: 'Name Spend/Reserve/Growth in the persona’s words, like “emergency fund” and “paycheck split.” Models match concepts, not product names.' },
    { lever: 'Off-site', t: 'Partner with authority', d: 'CFPB and studentaid.gov dominate. Financial wellness partnerships with employers and universities can surface PNC content alongside them.' }
  ]
},

starter_rec: {
  prompt: 'What’s the best first credit card to build credit after college?',
  implied: 'Thin credit file, so approval odds matter more than rewards. Wants no annual fee and a path to a better card later.',
  explicit: ['first credit card', 'build credit'],
  inferred: ['Thin credit file', 'Approval odds anxiety', 'No annual fee', 'Will upgrade in 12 to 18 months'],
  fan: [
    ['best credit cards for building credit 2026', 'commercial'],
    ['best first credit card after college', 'commercial'],
    ['credit card for no credit history', 'commercial'],
    ['no annual fee cash back card for beginners', 'commercial'],
    ['PNC credit card for beginners', 'entity'],
    ['reddit first credit card', 'community'],
    ['how to build credit with a credit card', 'explainer']
  ],
  src: [
    { id: 'nw', dom: 'nerdwallet.com', t: 'Best Credit Cards to Build Credit', type: 'publisher', fmt: 'listicle', rel: .92, b: ['discover', 'capone', 'chase'] },
    { id: 'tpg', dom: 'thepointsguy.com', t: 'Best starter credit cards', type: 'publisher', fmt: 'listicle', rel: .8, b: ['chase', 'capone', 'citi'] },
    { id: 'cs', dom: 'cnbc.com', path: '/select', t: 'Best credit cards for no credit', type: 'publisher', fmt: 'listicle', rel: .78, b: ['discover', 'capone'] },
    { id: 'pncc', dom: 'pnc.com', path: '/personal-banking/banking/credit-cards', t: 'Compare PNC Credit Cards', type: 'owned', fmt: 'product', rel: .6, b: ['pnc'], issue: 'js' },
    { id: 'pnci', dom: 'pnc.com', path: '/insights/personal-finance/borrow/build-credit', t: 'How to build credit with your first card', type: 'owned', fmt: 'explainer', rel: .64, b: ['pnc'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/CreditCards', t: 'What should be my first card? (2026 megathread)', type: 'ugc', fmt: 'thread', rel: .84, b: ['discover', 'capone', 'chase'] },
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'How do I get and keep a good credit score?', type: 'authority', fmt: 'explainer', rel: .6, b: [] },
    { id: 'capone', dom: 'capitalone.com', t: 'Quicksilver: cash back for good credit', type: 'competitor', fmt: 'product', rel: .58, b: ['capone'] }
  ],
  items: [
    { b: 'discover', h: 'Discover it® Student / Secured', t: 'Often the top pick for a thin file: no annual fee, cash back, and first-year cashback match.', src: ['nw', 'cs', 'rd'] },
    { b: 'capone', h: 'Capital One Quicksilver / QuicksilverOne', t: 'Flat cash back, prequalification without a hard pull, and automatic credit-line reviews.', src: ['capone', 'nw', 'cs', 'rd'] },
    { b: 'chase', h: 'Chase Freedom Rise®', t: 'Built for people new to credit, especially if you already have a Chase checking account.', src: ['tpg', 'nw', 'rd'] },
    { b: 'pnc', h: 'PNC Cash Unlimited® Visa Signature®', t: 'Unlimited 2% cash back with no annual fee. Applying as an existing PNC customer can help, and PNC’s credit-building content is a good companion.', src: ['pncc', 'pnci'] },
    { b: 'citi', h: 'Citi Double Cash®', t: 'Up to 2% back. Better as a second card once you have some history.', src: ['tpg'] }
  ],
  close: 'Pay the full statement balance every month, keep utilization under 30%, and set up autopay. That matters more than which card you choose.',
  maxBrands: 4,
  aeo: [
    { lever: 'Off-site', t: 'PNC is missing from the shortlists', d: 'Every top-cited source here is a publisher roundup or r/CreditCards, and none feature a PNC card. For this prompt, PNC visibility is mostly a PR and affiliate-partnership problem.' },
    { lever: 'Technical', t: 'Make the card catalog readable', d: 'The PNC card comparison page is JavaScript-rendered. Even when retrieved, most models can’t extract rewards or fees.' },
    { lever: 'Content', t: 'Build the “starter card” narrative', d: 'If a PNC card is right for new-to-credit customers, say so explicitly, with eligibility guidance, in plain HTML and FAQ schema.' }
  ]
},

starter_compare: {
  prompt: 'PNC Cash Unlimited vs Citi Double Cash vs Wells Fargo Active Cash: which 2% card is best?',
  implied: 'Has decent credit now and has narrowed to flat 2% cards. Wants to know which wins on the details (redemption, intro APR, bank relationship).',
  explicit: ['PNC Cash Unlimited', 'Citi Double Cash', 'Wells Fargo Active Cash', '2%'],
  inferred: ['Values simplicity', 'May want an intro APR or balance transfer', 'Existing bank relationship could tip it'],
  named: ['pnc', 'citi', 'wf'],
  fan: [
    ['PNC Cash Unlimited vs Citi Double Cash', 'compare'],
    ['Wells Fargo Active Cash vs Citi Double Cash', 'compare'],
    ['PNC Cash Unlimited Visa Signature review', 'entity'],
    ['best flat rate 2% cash back card 2026', 'commercial'],
    ['Wells Fargo Active Cash welcome bonus', 'freshness'],
    ['reddit 2% cash back card comparison', 'community']
  ],
  src: [
    { id: 'pncc', dom: 'pnc.com', path: '/personal-banking/banking/credit-cards/cash-unlimited', t: 'PNC Cash Unlimited® Visa Signature®', type: 'owned', fmt: 'product', rel: .84, b: ['pnc'] },
    { id: 'citi', dom: 'citi.com', t: 'Citi Double Cash® Card', type: 'competitor', fmt: 'product', rel: .82, b: ['citi'] },
    { id: 'wf', dom: 'wellsfargo.com', t: 'Active Cash® Card', type: 'competitor', fmt: 'product', rel: .82, b: ['wf'] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'Citi Double Cash vs. Wells Fargo Active Cash', type: 'publisher', fmt: 'compare', rel: .88, b: ['citi', 'wf'] },
    { id: 'br', dom: 'bankrate.com', t: 'PNC Cash Unlimited review', type: 'publisher', fmt: 'review', rel: .72, b: ['pnc'] },
    { id: 'tpg', dom: 'thepointsguy.com', t: 'Best 2% cash-back cards', type: 'publisher', fmt: 'listicle', rel: .76, b: ['citi', 'wf'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/CreditCards', t: 'Active Cash or Double Cash? Is the PNC one any good?', type: 'ugc', fmt: 'thread', rel: .66, b: ['citi', 'wf', 'pnc'] }
  ],
  cols: ['Rewards', 'Welcome offer / intro APR', 'Edge'],
  items: [
    { b: 'pnc', h: 'PNC Cash Unlimited', cells: ['Unlimited 2% cash back', 'Check pnc.com for current offer', 'Integrates with PNC Virtual Wallet; redeem into your PNC account'], src: ['pncc', 'br', 'rd'] },
    { b: 'citi', h: 'Citi Double Cash', cells: ['Up to 2% (1% buy + 1% pay)', 'Long balance-transfer intro APR', 'Converts to ThankYou points'], src: ['citi', 'nw', 'tpg'] },
    { b: 'wf', h: 'Wells Fargo Active Cash', cells: ['Unlimited 2% cash rewards', 'Cash welcome bonus + intro APR on purchases', 'Cell phone protection'], src: ['wf', 'nw', 'tpg'] }
  ],
  verdict: { pnc: 'If you already bank with PNC, Cash Unlimited is the simplest 2% card to manage alongside Virtual Wallet.', citi: 'For a balance transfer or points flexibility, Citi Double Cash wins.', wf: 'For a welcome bonus and purchase intro APR, Wells Fargo Active Cash is the strongest on paper.' },
  maxBrands: 3,
  aeo: [
    { lever: 'Off-site', t: 'PNC is absent from third-party comparisons', d: 'Publishers compare Citi and Wells Fargo directly, while PNC appears only via its own page and a single review. Pitch PNC Cash Unlimited for inclusion in “best 2% card” roundups.' },
    { lever: 'Content', t: 'Claim the relationship advantage', d: 'The model’s only PNC-specific edge is Virtual Wallet integration. Make that benefit explicit and quantifiable on the product page.' },
    { lever: 'Technical', t: 'Keep offers structured and dated', d: 'Welcome offers change often. Use Offer schema with validThrough so models don’t quote expired terms.' }
  ]
},

starter_txn: {
  prompt: 'I want to apply for a no-annual-fee 2% cash back credit card today. Where should I apply?',
  implied: 'Ready to apply. Wants an approval-friendly card and a direct link. Pre-qualification would reduce anxiety.',
  explicit: ['apply today', 'no annual fee', '2% cash back'],
  inferred: ['Wants prequalification without a hard pull', 'May prefer their existing bank', 'Mobile application'],
  fan: [
    ['apply 2% cash back credit card no annual fee', 'commercial'],
    ['credit card prequalify no hard pull', 'howto'],
    ['PNC Cash Unlimited apply', 'entity'],
    ['Wells Fargo Active Cash apply', 'entity'],
    ['best 2% card welcome bonus November 2026', 'freshness'],
    ['PNC branch Pittsburgh', 'local']
  ],
  src: [
    { id: 'pncc', dom: 'pnc.com', path: '/personal-banking/banking/credit-cards/cash-unlimited', t: 'PNC Cash Unlimited®: apply now', type: 'owned', fmt: 'product', rel: .84, b: ['pnc'] },
    { id: 'pncp', dom: 'pnc.com', path: '/credit-cards/prequalify', t: 'See if you prequalify', type: 'owned', fmt: 'tool', rel: .72, b: ['pnc'], issue: 'js' },
    { id: 'wf', dom: 'wellsfargo.com', t: 'Active Cash®: apply', type: 'competitor', fmt: 'product', rel: .86, b: ['wf'] },
    { id: 'citi', dom: 'citi.com', t: 'Double Cash®: apply', type: 'competitor', fmt: 'product', rel: .76, b: ['citi'] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'Best 2% Cash Back Credit Cards', type: 'publisher', fmt: 'listicle', rel: .78, b: ['wf', 'citi'] },
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'What is a hard vs. soft credit inquiry?', type: 'authority', fmt: 'explainer', rel: .55, b: [] },
    { id: 'gmb', dom: 'google.com', path: '/maps', t: 'PNC Bank: Pittsburgh branches', type: 'owned', fmt: 'local', rel: .5, b: ['pnc'] }
  ],
  steps: ['Check whether the issuer offers prequalification (a soft pull won’t hurt your score).', 'Have your income, housing payment, and SSN ready.', 'Apply online or in the app. Decisions are often instant.', 'Set up autopay for the full statement balance.'],
  items: [
    { b: 'wf', h: 'Wells Fargo Active Cash', t: 'Unlimited 2% cash rewards, no annual fee, and a cash welcome bonus.', cta: 'Apply at wellsfargo.com', src: ['wf', 'nw'] },
    { b: 'pnc', h: 'PNC Cash Unlimited Visa Signature', t: 'Unlimited 2% cash back and no annual fee. A good fit if you already bank with PNC.', cta: 'Apply at pnc.com', src: ['pncc', 'pncp', 'gmb'] },
    { b: 'citi', h: 'Citi Double Cash', t: 'Up to 2% back (1% when you buy, 1% when you pay).', cta: 'Apply at citi.com', src: ['citi', 'nw'] }
  ],
  maxBrands: 2,
  aeo: [
    { lever: 'Technical', t: 'Expose prequalification', d: '“No hard pull” is the anxiety point for starters. PNC’s prequalify tool is JavaScript-only, so models can’t confirm it exists. Add a static description and FAQ.' },
    { lever: 'Content', t: 'Short, quotable product facts', d: 'Transactional answers cite one or two lines per card. Make “Unlimited 2% cash back, no annual fee” the first sentence on the page.' },
    { lever: 'Measurement', t: 'Attribute AI-referred applications', d: 'Track application starts from AI referrers separately. Conversion rates from AI answers are typically higher than generic search.' }
  ]
},

/* ======================= FIRST-TIME HOME BUYER ======================= */
fthb_info: {
  prompt: 'How much do I really need for a down payment on my first home, and are there grants that can help?',
  implied: 'Feels blocked by the down payment. Wants permission to buy with less than 20% down and concrete grant programs, ideally local.',
  explicit: ['down payment', 'first home', 'grants'],
  inferred: ['Believes 20% is required', 'Moderate income, may qualify for programs', 'Will look for local or state assistance', 'Starting a 6 to 12 month journey'],
  fan: [
    ['minimum down payment first time home buyer', 'explainer'],
    ['do you need 20 percent down', 'explainer'],
    ['first time home buyer grants Ohio 2026', 'local'],
    ['down payment assistance programs Columbus', 'local'],
    ['bank homebuyer grant programs', 'commercial'],
    ['PNC Homebuyer Grant eligibility', 'entity'],
    ['FHA vs conventional down payment', 'compare'],
    ['HUD first time homebuyer help', 'trust']
  ],
  src: [
    { id: 'hud', dom: 'hud.gov', t: 'Buying a Home: local homebuying programs', type: 'authority', fmt: 'explainer', rel: .86, b: [] },
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'How much do you need for a down payment?', type: 'authority', fmt: 'explainer', rel: .88, b: [] },
    { id: 'ohfa', dom: 'myohiohome.org', t: 'Ohio Housing Finance Agency: down payment assistance', type: 'authority', fmt: 'explainer', rel: .7, b: [] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'First-Time Home Buyer Grants and Programs', type: 'publisher', fmt: 'listicle', rel: .84, b: ['boa', 'chase', 'pnc', 'wf'] },
    { id: 'pncg', dom: 'pnc.com', path: '/personal-banking/home-lending/homebuyer-grant', t: 'PNC Homebuyer Grant', type: 'owned', fmt: 'product', rel: .74, b: ['pnc'] },
    { id: 'pnci', dom: 'pnc.com', path: '/insights/personal-finance/borrow/down-payment', t: 'How much should you put down on a house?', type: 'owned', fmt: 'explainer', rel: .7, b: ['pnc'] },
    { id: 'boa', dom: 'bankofamerica.com', t: 'Down Payment Grant program', type: 'competitor', fmt: 'product', rel: .64, b: ['boa'] },
    { id: 'yt', dom: 'youtube.com', t: 'First-time buyer: you don’t need 20% down (video)', type: 'ugc', fmt: 'video', rel: .6, b: [] },
    { id: 'rd', dom: 'reddit.com', path: '/r/FirstTimeHomeBuyer', t: 'Got $10k in grants: here’s how', type: 'ugc', fmt: 'thread', rel: .68, b: ['chase', 'boa'] }
  ],
  items: [
    { b: null, h: 'You probably don’t need 20%', t: '20% down avoids mortgage insurance, but it isn’t required. Conventional loans can go as low as 3% down for eligible first-time buyers, FHA loans 3.5%, and VA and USDA loans 0% if you qualify.', src: ['cfpb', 'pnci', 'yt'] },
    { b: null, h: 'Budget for more than the down payment', t: 'Plan for closing costs (often 2% to 5% of the price), moving costs, and a cash cushion after closing.', src: ['cfpb', 'pnci'] },
    { b: null, h: 'State and local assistance', t: 'Ohio Housing Finance Agency and many city programs offer grants or forgivable loans for down payments and closing costs, usually with income limits and a homebuyer education course.', src: ['ohfa', 'hud'] },
    { b: 'pnc', h: 'Lender grants: PNC Homebuyer Grant', t: 'Some lenders offer their own grants. The PNC Homebuyer Grant provides up to $5,000 toward closing costs or down payment for eligible properties and buyers, and it can often be combined with other assistance.', src: ['pncg', 'nw', 'pnci'] },
    { b: 'boa', h: 'Lender grants: Bank of America', t: 'Bank of America’s Down Payment Grant program is available in select markets.', src: ['boa', 'nw', 'rd'] },
    { b: 'chase', h: 'Lender grants: Chase', t: 'Chase offers a Homebuyer Grant in eligible communities.', src: ['nw', 'rd'] }
  ],
  maxBrands: 2,
  aeo: [
    { lever: 'Content', t: 'Make the grant page answer-first', d: 'Lead with “up to $5,000,” who qualifies, and how to check eligibility by address. That’s the exact fact models extract for grant prompts.' },
    { lever: 'Content', t: 'Localize the explainer', d: 'Gemini and Copilot add local queries (Columbus, Ohio). Market-level pages that pair PNC grants with state HFA programs win those fan-outs.' },
    { lever: 'Off-site', t: 'Be on the grant roundups', d: 'NerdWallet’s grant list is the most-cited third-party source. Keep PNC’s entry current with eligibility details.' }
  ]
},

fthb_rec: {
  prompt: 'What are the best mortgage lenders for first-time home buyers with a low down payment?',
  implied: 'Shopping lenders and wants someone patient who offers low-down-payment programs and help with closing costs. Trust and guidance matter as much as rate.',
  explicit: ['mortgage lenders', 'first-time buyer', 'low down payment'],
  inferred: ['Needs hand-holding', 'Grant or assistance eligible', 'Will get 2 to 3 quotes', 'Local loan officer access valued'],
  fan: [
    ['best mortgage lenders for first time home buyers 2026', 'commercial'],
    ['low down payment mortgage lenders', 'commercial'],
    ['lenders with homebuyer grants', 'commercial'],
    ['J.D. Power mortgage origination satisfaction', 'trust'],
    ['PNC mortgage review', 'entity'],
    ['reddit best lender first home', 'community'],
    ['mortgage lenders Columbus Ohio', 'local'],
    ['mortgage rates today', 'freshness']
  ],
  src: [
    { id: 'nw', dom: 'nerdwallet.com', t: 'Best Mortgage Lenders for First-Time Home Buyers', type: 'publisher', fmt: 'listicle', rel: .9, b: ['rocket', 'chase', 'boa', 'pnc'] },
    { id: 'br', dom: 'bankrate.com', t: 'Best first-time homebuyer lenders', type: 'publisher', fmt: 'listicle', rel: .84, b: ['rocket', 'boa', 'wf'] },
    { id: 'jdp', dom: 'jdpower.com', t: 'U.S. Mortgage Origination Satisfaction Study', type: 'authority', fmt: 'review', rel: .72, b: ['rocket', 'chase', 'pnc'] },
    { id: 'pncm', dom: 'pnc.com', path: '/personal-banking/home-lending/first-time-homebuyers', t: 'First-time homebuyers | PNC', type: 'owned', fmt: 'product', rel: .72, b: ['pnc'] },
    { id: 'pncr', dom: 'bankrate.com', path: '/mortgages/reviews/pnc', t: 'PNC mortgage review', type: 'publisher', fmt: 'review', rel: .66, b: ['pnc'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/FirstTimeHomeBuyer', t: 'Lender recommendations? Big bank vs. broker', type: 'ugc', fmt: 'thread', rel: .74, b: ['rocket', 'chase'] },
    { id: 'rocket', dom: 'rocketmortgage.com', t: 'First-time home buyer loans', type: 'competitor', fmt: 'product', rel: .62, b: ['rocket'] },
    { id: 'gmb', dom: 'google.com', path: '/maps', t: 'Mortgage loan officers near Columbus, OH', type: 'owned', fmt: 'local', rel: .5, b: ['pnc', 'chase'] }
  ],
  items: [
    { b: 'rocket', h: 'Rocket Mortgage', t: 'Fast online process and a wide range of low-down-payment options. Consistently near the top in satisfaction studies.', src: ['rocket', 'nw', 'br', 'jdp', 'rd'] },
    { b: 'boa', h: 'Bank of America', t: 'Affordable Loan Solution® with as little as 3% down, plus down payment grants in select markets.', src: ['nw', 'br'] },
    { b: 'chase', h: 'Chase', t: 'DreaMaker℠ low-down-payment mortgage and a homebuyer grant in eligible areas.', src: ['nw', 'jdp', 'rd'] },
    { b: 'pnc', h: 'PNC', t: 'PNC Community Loan (low down payment, no PMI), the PNC Homebuyer Grant (up to $5,000 for eligible buyers), and Home Insight® tools to track your application. Local loan officers can guide you through it.', src: ['pncm', 'pncr', 'nw', 'jdp', 'gmb'] },
    { b: 'wf', h: 'Wells Fargo', t: 'Dream. Plan. Home.® closing-cost credit and low-down-payment options.', src: ['br'] }
  ],
  close: 'Get Loan Estimates from at least three lenders on the same day and compare rate, APR, and lender fees side by side.',
  maxBrands: 4,
  aeo: [
    { lever: 'Off-site', t: 'Satisfaction studies matter', d: 'J.D. Power and publisher “best lender” lists set the shortlist. Promote PNC’s mortgage awards and ratings so they appear in those sources.' },
    { lever: 'Content', t: 'Bundle the first-time-buyer story', d: 'The models assemble PNC’s value from three pages (Community Loan, Grant, Home Insight). A single answer-first hub page lets them cite one coherent source.' },
    { lever: 'Technical', t: 'Loan officer pages', d: 'Local loan officer profiles with LocalBusiness/Person schema help win “near me” fan-outs for Gemini and Copilot.' }
  ]
},

fthb_compare: {
  prompt: 'FHA vs conventional vs a bank’s community loan program: which is best for a first-time buyer with 5% down?',
  implied: 'Educated buyer weighing mortgage insurance and total cost. Wants the math and a recommendation for their situation.',
  explicit: ['FHA', 'conventional', 'community loan program', '5% down'],
  inferred: ['Credit score probably 680+', 'Sensitive to PMI cost', 'Income near area median'],
  fan: [
    ['FHA vs conventional 5% down', 'compare'],
    ['FHA mortgage insurance premium 2026', 'freshness'],
    ['conventional loan PMI 5 percent down', 'explainer'],
    ['bank community loan no PMI', 'commercial'],
    ['PNC Community Loan requirements', 'entity'],
    ['HomeReady vs FHA', 'compare'],
    ['reddit FHA or conventional first time buyer', 'community']
  ],
  src: [
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'Explore loan types', type: 'authority', fmt: 'compare', rel: .86, b: [] },
    { id: 'hud', dom: 'hud.gov', t: 'FHA loans and mortgage insurance', type: 'authority', fmt: 'explainer', rel: .8, b: [] },
    { id: 'fnm', dom: 'fanniemae.com', t: 'HomeReady® mortgage', type: 'authority', fmt: 'product', rel: .72, b: [] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'FHA vs. Conventional Loans', type: 'publisher', fmt: 'compare', rel: .88, b: [] },
    { id: 'pncc', dom: 'pnc.com', path: '/personal-banking/home-lending/mortgages/community-loan', t: 'PNC Community Loan', type: 'owned', fmt: 'product', rel: .72, b: ['pnc'] },
    { id: 'boa', dom: 'bankofamerica.com', t: 'Affordable Loan Solution® mortgage', type: 'competitor', fmt: 'product', rel: .66, b: ['boa'] },
    { id: 'chase', dom: 'chase.com', t: 'DreaMaker℠ mortgage', type: 'competitor', fmt: 'product', rel: .62, b: ['chase'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/FirstTimeHomeBuyer', t: 'FHA vs conventional with 5% down: math inside', type: 'ugc', fmt: 'thread', rel: .7, b: [] }
  ],
  cols: ['Down payment', 'Mortgage insurance', 'Best for'],
  items: [
    { b: null, h: 'FHA', cells: ['3.5% minimum', 'Upfront + annual MIP, often for the life of the loan', 'Lower credit scores'], src: ['hud', 'nw', 'cfpb'] },
    { b: null, h: 'Conventional (incl. HomeReady)', cells: ['3% to 5% minimum', 'PMI that can be removed at 20% equity', 'Good credit; long-term cost'], src: ['fnm', 'nw', 'cfpb', 'rd'] },
    { b: 'pnc', h: 'PNC Community Loan', cells: ['As little as 3% down', 'No PMI required', 'Eligible buyers who want lower monthly cost'], src: ['pncc'] },
    { b: 'boa', h: 'BofA Affordable Loan Solution', cells: ['As little as 3% down', 'No PMI', 'Eligible buyers in BofA markets'], src: ['boa'] },
    { b: 'chase', h: 'Chase DreaMaker', cells: ['As little as 3% down', 'Reduced PMI', 'Income-eligible buyers'], src: ['chase'] }
  ],
  verdict: { pnc: 'With 5% down and decent credit, a no-PMI bank community program like PNC Community Loan can beat both FHA and conventional on monthly cost, if you meet the income and property rules.', boa: 'Bank community programs like BofA’s Affordable Loan Solution can beat FHA on monthly cost if you qualify.', chase: 'Bank programs like Chase DreaMaker can lower your PMI versus standard conventional.', _: 'With 5% down and a credit score above about 680, conventional usually costs less over time than FHA because PMI can be removed.' },
  maxBrands: 1,
  aeo: [
    { lever: 'Content', t: 'Publish the math', d: 'Comparison prompts reward worked examples. A PNC page showing monthly cost for FHA vs. conventional vs. Community Loan at 5% down gives models the table they’re trying to build.' },
    { lever: 'Content', t: 'Use category language', d: 'Users say “community loan program” and “no PMI,” not product names. Make sure the Community Loan page uses those exact phrases.' },
    { lever: 'Off-site', t: 'Get into the explainer canon', d: 'NerdWallet and CFPB own the generic comparison. Contributing expert quotes from PNC mortgage leaders can earn citations inside those sources.' }
  ]
},

fthb_txn: {
  prompt: 'I want to get pre-approved for a mortgage online this week. Which lender should I start with and what do I need?',
  implied: 'Ready to start. Wants speed and a clear checklist, but also a human for questions. A local lender with online pre-approval is the sweet spot.',
  explicit: ['pre-approved', 'online', 'this week'],
  inferred: ['Has found homes they like', 'Needs a pre-approval letter for offers', 'Wants a local loan officer'],
  fan: [
    ['get pre approved for mortgage online', 'howto'],
    ['documents needed for mortgage pre approval', 'howto'],
    ['fastest mortgage pre approval', 'commercial'],
    ['PNC mortgage pre approval', 'entity'],
    ['mortgage lender near Columbus OH', 'local'],
    ['pre approval vs prequalification', 'explainer']
  ],
  src: [
    { id: 'pnch', dom: 'pnc.com', path: '/personal-banking/home-lending/home-insight-planner', t: 'Home Insight® Planner: get pre-approved', type: 'owned', fmt: 'tool', rel: .86, b: ['pnc'], issue: 'js' },
    { id: 'pncm', dom: 'pnc.com', path: '/personal-banking/home-lending/first-time-homebuyers', t: 'First-time homebuyers | PNC', type: 'owned', fmt: 'product', rel: .74, b: ['pnc'] },
    { id: 'rocket', dom: 'rocketmortgage.com', t: 'Get approved online', type: 'competitor', fmt: 'product', rel: .86, b: ['rocket'] },
    { id: 'chase', dom: 'chase.com', t: 'Mortgage pre-approval', type: 'competitor', fmt: 'product', rel: .72, b: ['chase'] },
    { id: 'cfpb', dom: 'consumerfinance.gov', t: 'Get a prequalification or preapproval letter', type: 'authority', fmt: 'howto', rel: .78, b: [] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'Mortgage Preapproval: What You Need', type: 'publisher', fmt: 'howto', rel: .76, b: ['rocket'] },
    { id: 'gmb', dom: 'google.com', path: '/maps', t: 'PNC Mortgage loan officers: Columbus, OH', type: 'owned', fmt: 'local', rel: .62, b: ['pnc'] }
  ],
  steps: ['Gather two years of W-2s, 30 days of pay stubs, two months of bank statements, and IDs for both of you.', 'Apply online. A soft or hard credit check follows depending on the lender.', 'Upload documents and get a pre-approval letter (often 1 to 3 days).', 'Ask about grants and assistance before you make an offer.'],
  items: [
    { b: 'rocket', h: 'Rocket Mortgage', t: 'Fully online and fast, with decisions often within a day.', cta: 'Start at rocketmortgage.com', src: ['rocket', 'nw'] },
    { b: 'pnc', h: 'PNC Mortgage', t: 'Start with the Home Insight Planner online, then track progress with Home Insight Tracker. A local Columbus loan officer can check eligibility for the PNC Homebuyer Grant.', cta: 'Get pre-approved at pnc.com', src: ['pnch', 'pncm', 'gmb'] },
    { b: 'chase', h: 'Chase', t: 'Online pre-approval with in-branch home lending advisors.', cta: 'Start at chase.com', src: ['chase'] }
  ],
  maxBrands: 2,
  aeo: [
    { lever: 'Technical', t: 'The Planner is invisible to most models', d: 'Home Insight Planner is a JavaScript app with no crawlable description. Only Gemini (rendered Google index) reliably sees it. Add a static landing page that explains the steps.' },
    { lever: 'Technical', t: 'Win local', d: 'Complete, review-rich Google Business Profiles and Bing Places listings for PNC mortgage loan officers carry “this week, near me” prompts.' },
    { lever: 'Content', t: 'Own the document checklist', d: 'Every model answers “what do I need?” Publish a printable PNC pre-approval checklist page with HowTo schema.' }
  ]
},

/* ======================= EMERGING MASS AFFLUENT ======================= */
ema_info: {
  prompt: 'I have about $180k saved and my income keeps growing. When does it make sense to work with a financial advisor instead of doing it myself?',
  implied: 'Feeling the complexity (RSUs, taxes, a house, kids’ college) and wondering if they’ve outgrown DIY. Wants to understand fee models and trust before engaging.',
  explicit: ['$180k saved', 'growing income', 'financial advisor'],
  inferred: ['Has equity comp', 'Tax optimization need', 'Distrust of commissions', 'Wants a bank relationship that scales'],
  fan: [
    ['when do you need a financial advisor', 'explainer'],
    ['fee only vs commission financial advisor', 'explainer'],
    ['financial advisor minimum investment', 'explainer'],
    ['how much does a financial advisor cost', 'explainer'],
    ['robo advisor vs human advisor', 'compare'],
    ['bank wealth management for mass affluent', 'commercial'],
    ['PNC Investments advisor', 'entity'],
    ['check advisor FINRA BrokerCheck', 'trust']
  ],
  src: [
    { id: 'finra', dom: 'finra.org', t: 'Choosing an investment professional', type: 'authority', fmt: 'explainer', rel: .82, b: [] },
    { id: 'sec', dom: 'investor.gov', t: 'Working with an investment professional', type: 'authority', fmt: 'explainer', rel: .84, b: [] },
    { id: 'inv', dom: 'investopedia.com', t: 'When Should You Hire a Financial Advisor?', type: 'publisher', fmt: 'explainer', rel: .88, b: [] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'How Much Does a Financial Advisor Cost?', type: 'publisher', fmt: 'explainer', rel: .78, b: ['fidelity', 'schwab'] },
    { id: 'pnci', dom: 'pnc.com', path: '/insights/personal-finance/invest/financial-advisor', t: 'Do you need a financial advisor?', type: 'owned', fmt: 'explainer', rel: .72, b: ['pnc'] },
    { id: 'pncw', dom: 'pnc.com', path: '/personal-banking/investments', t: 'PNC Investments: advice and planning', type: 'owned', fmt: 'product', rel: .6, b: ['pnc'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/financialindependence', t: 'At what net worth did you hire an advisor?', type: 'ugc', fmt: 'thread', rel: .72, b: ['fidelity', 'schwab'] },
    { id: 'schwab', dom: 'schwab.com', t: 'Schwab Wealth Advisory', type: 'competitor', fmt: 'product', rel: .58, b: ['schwab'] }
  ],
  items: [
    { b: null, h: 'Signs you’ve outgrown DIY', t: 'Equity compensation (RSUs or options), a large tax bill, multiple goals competing for cash (house, college, early retirement), or a major life event are common triggers. Around $100k to $250k in investable assets is where many people start considering advice.', src: ['inv', 'rd', 'pnci'] },
    { b: null, h: 'Understand how advisors are paid', t: 'Fee-only advisors charge a flat fee, hourly rate, or percent of assets (often around 1%). Commission-based advisors are paid on products sold. Ask whether they act as a fiduciary.', src: ['sec', 'nw', 'finra'] },
    { b: null, h: 'Options between robo and private bank', t: 'Robo-advisors are cheapest, hybrid services add a human planner, and bank or brokerage advisors can tie advice to your banking relationship.', src: ['nw', 'inv'] },
    { b: null, h: 'Check before you hire', t: 'Look up any advisor on FINRA BrokerCheck or the SEC’s Investment Adviser search.', src: ['finra', 'sec'] },
    { b: 'pnc', h: 'Example: bank-based advice', t: 'Banks like PNC offer advice through PNC Investments alongside your checking and savings, which can make it easier to coordinate cash, investing, and lending as your needs grow.', src: ['pncw', 'pnci'] },
    { b: 'fidelity', h: 'Example: brokerage advice', t: 'Fidelity offers hybrid advisory services with planning.', src: ['nw', 'rd'] },
    { b: 'schwab', h: 'Example: Schwab', t: 'Schwab pairs robo portfolios with access to certified planners.', src: ['schwab', 'nw', 'rd'] }
  ],
  maxBrands: 2,
  aeo: [
    { lever: 'Content', t: 'Own the “when” question', d: 'Info prompts for this persona are about thresholds and triggers. A PNC Insights piece with clear asset thresholds and life-event triggers is highly extractable.' },
    { lever: 'Content', t: 'Explain fees transparently', d: 'Models favor sources that explain fee models neutrally. Transparent PNC Investments fee explanations build trust signals and citations.' },
    { lever: 'Off-site', t: 'Advisor thought leadership', d: 'Quotes from PNC advisors in Investopedia and Kiplinger pieces put PNC inside the sources models already trust.' }
  ]
},

ema_rec: {
  prompt: 'What’s the best bank for someone with a high income who wants premium perks and wealth management in one place?',
  implied: 'Wants relationship benefits (rate discounts, fee waivers, a dedicated banker) and a path to advice, without private-bank minimums. Status and convenience both matter.',
  explicit: ['high income', 'premium perks', 'wealth management'],
  inferred: ['$100k to $500k relationship', 'Mortgage or HELOC likely', 'Travel perks appeal', 'Wants one relationship manager'],
  fan: [
    ['best premium checking accounts for high earners', 'commercial'],
    ['bank relationship rewards programs comparison', 'compare'],
    ['Chase Sapphire Banking vs BofA Preferred Rewards', 'compare'],
    ['PNC Performance Select review', 'entity'],
    ['bank with wealth management and checking', 'commercial'],
    ['reddit best bank for HENRY', 'community'],
    ['private banking minimums 2026', 'freshness'],
    ['bank with financial advisors Philadelphia', 'local']
  ],
  src: [
    { id: 'nw', dom: 'nerdwallet.com', t: 'Best Premium Checking Accounts', type: 'publisher', fmt: 'listicle', rel: .86, b: ['chase', 'boa', 'citi', 'wf'] },
    { id: 'fa', dom: 'forbes.com', path: '/advisor', t: 'Best Banks for Wealthy Customers', type: 'publisher', fmt: 'listicle', rel: .8, b: ['chase', 'boa', 'schwab', 'citi'] },
    { id: 'br', dom: 'bankrate.com', t: 'PNC Virtual Wallet with Performance Select review', type: 'publisher', fmt: 'review', rel: .68, b: ['pnc'] },
    { id: 'pncp', dom: 'pnc.com', path: '/personal-banking/banking/checking/virtual-wallet/performance-select', t: 'Virtual Wallet® with Performance Select', type: 'owned', fmt: 'product', rel: .72, b: ['pnc'] },
    { id: 'pncw', dom: 'pnc.com', path: '/personal-banking/investments', t: 'PNC Investments', type: 'owned', fmt: 'product', rel: .58, b: ['pnc'] },
    { id: 'boa', dom: 'bankofamerica.com', t: 'Preferred Rewards', type: 'competitor', fmt: 'product', rel: .7, b: ['boa'] },
    { id: 'chase', dom: 'chase.com', t: 'Chase Sapphire℠ Banking', type: 'competitor', fmt: 'product', rel: .7, b: ['chase'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/HENRYfinance', t: 'Is any bank’s “premium” tier worth it?', type: 'ugc', fmt: 'thread', rel: .72, b: ['boa', 'schwab', 'fidelity'] }
  ],
  items: [
    { b: 'boa', h: 'Bank of America Preferred Rewards', t: 'Tiered benefits across banking, Merrill investing, and credit-card rewards boosts. Very popular with high earners who consolidate.', src: ['boa', 'nw', 'fa', 'rd'] },
    { b: 'chase', h: 'Chase Sapphire Banking', t: 'Premium checking with ATM fee refunds and access to J.P. Morgan advisors.', src: ['chase', 'nw', 'fa'] },
    { b: 'pnc', h: 'PNC Virtual Wallet with Performance Select', t: 'PNC’s premium tier: higher savings rates, ATM fee reimbursements, and relationship benefits. It pairs with PNC Investments for advice, with a path to PNC Private Bank as assets grow.', src: ['pncp', 'br', 'pncw'] },
    { b: 'schwab', h: 'Charles Schwab', t: 'Investor Checking with unlimited ATM refunds, paired with advisory services. Strong if investing is the priority.', src: ['fa', 'rd'] },
    { b: 'citi', h: 'Citi Priority', t: 'Relationship tier with travel-friendly perks and wealth advisors.', src: ['nw', 'fa'] }
  ],
  close: 'The best choice usually follows where you’ll hold the most assets. Relationship tiers reward consolidation.',
  maxBrands: 4,
  aeo: [
    { lever: 'Off-site', t: 'PNC is under-represented in premium roundups', d: 'Publisher “premium checking” lists center on Chase, BofA, and Citi. Pitching Performance Select with a clear benefits table is the fastest lever.' },
    { lever: 'Content', t: 'Tell the relationship story in one place', d: 'The answer needs banking + advice + private bank path. Today that story spans several pnc.com pages; a single “PNC for growing wealth” hub page is easier to cite.' },
    { lever: 'Off-site', t: 'Show up in HENRY communities', d: 'r/HENRYfinance and r/financialindependence shape ChatGPT’s view of “worth it.” Authentic advisor AMAs and customer stories help.' }
  ]
},

ema_compare: {
  prompt: 'Compare PNC Performance Select vs Chase Sapphire Banking vs Bank of America Preferred Rewards for someone with $150k to consolidate.',
  implied: 'Ready to consolidate a meaningful relationship. Wants to know which tier unlocks the most value at $150k and what the trade-offs are.',
  explicit: ['PNC Performance Select', 'Chase Sapphire Banking', 'BofA Preferred Rewards', '$150k'],
  inferred: ['Will move investments too', 'Values rate boosts on mortgage or cards', 'Wants a named banker'],
  named: ['pnc', 'chase', 'boa'],
  fan: [
    ['PNC Performance Select requirements benefits', 'entity'],
    ['Chase Sapphire Banking minimum balance', 'entity'],
    ['BofA Preferred Rewards tiers balance', 'entity'],
    ['premium checking comparison 2026', 'compare'],
    ['which bank relationship program is best', 'compare'],
    ['reddit Preferred Rewards vs Sapphire Banking', 'community']
  ],
  src: [
    { id: 'pncp', dom: 'pnc.com', path: '/personal-banking/banking/checking/virtual-wallet/performance-select', t: 'Virtual Wallet® with Performance Select: benefits', type: 'owned', fmt: 'product', rel: .84, b: ['pnc'], issue: 'js' },
    { id: 'chase', dom: 'chase.com', t: 'Chase Sapphire℠ Banking', type: 'competitor', fmt: 'product', rel: .84, b: ['chase'] },
    { id: 'boa', dom: 'bankofamerica.com', t: 'Preferred Rewards: tiers and benefits', type: 'competitor', fmt: 'product', rel: .86, b: ['boa'] },
    { id: 'nw', dom: 'nerdwallet.com', t: 'BofA Preferred Rewards vs. Chase Sapphire Banking', type: 'publisher', fmt: 'compare', rel: .86, b: ['boa', 'chase'] },
    { id: 'br', dom: 'bankrate.com', t: 'PNC Performance Select review', type: 'publisher', fmt: 'review', rel: .7, b: ['pnc'] },
    { id: 'rd', dom: 'reddit.com', path: '/r/churning', t: 'Preferred Rewards Platinum Honors is unbeatable if…', type: 'ugc', fmt: 'thread', rel: .66, b: ['boa', 'chase'] }
  ],
  cols: ['To unlock', 'Key benefits', 'Watch out for'],
  items: [
    { b: 'pnc', h: 'PNC Performance Select', cells: ['Qualifying balances or direct deposit', 'Higher savings rate, ATM fee reimbursements, card and loan perks', 'Benefits vary by market; strongest inside PNC footprint'], src: ['pncp', 'br'] },
    { b: 'chase', h: 'Chase Sapphire Banking', cells: ['$75k in qualifying balances', 'ATM fee refunds, no foreign fees, J.P. Morgan advisor access', 'Perks overlap with Sapphire cards'], src: ['chase', 'nw', 'rd'] },
    { b: 'boa', h: 'BofA Preferred Rewards', cells: ['$20k / $50k / $100k tiers', 'Card rewards boost up to 75%, mortgage discounts, Merrill perks', 'Best value requires investing with Merrill'], src: ['boa', 'nw', 'rd'] }
  ],
  verdict: { boa: 'At $150k, BofA Preferred Rewards reaches its top tier, the strongest value if you also invest with Merrill and use BofA cards.', pnc: 'If you live in PNC’s footprint and value a local banker and integrated budgeting, Performance Select is competitive.', chase: 'Chase Sapphire Banking fits frequent travelers already in the Sapphire card ecosystem.' },
  maxBrands: 3,
  aeo: [
    { lever: 'Technical', t: 'Benefits table is JavaScript-only', d: 'Performance Select’s benefit matrix loads client-side. ChatGPT, Claude, and Copilot can’t read it and fall back to a dated Bankrate review, so PNC’s cells in the table are vague.' },
    { lever: 'Content', t: 'State the thresholds plainly', d: 'Competitors publish exact unlock thresholds and benefits. Models compare numbers; vague “qualifying balances” language loses the verdict line.' },
    { lever: 'Measurement', t: 'Score answer accuracy', d: 'For named comparisons, track factual accuracy of PNC’s row across models monthly. Wrong facts in AI answers are a compliance risk, not just a marketing one.' }
  ]
},

ema_txn: {
  prompt: 'I want to schedule a meeting with a financial advisor at a bank near me in Philadelphia this month. Who should I contact?',
  implied: 'Ready to engage. Wants a credible, nearby advisor, an easy way to book, and reassurance on credentials.',
  explicit: ['schedule meeting', 'financial advisor', 'bank', 'Philadelphia', 'this month'],
  inferred: ['Prefers in-person', 'Wants online booking', 'Will check credentials'],
  fan: [
    ['bank financial advisor Philadelphia', 'local'],
    ['schedule appointment PNC Investments advisor', 'entity'],
    ['Merrill advisor Philadelphia', 'entity'],
    ['J.P. Morgan advisor Philadelphia', 'entity'],
    ['how to choose a financial advisor checklist', 'howto'],
    ['FINRA BrokerCheck', 'trust']
  ],
  src: [
    { id: 'gmb', dom: 'google.com', path: '/maps', t: 'PNC Investments: Center City Philadelphia', type: 'owned', fmt: 'local', rel: .8, b: ['pnc'] },
    { id: 'pncw', dom: 'pnc.com', path: '/personal-banking/investments/schedule', t: 'Schedule an appointment with PNC Investments', type: 'owned', fmt: 'tool', rel: .8, b: ['pnc'] },
    { id: 'boa', dom: 'ml.com', t: 'Find a Merrill advisor: Philadelphia', type: 'competitor', fmt: 'local', rel: .76, b: ['boa'] },
    { id: 'chase', dom: 'chase.com', t: 'J.P. Morgan Wealth Management: Philadelphia', type: 'competitor', fmt: 'local', rel: .72, b: ['chase'] },
    { id: 'finra', dom: 'finra.org', t: 'BrokerCheck', type: 'authority', fmt: 'tool', rel: .7, b: [] },
    { id: 'yelp', dom: 'yelp.com', t: 'Top financial advisors in Philadelphia', type: 'ugc', fmt: 'local', rel: .56, b: ['fidelity', 'chase'] },
    { id: 'fidelity', dom: 'fidelity.com', t: 'Fidelity Investor Center: Philadelphia', type: 'competitor', fmt: 'local', rel: .62, b: ['fidelity'] }
  ],
  steps: ['Shortlist two or three advisors and look each up on FINRA BrokerCheck.', 'Book online or call. Most banks offer same-week intro meetings.', 'Bring recent statements, your equity comp details, and your top 3 goals.', 'Ask how they’re paid and whether they act as a fiduciary.'],
  items: [
    { b: 'pnc', h: 'PNC Investments: Center City', t: 'Advisors at PNC branches across Philadelphia. You can book online and connect advice with your PNC banking and lending.', cta: 'Schedule at pnc.com', src: ['pncw', 'gmb'] },
    { b: 'boa', h: 'Merrill (Bank of America)', t: 'Merrill advisors in Center City, integrated with Preferred Rewards.', cta: 'Find an advisor at ml.com', src: ['boa'] },
    { b: 'chase', h: 'J.P. Morgan Wealth Management', t: 'Advisors in Chase branches, with an online booking option.', cta: 'Book at chase.com', src: ['chase', 'yelp'] },
    { b: 'fidelity', h: 'Fidelity Investor Center', t: 'Walk-in investor center with planning consultations.', cta: 'Book at fidelity.com', src: ['fidelity', 'yelp'] }
  ],
  maxBrands: 3,
  aeo: [
    { lever: 'Technical', t: 'Local listings are the battleground', d: 'Transactional advice prompts resolve through maps and local listings. Complete, review-rich profiles for every PNC Investments location (Google Business Profile and Bing Places) are the top lever.' },
    { lever: 'Content', t: 'Advisor bio pages', d: 'Crawlable advisor pages with credentials, specialties, and booking links give models the trust signals they look for, like CFP® and FINRA registration.' },
    { lever: 'Measurement', t: 'Track AI-sourced appointments', d: 'Add AI referrers as a source in appointment-booking analytics to size this channel.' }
  ]
}
};

/* ---------- Static reference content ---------- */
const PIPELINE = [
  { k: 'understand', n: 'Understand', d: 'Parse the prompt, apply memory, and infer the implied intent behind the words.' },
  { k: 'fanout', n: 'Fan out', d: 'Rewrite one prompt into many sub-queries: definitions, comparisons, local, fresh, and entity.' },
  { k: 'retrieve', n: 'Retrieve', d: 'Hit a search index (Bing, Google, Brave) and fetch candidate pages. Unreadable pages drop out here.' },
  { k: 'rank', n: 'Rank & filter', d: 'Score passages for relevance, authority, freshness, and fit with the intent, then keep the top few.' },
  { k: 'synth', n: 'Synthesize', d: 'Merge evidence with what the model already knows, resolve conflicts, and decide which brands earn a mention.' },
  { k: 'render', n: 'Render & cite', d: 'Pick an answer shape for the intent (explainer, shortlist, table, or steps) and attach citations.' }
];

const ISSUES = {
  js:    { n: 'Client-side rendered', d: 'Key content loads via JavaScript; the fetcher sees an empty shell.' },
  stale: { n: 'Stale', d: 'Last modified more than 6 months ago; down-weighted for time-sensitive intent.' }
};
