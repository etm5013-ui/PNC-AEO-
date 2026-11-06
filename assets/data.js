/* =====================================================================
   PNC AEO Lab: data
   ---------------------------------------------------------------------
   Built by PNC's Digital Organic Growth Team (SEO | AEO | Organic Content).
   Everything here is ILLUSTRATIVE. Model behaviors are simplified from
   public documentation and observed patterns; product details must be
   validated with PNC Product, Legal and Compliance before external use.

   A journey = Topic × Persona × Intent (5 × 6 × 4 = 120), run on one of
   5 models. Scenarios are assembled from the building blocks below by
   buildScenario() in engine.js.
   ===================================================================== */

const APP_VERSION = '3.4';

const TEAM = {
  name: 'Digital Organic Growth Team',
  sub: 'SEO | AEO | Organic Content',
  managers: [
    { n: 'Dimi Simovski', r: 'Digital Marketing Group Manager', d: 'Leads PNC’s Digital Marketing group, overseeing Digital Organic Growth alongside Paid Search, Affiliate and Real-Time Audience Journeys.' },
    { n: 'Eric Mayhue', r: 'Manager, Digital Organic Growth', d: 'Leads PNC’s Digital Organic Growth team, overseeing SEO, AEO and Organic Content Strategy to grow PNC’s visibility across search and AI-driven experiences.' }
  ],
  members: [
    { n: 'Ray Judy', r: 'Organic Content Strategy Lead', d: 'Owns organic content strategy and reporting, from persona-targeted guides to the answer-first pages models cite.' },
    { n: 'Brianca Hadnot', r: 'AEO Strategy Lead', d: 'Leads answer engine optimization and owns affiliate outreach, social media and brand optimization: how PNC shows up, gets cited and is described across AI assistants and third-party sources.' },
    { n: 'Joe Shepker', r: 'Technical AEO / SEO Lead', d: 'Owns the technical foundation: crawlability, rendering, structured data and schema, and site performance.' },
    { n: 'Alyssa Pugsley', r: 'Organic Content Strategy · Workflow & Process Owner', d: 'Project-manages all approval workflows and owns the team’s process end to end, seeing content through to completion while supporting content strategy.' },
    { n: 'Martha Summers', r: 'Small Business SEO Strategy', d: 'Drives organic search and AEO strategy for PNC Small Business banking, lending and cash-flow products.' },
    { n: 'Laura Rupert', r: 'C&IB / AMG SEO Strategy', d: 'Leads SEO strategy for Corporate & Institutional Banking and the Asset Management Group.' }
  ]
};

/* ---------- Brands ----------
   prior = how "known" the brand is in training data (parametric memory) */
const BRANDS = {
  pnc:      { n: 'PNC',              prior: .50, dom: 'pnc.com' },
  chase:    { n: 'Chase',            prior: .95, dom: 'chase.com' },
  boa:      { n: 'Bank of America',  prior: .90, dom: 'bankofamerica.com' },
  wf:       { n: 'Wells Fargo',      prior: .82, dom: 'wellsfargo.com' },
  capone:   { n: 'Capital One',      prior: .85, dom: 'capitalone.com' },
  citi:     { n: 'Citi',             prior: .72, dom: 'citi.com' },
  ally:     { n: 'Ally',             prior: .70, dom: 'ally.com' },
  discover: { n: 'Discover',         prior: .66, dom: 'discover.com' },
  rocket:   { n: 'Rocket Mortgage',  prior: .80, dom: 'rocketmortgage.com' },
  fidelity: { n: 'Fidelity',         prior: .82, dom: 'fidelity.com' },
  schwab:   { n: 'Charles Schwab',   prior: .78, dom: 'schwab.com' },
  usbank:   { n: 'U.S. Bank',        prior: .55, dom: 'usbank.com' },
  amex:     { n: 'American Express', prior: .90, dom: 'americanexpress.com' },
  bluevine: { n: 'Bluevine',         prior: .45, dom: 'bluevine.com' }
};

/* ---------- Source types (chart categories, fixed order; palette validated for CVD) ---------- */
const SRC_TYPES = {
  owned:      { n: 'PNC first-party',      c: '#EF6A00' },
  affiliate:  { n: 'Affiliates & publishers', c: '#2A6AB0' },
  authority:  { n: 'Gov & authority',      c: '#1E9E8A' },
  social:     { n: 'Reddit, YouTube & social', c: '#8A5CC2' },
  competitor: { n: 'Competitor first-party', c: '#C2416B' }
};

/* ---------- Models ----------
   w       how strongly retrieval favors each source type
   aff/soc how much brand mentions on affiliate / social pages count toward a brand
   fp      how much a brand's own (first-party) pages count toward that brand
   schema  lift from structured data (JSON-LD) on first-party pages
   seo     dependence on traditional organic ranking (1 = only page-one results)
   param   reliance on training-data memory; mem = uses persona memory     */
const MODELS = {
  chatgpt: {
    name: 'ChatGPT', maker: 'OpenAI', ver: 'GPT-5 with search',
    index: 'Bing index + OpenAI search index',
    bots: ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot (training)'],
    fan: 7, k: 6, param: .32, renders: false, mem: true,
    w: { owned: 1.05, affiliate: 1.2, authority: .95, social: 1.3, competitor: .9 },
    aff: 1.3, soc: 1.3, fp: 1.1, schema: .18, seo: .35,
    qpref: ['persona', 'entity', 'commercial', 'community', 'compare', 'explainer', 'freshness', 'trust', 'local', 'howto'],
    memory: 'Memory',
    style: 'Conversational, skimmable headings, inline source pills, ends with an offer to go deeper.',
    lever: 'Earn placement in the affiliate roundups and Reddit threads ChatGPT leans on most. Allow OAI-SearchBot and make sure Bing indexes key pages.',
    tip: 'weights affiliate roundups and Reddit more heavily than any other model, so PNC’s presence on those pages decides the shortlist.'
  },
  gemini: {
    name: 'Gemini', maker: 'Google', ver: '3 Pro · Google Search grounding',
    index: 'Google Search index + Knowledge Graph',
    bots: ['Googlebot', 'Google-Extended (training control)'],
    fan: 9, k: 7, param: .22, renders: true, mem: true,
    w: { owned: 1.15, affiliate: 1.05, authority: 1.05, social: 1.15, competitor: 1.05 },
    aff: 1.05, soc: 1.15, fp: 1.1, schema: .32, seo: .6,
    qpref: ['explainer', 'persona', 'entity', 'local', 'compare', 'commercial', 'freshness', 'community', 'howto', 'trust'],
    memory: 'Personal context',
    style: 'Structured: bold headers, tables, “things to consider,” then source chips.',
    lever: 'Classic Google SEO plus structured data. Gemini reads JSON-LD and the Knowledge Graph closely, weights YouTube, and pulls local intent from Google Business Profiles.',
    tip: 'fans out to the most queries, renders JavaScript through Google’s index, and gets a big lift from schema markup.'
  },
  aio: {
    name: 'AI Overviews', maker: 'Google Search', ver: 'in Google Search results',
    index: 'Google Search index · page-one organic results',
    bots: ['Googlebot'],
    fan: 4, k: 5, param: .12, renders: true, mem: false,
    w: { owned: 1.1, affiliate: 1.1, authority: 1.0, social: 1.1, competitor: 1.05 },
    aff: 1.15, soc: 1.15, fp: 1.1, schema: .35, seo: 1.0,
    qpref: ['commercial', 'explainer', 'entity', 'compare', 'local', 'howto', 'freshness', 'community', 'trust', 'persona'],
    memory: 'None (logged-out search)',
    style: 'A short summary above the organic results, with source cards. Citations come mostly from page-one rankings.',
    lever: 'SEO is the price of entry. AI Overviews cite pages that already rank on page one, so technical SEO, links, and schema-rich pages still decide visibility.',
    tip: 'cites almost entirely from pages that already rank on page one, so organic SEO strength matters most here.'
  },
  claude: {
    name: 'Claude', maker: 'Anthropic', ver: 'Opus with web search',
    index: 'Third-party web search (Brave) + live page fetch',
    bots: ['Claude-SearchBot', 'Claude-User', 'ClaudeBot (training)'],
    fan: 4, k: 5, param: .42, renders: false, mem: true,
    w: { owned: 1.08, affiliate: .95, authority: 1.38, social: .7, competitor: .95 },
    aff: .8, soc: .65, fp: 1.0, schema: .12, seo: .3,
    qpref: ['explainer', 'trust', 'compare', 'persona', 'entity', 'commercial', 'howto', 'freshness', 'local', 'community'],
    memory: 'Memory',
    style: 'Measured prose with caveats and numbered citations. Fewer, more authoritative sources.',
    lever: 'Be the authoritative primary source: clear, factual, server-rendered pages with dates and disclosures, ideally cited by .gov and educational sources. Allow Claude-SearchBot.',
    tip: 'runs fewer searches, favors authoritative and first-party sources, and discounts Reddit and affiliate lists.'
  },
  copilot: {
    name: 'Copilot', maker: 'Microsoft', ver: 'Copilot with Bing grounding',
    index: 'Bing index (IndexNow-aware)',
    bots: ['Bingbot'],
    fan: 5, k: 5, param: .28, renders: false, mem: true,
    w: { owned: 1.2, affiliate: 1.1, authority: .95, social: .85, competitor: 1.15 },
    aff: 1.0, soc: .8, fp: 1.05, schema: .25, seo: .5,
    qpref: ['entity', 'commercial', 'freshness', 'compare', 'persona', 'howto', 'local', 'explainer', 'trust', 'community'],
    memory: 'Personalization',
    style: 'Concise, numbered superscript citations, a “Learn more” list and suggested follow-ups.',
    lever: 'Be in Bing: verify in Bing Webmaster Tools, push updates with IndexNow, and keep product pages and their schema fresh. Copilot is the most willing to cite brand sites directly.',
    tip: 'is grounded on Bing and quick to cite brand product pages, so first-party content and schema count most.'
  }
};

/* ---------- Personas ---------- */
const PERSONAS = {
  general: { name: 'General / none specified', short: 'General', who: 'Anonymous user', av: '?', city: 'Pittsburgh, PA', aud: '', mem: [],
    blurb: 'No memory or context. The model only has the prompt, so it falls back on generic, national answers.' },
  student: { name: 'College Student', short: 'Student', who: 'Maya, 19 · sophomore at Penn State', av: 'M', city: 'State College, PA', aud: 'college students',
    mem: ['Is a sophomore at Penn State', 'Works part-time, about $1,200/mo', 'Parents bank with PNC'],
    blurb: 'Low balances, irregular income, first account of her own. Cares about no fees, a good app and avoiding overdrafts.' },
  starter: { name: 'The Starter', short: 'Starter', who: 'Jordan, 23 · first salaried job', av: 'J', city: 'Pittsburgh, PA', aud: 'people starting their first job',
    mem: ['Started first full-time job in July', 'Paying off $28k in student loans', 'Just signed a lease in Pittsburgh'],
    blurb: 'First paycheck, first lease, first real credit decisions. Wants to build credit, start saving and not mess it up.' },
  fthb: { name: 'First-Time Home Buyer', short: 'Home buyer', who: 'Sam & Riley, 31 · renting in Columbus', av: 'S', city: 'Columbus, OH', aud: 'first-time home buyers',
    mem: ['Renting in Columbus, OH', 'Household income about $115k', 'Plans to buy a first home within a year'],
    blurb: 'A big, emotional, multi-month decision. Wants down payment help, a lender they trust and to understand the process.' },
  ema: { name: 'Emerging Mass Affluent', short: 'Emerging affluent', who: 'Priya, 38 · director in Philadelphia', av: 'P', city: 'Philadelphia, PA', aud: 'high earners',
    mem: ['Director-level role in Philadelphia', 'About $180k in savings and investments', 'Has a 401(k) and RSUs'],
    blurb: 'Growing income and complexity. Wants relationship pricing, premium perks and a path to advice without private-bank minimums.' },
  smb: { name: 'Small Business Owner', short: 'Small business', who: 'Dana, 44 · owns an HVAC company in Cleveland', av: 'D', city: 'Cleveland, OH', aud: 'small business owners',
    mem: ['Owns a 14-employee HVAC company', 'About $2.4M in annual revenue', 'Uses QuickBooks for accounting'],
    blurb: 'Runs payroll, vendors and cash flow while doing the actual work. Wants a banker who knows small business, tools that save time and access to credit.' }
};
const PERSONA_ORDER = ['general', 'student', 'starter', 'fthb', 'ema', 'smb'];

/* ---------- Intents ---------- */
const INTENTS = {
  info:    { name: 'Information gathering',       short: 'Learn',     fmt: 'explainer', cue: 'how / what',
    d: 'The user wants to understand a topic. Brands are incidental; explainers and authorities get cited.',
    implied: (n) => `Wants to understand the basics before choosing anything, with a focus on ${n}.` },
  rec:     { name: 'Looking for recommendations', short: 'Recommend', fmt: 'shortlist', cue: 'best',
    d: 'The user wants a shortlist. The brands named on affiliate roundups and community threads decide who makes the cut.',
    implied: (n) => `Wants a short, trustworthy pick list that fits ${n}.` },
  compare: { name: 'Comparing options',           short: 'Compare',   fmt: 'table', cue: 'vs',
    d: 'The user names options. The model builds a side-by-side table from product pages, schema and comparison content.',
    implied: (n) => `Already has a shortlist and wants a tie-breaker based on ${n}.` },
  txn:     { name: 'Purchase / transactional',    short: 'Act',       fmt: 'steps', cue: 'apply / open',
    d: 'The user is ready to act. Product pages, application paths and local listings carry the most weight.',
    implied: (n) => `Ready to act now and wants the fastest path, with ${n}.` }
};

/* How much each content format is boosted by each intent */
const INTENT_FMT = {
  info:    { explainer: 1.35, guide: 1.3, howto: 1.15, tool: 1.0, listicle: .85, compare: .9, product: .78, review: .85, thread: .95, local: .6, video: 1.05 },
  rec:     { explainer: .8, guide: 1.1, howto: .85, tool: .8, listicle: 1.45, compare: 1.1, product: .9, review: 1.25, thread: 1.2, local: .9, video: 1.0 },
  compare: { explainer: .8, guide: 1.0, howto: .8, tool: .9, listicle: 1.05, compare: 1.5, product: 1.25, review: 1.15, thread: 1.0, local: .7, video: .9 },
  txn:     { explainer: .7, guide: .95, howto: 1.2, tool: 1.3, listicle: .75, compare: .9, product: 1.55, review: .9, thread: .75, local: 1.35, video: .8 }
};

/* What each persona needs, by topic: [need phrase used in the implied intent, inferred signal chips...] */
const NEEDS = {
  general: { checking: ['low fees and a good app', 'Fee-averse', 'Values a good app'], online: ['an app that is easy and secure', 'Mobile-first', 'Security-conscious'], mortgage: ['a fair rate and a smooth process', 'Rate-sensitive', 'Wants a simple process'], wealth: ['understanding fees and trust', 'Unsure if advice is worth it', 'Fee-sensitive'], cards: ['simple, solid rewards', 'Rewards-motivated', 'No annual fee'] },
  student: { checking: ['no fees and overdraft protection on a small income', 'Low, irregular balance', 'Overdraft risk', 'Parents may transfer money'], online: ['budgeting help and easy Zelle splits', 'Splits rent and dinners', 'Mobile-only', 'Needs budgeting nudges'], mortgage: ['building credit now for a future purchase', 'Long time horizon', 'Thin credit file', 'Curious, not ready'], wealth: ['starting small with low minimums', 'Very small balances', 'Wants to learn', 'Mobile-first investing'], cards: ['building credit safely with no history', 'No credit history', 'Approval-odds anxiety', 'No annual fee'] },
  starter: { checking: ['setting up direct deposit and automatic savings', 'First paycheck', 'Needs an emergency fund', 'Responds to automation'], online: ['budgeting a first salary automatically', 'New income', 'Wants auto-savings', 'Loan payments to track'], mortgage: ['how long to save and what credit is needed', 'Renting now', 'Student loans', 'Buying in 2 to 4 years'], wealth: ['starting a Roth IRA alongside a 401(k)', 'New 401(k)', 'Small but growing savings', 'Wants simple rules'], cards: ['building credit without getting into debt', 'Thin credit file', 'Fear of debt', 'Wants a path to better cards'] },
  fthb: { checking: ['keeping savings and a future mortgage under one roof', 'Saving for a down payment', 'Will need a lender soon', 'Values relationship perks'], online: ['tracking savings and credit toward a home', 'Saving goal', 'Credit-score focused', 'Wants progress tracking'], mortgage: ['down payment help and a trusted lender', 'Thinks 20% down is required', 'Grant-eligible', 'Needs hand-holding'], wealth: ['keeping down payment money safe but earning', 'Short time horizon', 'Low risk tolerance', 'Liquidity needed'], cards: ['not hurting a mortgage application', 'Pre-approval coming', 'Credit-score sensitive', 'Avoids new inquiries'] },
  ema: { checking: ['relationship perks for a high balance', '$100k+ relationship', 'Wants a named banker', 'Travel perks appeal'], online: ['seeing every account in one place', 'Many accounts', 'Wants alerts and controls', 'Values time'], mortgage: ['jumbo financing and relationship pricing', 'Buying a bigger home', 'Has investments to pledge', 'Rate discount seeker'], wealth: ['when advice is worth it and how fees work', 'Has equity comp', 'Tax optimization need', 'Distrusts commissions'], cards: ['maximizing rewards on big spending', 'High monthly spend', 'Values perks', 'Wants a bank tie-in'] },
  smb: { checking: ['business-grade tools and a banker who knows small business', 'Payroll and vendor payments', 'Needs cash-flow visibility', 'May need credit later'], online: ['cash-flow visibility, ACH and accounting integration', 'Uses QuickBooks', 'Pays vendors by ACH', 'Time-starved'], mortgage: ['an SBA lender for an owner-occupied building', 'Paying rent on a building', 'SBA-eligible', 'Needs a local lender'], wealth: ['a 401(k) for employees and personal wealth planning', '14 employees', 'Retention concerns', 'Owner exit planning ahead'], cards: ['employee cards, controls and cash back', 'Many small purchases', 'Employee spending', 'Wants to separate expenses'] }
};

/* ---------- Topics ----------
   products[segment][brand] = [name, line, col1, col2, col3, bestFor]
   pools[segment] = third-party + competitor sources the retriever can find
   m (mentions) on affiliate pages: [brand, label] in list order
   m on social pages: [brand, sentiment(+ ~ -), count, quote]
   boost = what changes after third-party outreach / community participation */
const TOPICS = {

/* ====================== CHECKING ====================== */
checking: {
  name: 'Checking Accounts', short: 'Checking', ic: 'check',
  segOf: { student: 'student', ema: 'ema', smb: 'smb' },
  cat: { default: ['checking account', 'checking accounts'], student: ['student checking account', 'student checking accounts'], ema: ['premium checking account', 'premium checking accounts'], smb: ['business checking account', 'business checking accounts'] },
  feeword: 'fees and requirements', localQ: 'PNC branch',
  trustQ: 'checking account FDIC insurance and overdraft rules',
  // extra sources the retriever finds when the prompt asks about a bonus
  bonusSrc: [
    { id: 'nwb', dom: 'nerdwallet.com', t: 'Best Bank Bonuses and Promotions: November 2026', type: 'affiliate', fmt: 'listicle', rel: .92, seo: .95, m: [['chase', 'Best overall bonus'], ['wf', 'Best for everyday checking'], ['pnc', 'Best bonus with budgeting tools'], ['capone', 'Best no-fee option']] },
    { id: 'doc', dom: 'doctorofcredit.com', t: 'Best Bank Account Bonuses (Updated Weekly)', type: 'social', fmt: 'thread', rel: .78, seo: .82, m: [['chase', '+', 12, 'Chase’s checking bonus is still the easiest one to hit.'], ['wf', '~', 6, 'Wells Fargo’s bonus is fine but the direct deposit rules are fiddly.'], ['pnc', '+', 5, 'PNC’s checking bonus posted on time for me.']] },
    { id: 'compB', dom: 'chase.com', path: '/personal/checking/coupon', t: 'Chase checking: new customer offer', type: 'competitor', fmt: 'product', rel: .9, seo: .92, brand: 'chase' }
  ],
  cols: ['Monthly fee & waiver', 'Overdraft approach', 'Standout'],
  schemaType: 'BankAccount',
  faqQ: ['Is there a monthly service charge?', 'How does PNC help me avoid overdraft fees?'],
  compare: { default: ['pnc', 'chase', 'wf'], student: ['pnc', 'chase', 'boa'], ema: ['pnc', 'chase', 'boa'], smb: ['pnc', 'chase', 'boa'] },
  prompts: {
    info: ['What should I look for in a checking account, and how do overdraft fees work?', 'What should a college student look for in a checking account?', 'I just got my first real paycheck. What kind of checking account should I have now?', 'I’m saving for a down payment. Should my checking and savings be at the same bank as my mortgage?', 'Are premium checking accounts worth it if I keep a high balance?', 'Do I need a separate business checking account for my small business, and what should I look for?'],
    rec: ['What’s the best bank for everyday checking? I want a good app and no surprise fees.', 'What’s the best checking account for a college student with no fees?', 'What’s the best checking account for someone who just started their first job?', 'Which bank has the best checking account if I’m also planning to get a mortgage soon?', 'What’s the best premium checking account for a high earner who wants perks?', 'What’s the best business checking account for a small business with about 15 employees?'],
    compare: ['PNC vs Chase vs Wells Fargo for checking: which is actually better?', 'PNC Simple Checking vs Chase College Checking vs Bank of America for a college student?', 'PNC Virtual Wallet vs Chase Total Checking vs Wells Fargo for my first real checking account?', 'PNC vs Chase vs Wells Fargo checking: which is best if I’ll also need a mortgage?', 'PNC Performance Select vs Chase Sapphire Banking vs Bank of America Preferred Rewards?', 'PNC Business Checking vs Chase Business Complete vs Bank of America Business Advantage?'],
    txn: ['I want to open a checking account online today. Which one has a good bonus, and how do I apply?', 'How do I open a student checking account online today?', 'I want to open a checking account and set up direct deposit before my first paycheck. Where should I start?', 'I want to open a checking account at a bank that also does mortgages. Where should I apply?', 'I want to open a premium checking account and move about $150k over. Where should I start?', 'I need to open a business checking account this week for my LLC. What do I need and where?']
  },
  products: {
    default: {
      pnc: ['PNC Virtual Wallet', 'Checking paired with Reserve and Growth savings, budgeting tools like Spend Analyzer, and Low Cash Mode for extra time to fix a negative balance.', 'Waivable with qualifying direct deposit or balance', 'Low Cash Mode: alerts plus extra time before fees', 'Spend, Reserve and Growth accounts with built-in budgeting', 'budgeting tools and overdraft protection matter most'],
      chase: ['Chase Total Checking', 'The largest branch and ATM network and a polished app. The fee is waivable with direct deposit.', 'Waivable with direct deposit or balance', 'Overdraft Assist for small overdrafts', 'Biggest ATM network; frequent sign-up bonus', 'you want the biggest ATM network or a sign-up bonus'],
      wf: ['Wells Fargo Everyday Checking', 'A large footprint and frequent new-account offers.', 'Waivable with direct deposit or balance', 'Extra Day Grace Period', 'Large footprint in the West and South', 'you live in its footprint'],
      capone: ['Capital One 360 Checking', 'No monthly fees, no overdraft fees and a top-rated app.', 'None', 'No overdraft fees', 'Fee-free with a top-rated app', 'you want zero fees and don’t need branches'],
      ally: ['Ally Spending Account', 'Online-only with no monthly fees and savings buckets.', 'None', 'CoverDraft', 'Savings buckets', 'you’re comfortable being fully digital']
    },
    student: {
      pnc: ['PNC Simple Checking', 'A straightforward checking account built for getting started, with PNC’s digital money tools and Low Cash Mode to help avoid overdraft fees.', 'See pnc.com for fee and waiver details', 'Low Cash Mode: alerts plus extra time', 'Simple setup; links easily to a parent’s PNC account', 'you want a simple first account and your family banks with PNC'],
      chase: ['Chase College Checking', 'No monthly fee for up to five years while enrolled, plus a big ATM network.', 'None for up to 5 years in school', 'Overdraft Assist', 'Big ATM network; student bonus', 'a sign-up bonus and ATM reach matter most'],
      boa: ['Bank of America Advantage SafeBalance', 'Fee waived for eligible students, and it can’t overdraw.', 'Waived for eligible students', 'No overdrafts (transactions decline)', 'Zero overdraft risk', 'you never want to risk overdrafting'],
      capone: ['Capital One 360 Checking', 'No fees at all and a top-rated app.', 'None', 'No overdraft fees', 'Fully fee-free', 'you don’t need branches'],
      discover: ['Discover Cashback Debit', 'No fees and cash back on debit purchases.', 'None', 'No overdraft fees', 'Cash back on debit', 'you want rewards on debit']
    },
    ema: {
      pnc: ['PNC Virtual Wallet with Performance Select', 'PNC’s premium tier: relationship rates, ATM fee reimbursements and perks, with a path to PNC Investments and PNC Private Bank.', 'Waivable with qualifying balances or direct deposit', 'Low Cash Mode plus relationship perks', 'Banker access and a path to advice', 'you want a local banker and integrated budgeting'],
      chase: ['Chase Sapphire Banking', 'Premium checking with ATM fee refunds and J.P. Morgan advisor access.', '$75k in qualifying balances', 'Overdraft Assist', 'No foreign fees; advisor access', 'you travel and use Sapphire cards'],
      boa: ['Bank of America Preferred Rewards', 'Tiered benefits across banking, Merrill investing and credit card boosts.', 'Tiers from $20k to $100k+', 'Balance Connect', 'Up to 75% card rewards boost', 'you’ll consolidate with Merrill and BofA cards'],
      citi: ['Citi Priority', 'A relationship tier with travel-friendly perks and wealth advisors.', 'Combined balance requirement', 'Standard overdraft protection', 'Travel perks', 'you want Citi’s travel ecosystem']
    },
    smb: {
      pnc: ['PNC Business Checking', 'Tiered business checking with PNC Cash Flow Insight for invoicing and cash forecasting, plus SBA lending and treasury services as you grow.', 'Waivable with balances or activity', 'Business overdraft protection options', 'Cash Flow Insight and a dedicated business banker', 'you want a local business banker and cash-flow tools'],
      chase: ['Chase Business Complete Banking', 'Built-in card acceptance and a large branch network.', 'Waivable with balance or card sales', 'Overdraft protection options', 'QuickAccept card processing', 'you take card payments in person'],
      boa: ['Bank of America Business Advantage', 'Two tiers with accounting integrations and Preferred Rewards for Business.', 'Waivable with balance or spend', 'Balance Connect', 'Rewards tie-in', 'you want to tie in BofA rewards'],
      bluevine: ['Bluevine Business Checking', 'Online-only with no monthly fee and interest on balances.', 'None', 'Limited', 'Interest on balances', 'you’re fully online'],
      wf: ['Wells Fargo Initiate Business Checking', 'A low-fee entry business account.', 'Waivable with balance', 'Overdraft protection options', 'Large footprint', 'you want a simple starter account']
    }
  },
  pages: {
    default: { path: '/personal-banking/banking/checking/virtual-wallet', t: 'Virtual Wallet® | Checking + Savings' },
    student: { path: '/personal-banking/banking/checking/simple-checking.html', t: 'PNC Simple Checking' },
    ema: { path: '/personal-banking/banking/checking/virtual-wallet/performance-select', t: 'Virtual Wallet® with Performance Select', js: true },
    smb: { path: '/small-business/banking/business-checking', t: 'Business Checking Accounts | PNC' }
  },
  article: { path: '/insights/personal-finance/spend/what-is-a-checking-account', t: 'What Is a Checking Account?' },
  ppages: {
    student: { path: '/insights/college/checking-for-college-students', t: 'Checking for College Students: What to Look For', line: 'PNC also publishes a student banking guide that explains linking to a parent’s account for instant transfers.' },
    starter: { path: '/insights/first-job/set-up-checking-first-paycheck', t: 'Your First Paycheck: Setting Up Checking That Works', line: 'PNC’s first-paycheck guide walks through splitting direct deposit between Spend and Growth.' },
    fthb: { path: '/insights/home/banking-while-saving-for-a-home', t: 'Banking While You Save for Your First Home', line: 'PNC’s guide for future home buyers shows how Virtual Wallet’s Growth account can hold a down payment fund.' },
    ema: { path: '/insights/wealth/premium-checking-worth-it', t: 'Is Premium Checking Worth It for High Balances?', line: 'PNC’s guide for high-balance customers explains how relationship benefits stack with PNC Investments.' },
    smb: { path: '/small-business/insights/choosing-business-checking', t: 'How to Choose a Business Checking Account', line: 'PNC’s small business guide covers separating finances and when to add treasury services.' }
  },
  points: {
    default: [['Fees and how to waive them', 'Most checking accounts charge a monthly fee that you can waive with direct deposit or a minimum balance. Read the waiver rules before you open.'], ['Overdraft protection', 'Policies vary a lot. Look for low-balance alerts, grace periods and options that decline rather than overdraw.'], ['App and access', 'Mobile deposit, Zelle and good alerts matter day to day, along with ATMs where you live.']],
    smb: [['Keep business money separate', 'A dedicated business account protects your liability shield, simplifies taxes and builds a banking history for future credit.'], ['Fees by transaction volume', 'Business accounts often limit free transactions and cash deposits. Match the tier to your monthly activity.'], ['Tools that save time', 'Look for ACH, invoicing, accounting integrations and a banker who can help with credit later.']]
  },
  pp: {
    student: 'As a student, prioritize no monthly fee, low-balance alerts and easy transfers from family.',
    starter: 'With a first paycheck, set up direct deposit that automatically splits into savings.',
    fthb: 'Since you’re saving for a home, keeping deposits with a bank that also lends can help with relationship pricing and simpler paperwork.',
    ema: 'At higher balances, compare the relationship perks you actually use, not just the fee waiver.',
    smb: 'With 14 employees, prioritize payroll support, ACH and a banker who understands seasonal cash flow.'
  },
  steps: { default: ['Choose an account and check the fee waiver and any bonus terms.', 'Have your SSN, a government ID and a funding account ready.', 'Apply online in 5 to 10 minutes.', 'Set up direct deposit and alerts.'], smb: ['Gather your EIN, formation documents (articles or operating agreement) and owner IDs.', 'Choose a tier that fits your monthly transaction volume.', 'Apply online or with a business banker.', 'Set up online banking, ACH and accounting integration.'] },
  pools: {
    default: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Checking Accounts of 2026', type: 'affiliate', fmt: 'listicle', rel: .9, seo: .95, m: [['capone', 'Best overall'], ['chase', 'Best for branch access'], ['ally', 'Best online-only'], ['wf', 'Best for nationwide footprint']], boost: [3, 'Best for budgeting tools'] },
      { id: 'fa', dom: 'forbes.com', path: '/advisor', t: 'Best Free Checking Accounts', type: 'affiliate', fmt: 'listicle', rel: .82, seo: .85, m: [['capone', 'Best for no fees'], ['ally', 'Best for savers'], ['chase', 'Best big bank']], boost: [2, 'Best for overdraft protection'] },
      { id: 'br', dom: 'bankrate.com', t: 'PNC Virtual Wallet review 2026', type: 'affiliate', fmt: 'review', rel: .7, seo: .65, m: [['pnc', 'Review: 4.2/5']] },
      { id: 'rd', dom: 'reddit.com', path: '/r/personalfinance', t: 'Which big bank has the least annoying fees?', type: 'social', fmt: 'thread', rel: .74, seo: .8, m: [['capone', '+', 14, 'Capital One 360. No fees, never looked back.'], ['ally', '+', 9, 'Ally for the savings buckets, honestly.'], ['chase', '~', 6, 'Chase is fine as long as your direct deposit hits.'], ['pnc', '-', 2, 'PNC hit me with a fee years ago, not sure if that changed.']], boost: ['+', 9, 'PNC has Low Cash Mode now. It gave me a day to fix a negative balance with no fee.'] },
      { id: 'yt', dom: 'youtube.com', t: 'Best Bank Accounts in 2026 (Honest Review)', type: 'social', fmt: 'video', rel: .62, seo: .7, m: [['chase', '+', 1, 'Chase has the most branches by far.'], ['capone', '+', 1, 'Capital One is my top pick for no fees.']], boost: ['+', 1, 'PNC Virtual Wallet is underrated if you like budgeting tools.'] },
      { id: 'cfpb', dom: 'consumerfinance.gov', t: 'Checking accounts and overdraft fees: what to know', type: 'authority', fmt: 'explainer', rel: .72, seo: .75, m: [] },
      { id: 'comp', dom: 'chase.com', t: 'Chase Total Checking®', type: 'competitor', fmt: 'product', rel: .6, seo: .85, brand: 'chase' }
    ],
    student: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Student Checking Accounts', type: 'affiliate', fmt: 'listicle', rel: .9, seo: .95, m: [['capone', 'Best overall'], ['chase', 'Best for sign-up bonus'], ['discover', 'Best for cash back'], ['boa', 'Best for avoiding overdrafts']], boost: [2, 'Best for students with family at PNC'] },
      { id: 'cs', dom: 'cnbc.com', path: '/select', t: 'Best checking accounts for college students', type: 'affiliate', fmt: 'listicle', rel: .8, seo: .8, m: [['capone', 'Best overall'], ['discover', 'Best rewards'], ['chase', 'Best big bank'], ['pnc', 'Best for campus branches']] },
      { id: 'rd', dom: 'reddit.com', path: '/r/college', t: 'What bank do you use in college?', type: 'social', fmt: 'thread', rel: .76, seo: .75, m: [['capone', '+', 11, 'Capital One. No fees and the app is clean.'], ['chase', '+', 7, 'Chase, there’s an ATM on every corner near campus.'], ['discover', '+', 4, 'Discover debit gives cash back lol'], ['pnc', '~', 3, 'PNC because my parents use it. It’s fine.']], boost: ['+', 9, 'PNC Simple Checking was easy to open and my parents can send money instantly.'] },
      { id: 'tk', dom: 'tiktok.com', t: '“Bank accounts I wish I had in college”', type: 'social', fmt: 'video', rel: .55, seo: .4, m: [['capone', '+', 1, 'Capital One 360 is the no-fee GOAT.'], ['discover', '+', 1, 'Discover pays you cash back on your debit card.']], boost: ['+', 1, 'If your parents are at PNC, Simple Checking makes transfers instant.'] },
      { id: 'cfpb', dom: 'consumerfinance.gov', t: 'Choosing a college bank account', type: 'authority', fmt: 'explainer', rel: .82, seo: .7, m: [] },
      { id: 'comp', dom: 'chase.com', t: 'Chase College Checking℠', type: 'competitor', fmt: 'product', rel: .6, seo: .85, brand: 'chase' }
    ],
    ema: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Premium Checking Accounts', type: 'affiliate', fmt: 'listicle', rel: .86, seo: .9, m: [['chase', 'Best for travelers'], ['boa', 'Best for rewards boosts'], ['citi', 'Best relationship perks']], boost: [3, 'Best for local relationship banking'] },
      { id: 'fa', dom: 'forbes.com', path: '/advisor', t: 'Best Banks for Wealthy Customers', type: 'affiliate', fmt: 'listicle', rel: .8, seo: .8, m: [['boa', 'Best overall'], ['chase', 'Best for advisor access'], ['citi', 'Best for global banking']], boost: [3, 'Best regional relationship bank'] },
      { id: 'br', dom: 'bankrate.com', t: 'PNC Performance Select review', type: 'affiliate', fmt: 'review', rel: .68, seo: .6, m: [['pnc', 'Review: 4.0/5']] },
      { id: 'rd', dom: 'reddit.com', path: '/r/HENRYfinance', t: 'Is any bank’s premium tier worth it?', type: 'social', fmt: 'thread', rel: .72, seo: .7, m: [['boa', '+', 12, 'Platinum Honors is unbeatable if you also use Merrill.'], ['chase', '~', 5, 'Sapphire Banking is fine but mostly about the card.'], ['citi', '~', 3, 'Citi Priority was meh for me.']], boost: ['+', 5, 'PNC Performance Select has been solid. My banker actually answers the phone.'] },
      { id: 'comp', dom: 'bankofamerica.com', t: 'Preferred Rewards', type: 'competitor', fmt: 'product', rel: .7, seo: .85, brand: 'boa' }
    ],
    smb: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Business Checking Accounts of 2026', type: 'affiliate', fmt: 'listicle', rel: .9, seo: .95, m: [['bluevine', 'Best online'], ['chase', 'Best for card acceptance'], ['boa', 'Best for rewards'], ['wf', 'Best starter account']], boost: [3, 'Best for cash-flow tools'] },
      { id: 'fa', dom: 'forbes.com', path: '/advisor', t: 'Best Small Business Bank Accounts', type: 'affiliate', fmt: 'listicle', rel: .82, seo: .82, m: [['chase', 'Best overall'], ['bluevine', 'Best for interest'], ['boa', 'Best for integrations'], ['pnc', 'Best for regional businesses']] },
      { id: 'rd', dom: 'reddit.com', path: '/r/smallbusiness', t: 'Which bank for business checking? Tired of fees', type: 'social', fmt: 'thread', rel: .74, seo: .72, m: [['bluevine', '+', 8, 'Bluevine, no fees and it pays interest.'], ['chase', '~', 6, 'Chase works but the fees add up with cash deposits.'], ['boa', '~', 3, 'BofA was okay.']], boost: ['+', 6, 'We moved to PNC. Cash Flow Insight replaced a separate forecasting tool and our banker knows HVAC seasonality.'] },
      { id: 'yt', dom: 'youtube.com', t: 'Best Business Bank Accounts 2026', type: 'social', fmt: 'video', rel: .6, seo: .65, m: [['bluevine', '+', 1, 'Bluevine is the best online option.'], ['chase', '+', 1, 'Chase if you need branches and card processing.']], boost: ['+', 1, 'PNC is worth a look if you want a business banker and cash-flow forecasting.'] },
      { id: 'sba', dom: 'sba.gov', t: 'Open a business bank account', type: 'authority', fmt: 'howto', rel: .78, seo: .8, m: [] },
      { id: 'comp', dom: 'chase.com', t: 'Chase Business Complete Banking®', type: 'competitor', fmt: 'product', rel: .62, seo: .85, brand: 'chase' }
    ]
  }
},

/* ====================== ONLINE BANKING ====================== */
online: {
  name: 'Online Banking', short: 'Online banking', ic: 'phone',
  segOf: { smb: 'smb' },
  cat: { default: ['mobile banking app', 'mobile banking apps'], smb: ['business online banking platform', 'business online banking platforms'] },
  feeword: 'app features', localQ: 'PNC branch',
  trustQ: 'is mobile banking safe FDIC',
  cols: ['Tools & rating', 'Payments', 'Standout'],
  schemaType: 'MobileApplication',
  faqQ: ['What can I do in the PNC Mobile app?', 'Can I send money with Zelle in the PNC app?'],
  compare: { default: ['pnc', 'chase', 'capone'], smb: ['pnc', 'chase', 'boa'] },
  prompts: {
    info: ['What features should I expect from a good mobile banking app, and is it safe?', 'What banking app features actually help college students manage money?', 'What banking app tools can help me budget my first paycheck?', 'Can my bank’s app help me save for a down payment and track my credit?', 'What digital tools do banks offer for people managing a lot of accounts?', 'What should small business online banking include, like cash flow tools and ACH?'],
    rec: ['Which bank has the best mobile app right now?', 'What’s the best banking app for college students who want budgeting help?', 'What’s the best banking app for budgeting and saving automatically?', 'Which bank app is best for saving toward a house?', 'Which bank has the best digital experience for high-balance customers?', 'What’s the best online banking platform for a small business?'],
    compare: ['PNC app vs Chase app vs Capital One app: which is better?', 'Is the PNC, Chase or Capital One app better for a college student?', 'PNC Virtual Wallet tools vs Chase vs Capital One for budgeting my first salary?', 'PNC vs Chase vs Capital One apps for saving toward a down payment?', 'PNC vs Chase vs Capital One digital banking for managing multiple accounts?', 'PNC Cash Flow Insight vs Chase business online banking vs Bank of America Business Advantage 360?'],
    txn: ['How do I set up mobile banking and Zelle today?', 'How do I set up a banking app and Zelle so I can split rent with roommates?', 'How do I set up direct deposit and automatic savings in my bank app?', 'How do I set up automatic savings for a down payment in my bank app?', 'How do I link all my accounts in one bank app and set up alerts?', 'How do I enroll in business online banking and pay my vendors by ACH?']
  },
  products: {
    default: {
      pnc: ['PNC Mobile with Virtual Wallet', 'Spend Analyzer, the Money Bar, savings goals and Low Cash Mode alerts built into the app.', 'Budgeting built in; highly rated', 'Zelle, mobile deposit, bill pay', 'Low Cash Mode and the Money Bar', 'you want budgeting tools inside your banking app'],
      chase: ['Chase Mobile', 'A polished app with Zelle, credit score tools and card controls.', 'Highly rated; Credit Journey', 'Zelle, mobile deposit', 'Broad feature set', 'you want an all-in-one app'],
      capone: ['Capital One Mobile', 'A top-rated app with CreditWise and no-fee banking.', 'Top-rated; CreditWise', 'Zelle, mobile deposit', 'Clean design, no fees', 'you want the simplest fee-free app'],
      boa: ['Bank of America Mobile', 'Erica virtual assistant and spending insights.', 'Highly rated; Erica assistant', 'Zelle, mobile deposit', 'AI assistant', 'you want an AI assistant'],
      ally: ['Ally Mobile', 'Savings buckets and boosters in an online-only app.', 'Well rated; savings buckets', 'Zelle, mobile deposit', 'Savings automation', 'you save in buckets']
    },
    smb: {
      pnc: ['PNC Cash Flow Insight', 'Invoicing, payables and cash forecasting inside PNC business online banking.', 'Cash forecasting and invoicing built in', 'ACH, wires, bill pay', 'Cash-flow forecasting', 'you need cash-flow visibility across accounts'],
      chase: ['Chase Business online banking', 'Card acceptance and payments in one platform.', 'Strong mobile app', 'ACH, wires, QuickAccept', 'Card acceptance', 'you take card payments'],
      boa: ['Bank of America Business Advantage 360', 'A cash-flow monitor and accounting software integrations.', 'Cash flow monitor', 'ACH, wires, Zelle', 'Accounting integrations', 'you rely on accounting integrations'],
      bluevine: ['Bluevine', 'Online business banking with bill pay and sub-accounts.', 'Simple online tools', 'ACH, bill pay', 'Sub-accounts', 'you’re fully online']
    }
  },
  pages: {
    default: { path: '/personal-banking/banking/online-and-mobile-banking', t: 'Online & Mobile Banking | PNC' },
    smb: { path: '/small-business/banking/cash-flow-insight', t: 'PNC Cash Flow Insight®', js: true }
  },
  article: { path: '/insights/personal-finance/spend/mobile-banking-features', t: 'Mobile Banking Features You Should Be Using' },
  ppages: {
    student: { path: '/insights/college/budgeting-app-tips-for-students', t: 'Budgeting App Tips for College Students', line: 'PNC’s student budgeting guide shows how to use the Money Bar to set a weekly spending limit.' },
    starter: { path: '/insights/first-job/automate-your-first-salary', t: 'Automate Your First Salary in the PNC App', line: 'PNC’s first-job guide explains automatic transfers to Growth on payday.' },
    fthb: { path: '/insights/home/save-for-a-down-payment-in-app', t: 'Save for a Down Payment with Savings Goals', line: 'PNC’s home-saver guide shows savings goals and credit tracking side by side.' },
    ema: { path: '/insights/wealth/manage-all-accounts-in-one-place', t: 'See All Your Accounts in One Place', line: 'PNC’s guide covers linking investment accounts and setting custom alerts.' },
    smb: { path: '/small-business/insights/digital-tools-for-small-business', t: 'Digital Banking Tools for Small Businesses', line: 'PNC’s small business guide shows how Cash Flow Insight syncs with QuickBooks.' }
  },
  points: {
    default: [['Core features', 'Expect mobile check deposit, Zelle, bill pay, card controls and real-time alerts.'], ['Budgeting and savings tools', 'Some banks build in spending trackers, savings goals and low-balance warnings. These matter more than design.'], ['Security', 'Look for multi-factor authentication, card lock and FDIC-insured accounts. Avoid public Wi-Fi for banking.']],
    smb: [['Cash-flow visibility', 'Forecasting and a real-time view of receivables and payables help avoid payroll surprises.'], ['Payments', 'ACH, wires, positive pay and approval workflows protect against fraud and save time.'], ['Integrations', 'Syncing with QuickBooks or Xero cuts manual reconciliation.']]
  },
  pp: {
    student: 'As a student, look for spending limits and instant Zelle splits for rent and dinners.',
    starter: 'With a first salary, set up automatic transfers on payday so saving happens first.',
    fthb: 'Use a dedicated savings goal for the down payment and track your credit score in the same app.',
    ema: 'With many accounts, a single dashboard and custom alerts save the most time.',
    smb: 'For a 14-person team, approval workflows and QuickBooks sync matter more than a pretty app.'
  },
  steps: { default: ['Download your bank’s app and sign in or enroll.', 'Turn on multi-factor authentication and alerts.', 'Enroll in Zelle with your phone or email.', 'Set up automatic transfers to savings.'], smb: ['Enroll in business online banking with your EIN and account details.', 'Add users and set approval limits.', 'Add vendors and set up ACH payments.', 'Connect QuickBooks or your accounting software.'] },
  pools: {
    default: [
      { id: 'jdp', dom: 'jdpower.com', t: 'U.S. Banking Mobile App Satisfaction Study', type: 'authority', fmt: 'review', rel: .78, seo: .8, m: [['chase', 'Top ranked'], ['capone', 'Top ranked'], ['boa', 'Above average'], ['pnc', 'Above average']] },
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Banking Apps of 2026', type: 'affiliate', fmt: 'listicle', rel: .88, seo: .92, m: [['capone', 'Best overall'], ['chase', 'Best big-bank app'], ['ally', 'Best for savers'], ['boa', 'Best AI assistant']], boost: [3, 'Best built-in budgeting'] },
      { id: 'cs', dom: 'cnbc.com', path: '/select', t: 'Best mobile banking apps', type: 'affiliate', fmt: 'listicle', rel: .8, seo: .78, m: [['chase', 'Best overall'], ['capone', 'Best no-fee'], ['boa', 'Best features']], boost: [2, 'Best for budgeting tools'] },
      { id: 'rd', dom: 'reddit.com', path: '/r/personalfinance', t: 'Which bank actually has a good app?', type: 'social', fmt: 'thread', rel: .74, seo: .8, m: [['capone', '+', 15, 'Capital One’s app is the cleanest by far.'], ['chase', '+', 9, 'Chase app does everything.'], ['boa', '~', 4, 'Erica is kind of a gimmick.'], ['pnc', '~', 2, 'PNC’s app is okay.']], boost: ['+', 7, 'PNC’s Money Bar is honestly underrated for budgeting.'] },
      { id: 'yt', dom: 'youtube.com', t: 'I Tested 6 Banking Apps for 30 Days', type: 'social', fmt: 'video', rel: .64, seo: .7, m: [['chase', '+', 1, 'Chase wins on features.'], ['capone', '+', 1, 'Capital One wins on simplicity.'], ['ally', '+', 1, 'Ally’s buckets are great for saving.']], boost: ['+', 1, 'PNC’s Low Cash Mode is the best overdraft feature I tested.'] },
      { id: 'fdic', dom: 'fdic.gov', t: 'Banking safely online', type: 'authority', fmt: 'explainer', rel: .7, seo: .7, m: [] },
      { id: 'comp', dom: 'chase.com', t: 'Chase Mobile® app', type: 'competitor', fmt: 'product', rel: .6, seo: .85, brand: 'chase' }
    ],
    smb: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Online Business Bank Accounts', type: 'affiliate', fmt: 'listicle', rel: .86, seo: .9, m: [['bluevine', 'Best overall'], ['chase', 'Best for card payments'], ['boa', 'Best integrations']], boost: [2, 'Best cash-flow forecasting'] },
      { id: 'fa', dom: 'forbes.com', path: '/advisor', t: 'Best Business Banking Platforms', type: 'affiliate', fmt: 'listicle', rel: .8, seo: .8, m: [['boa', 'Best for integrations'], ['chase', 'Best all-in-one'], ['bluevine', 'Best for startups']], boost: [3, 'Best for regional businesses'] },
      { id: 'rd', dom: 'reddit.com', path: '/r/smallbusiness', t: 'Best bank for ACH and invoicing?', type: 'social', fmt: 'thread', rel: .72, seo: .7, m: [['bluevine', '+', 7, 'Bluevine’s bill pay is easy.'], ['chase', '~', 5, 'Chase ACH limits annoyed me.'], ['boa', '+', 4, 'BofA syncs with QuickBooks well.']], boost: ['+', 5, 'PNC Cash Flow Insight does invoicing and forecasting, and it syncs with QuickBooks.'] },
      { id: 'sba', dom: 'sba.gov', t: 'Manage your finances', type: 'authority', fmt: 'explainer', rel: .7, seo: .75, m: [] },
      { id: 'comp', dom: 'bankofamerica.com', t: 'Business Advantage 360', type: 'competitor', fmt: 'product', rel: .62, seo: .82, brand: 'boa' }
    ]
  }
},

/* ====================== MORTGAGE ====================== */
mortgage: {
  name: 'Mortgage Loans', short: 'Mortgage', ic: 'home',
  segOf: { smb: 'smb' },
  cat: { default: ['mortgage lender', 'mortgage lenders'], smb: ['commercial real estate loan', 'commercial real estate loans'] },
  feeword: 'mortgage rates and programs', localQ: 'PNC mortgage loan officer',
  trustQ: 'how much down payment do I need CFPB',
  cols: ['Down payment options', 'Help with costs', 'Standout'],
  schemaType: 'MortgageLoan',
  faqQ: ['How much do I need for a down payment?', 'Does PNC offer down payment or closing cost help?'],
  compare: { default: ['pnc', 'chase', 'rocket'], smb: ['pnc', 'wf', 'chase'] },
  prompts: {
    info: ['How do mortgage rates work, and how much house can I afford?', 'I’m in college. What should I do now to be able to buy a house someday?', 'How long does it take to save for a house, and what credit score do I need?', 'How much do I really need for a down payment on my first home, and are there grants?', 'Should I pay cash, take a jumbo loan or keep investing when buying a bigger home?', 'How do commercial real estate loans work if I want to buy a building for my business?'],
    rec: ['Who are the best mortgage lenders right now?', 'Which lenders help young buyers with low down payments?', 'What are the best mortgage lenders for someone buying a first condo with a small down payment?', 'What are the best mortgage lenders for first-time home buyers with a low down payment?', 'What are the best lenders for a jumbo mortgage with relationship pricing?', 'What are the best banks for an SBA 504 or owner-occupied commercial real estate loan?'],
    compare: ['PNC vs Chase vs Rocket Mortgage: which lender is better?', 'PNC vs Chase vs Rocket Mortgage for buying my first place after college?', 'PNC vs Chase vs Rocket Mortgage for a first condo with a small down payment?', 'PNC vs Chase vs Rocket Mortgage for a first-time buyer with 5% down?', 'PNC vs Chase vs Rocket Mortgage for a jumbo loan?', 'PNC vs Wells Fargo vs Chase for an SBA loan to buy my business’s building?'],
    txn: ['I want to get pre-approved for a mortgage online this week. Where do I start?', 'How do I get pre-qualified to see what I could afford after graduation?', 'I want to get pre-approved for my first condo. Which lender should I start with?', 'I want to get pre-approved online this week. Which lender should I start with, and what do I need?', 'I want to apply for a jumbo mortgage with a relationship discount. Where do I start?', 'I want to apply for an SBA loan to buy a building. What do I need, and which bank should I call?']
  },
  products: {
    default: {
      pnc: ['PNC Mortgage', 'PNC Community Loan (low down payment, no PMI for eligible buyers), the PNC Homebuyer Grant (up to $5,000 in eligible areas) and Home Insight tools to track your loan.', 'As little as 3% with Community Loan', 'Homebuyer Grant up to $5,000 (eligible areas)', 'Home Insight Planner and Tracker; local loan officers', 'you want grant help and a local loan officer'],
      chase: ['Chase Home Lending', 'The DreaMaker low-down-payment loan and a Homebuyer Grant in eligible areas.', 'As little as 3% with DreaMaker', 'Chase Homebuyer Grant (eligible areas)', 'Large branch footprint', 'you already bank with Chase'],
      rocket: ['Rocket Mortgage', 'A fast online process and many loan types.', '3% conventional, 3.5% FHA', 'Occasional closing credits', 'Speed; fully digital', 'speed matters most'],
      boa: ['Bank of America', 'Affordable Loan Solution and down payment grants in select markets.', 'As little as 3%', 'Down payment grant (select markets)', 'Relationship discounts', 'you have Preferred Rewards'],
      wf: ['Wells Fargo', 'Dream. Plan. Home. closing cost credit.', 'As little as 3%', 'Closing cost credit', 'Large footprint', 'you want a closing-cost credit']
    },
    smb: {
      pnc: ['PNC Business Lending', 'A Preferred SBA Lender offering SBA 7(a) and 504 loans and owner-occupied commercial real estate financing.', 'As little as 10% down with SBA 504', 'Business banker guidance', 'Preferred SBA Lender', 'you want an SBA lender with a local business banker'],
      wf: ['Wells Fargo', 'SBA and commercial real estate lending.', 'SBA 7(a) and 504', 'Online SBA application', 'Large footprint', 'you’re in Wells Fargo’s footprint'],
      chase: ['Chase for Business', 'Commercial real estate and SBA loans.', 'SBA and conventional CRE', 'Business banker', 'Large branch network', 'you already bank with Chase'],
      usbank: ['U.S. Bank', 'An active SBA lender with CRE loans.', 'SBA 7(a) and 504', 'SBA specialists', 'Strong in the Midwest', 'you’re in U.S. Bank’s footprint']
    }
  },
  pages: {
    default: { path: '/personal-banking/home-lending/mortgages', t: 'Mortgages & Home Loans | PNC', js: true },
    smb: { path: '/small-business/lending/sba-loans', t: 'SBA Loans | PNC' }
  },
  article: { path: '/insights/personal-finance/borrow/how-much-house-can-i-afford', t: 'How Much House Can I Afford?' },
  ppages: {
    student: { path: '/insights/college/build-credit-to-buy-a-home-someday', t: 'In College? Steps Now That Help You Buy a Home Later', line: 'PNC’s guide for students lists credit-building steps that help with a future mortgage.' },
    starter: { path: '/insights/first-job/saving-for-your-first-home', t: 'Saving for Your First Home on a First Salary', line: 'PNC’s first-job guide estimates how long it takes to save with a Growth account.' },
    fthb: { path: '/insights/home/first-time-homebuyer-guide', t: 'First-Time Homebuyer Guide: Grants, Down Payments and Steps', line: 'PNC’s first-time buyer guide explains how the Homebuyer Grant can combine with state assistance.' },
    ema: { path: '/insights/wealth/jumbo-loans-and-relationship-pricing', t: 'Jumbo Loans: Cash, Credit or Keep Investing?', line: 'PNC’s guide for high earners covers jumbo financing alongside PNC Investments.' },
    smb: { path: '/small-business/insights/buying-a-building-for-your-business', t: 'Buying a Building for Your Business: SBA 504 vs 7(a)', line: 'PNC’s small business guide compares SBA 504 and 7(a) for owner-occupied buildings.' }
  },
  points: {
    default: [['You may not need 20% down', 'Conventional loans can go as low as 3% for eligible first-time buyers, FHA 3.5%, and VA or USDA 0%. Less than 20% usually means mortgage insurance.'], ['Budget beyond the down payment', 'Plan for closing costs (often 2% to 5%), moving costs and a cushion after closing.'], ['Assistance programs', 'State housing agencies, cities and some lenders offer grants or forgivable loans, usually with income limits.']],
    smb: [['SBA 504 vs 7(a)', '504 loans finance owner-occupied real estate with as little as 10% down; 7(a) is more flexible but often costs more.'], ['Owner-occupancy rules', 'You typically need to occupy at least 51% of the building to qualify.'], ['What lenders look at', 'Two to three years of business tax returns, cash flow, and the property appraisal.']]
  },
  pp: {
    student: 'In college, the best prep is building credit and a savings habit. A mortgage comes later.',
    starter: 'On a first salary, focus on a 620+ credit score and a starter fund for a 3% to 5% down payment.',
    fthb: 'In Ohio, the Ohio Housing Finance Agency and some lender grants can stack to cover a big share of closing costs.',
    ema: 'With investments, compare a jumbo loan against pledging assets before paying cash.',
    smb: 'Owning your building can turn rent into equity, and SBA 504 keeps the down payment low.'
  },
  steps: { default: ['Gather two years of W-2s, recent pay stubs, two months of bank statements and IDs.', 'Apply online for pre-approval.', 'Upload documents and get a pre-approval letter (often 1 to 3 days).', 'Ask about grants and assistance before making an offer.'], smb: ['Gather three years of business and personal tax returns and interim financials.', 'Get the purchase agreement or property details.', 'Talk with an SBA lender about 504 vs 7(a).', 'Submit the application and appraisal.'] },
  pools: {
    default: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Mortgage Lenders for First-Time Home Buyers', type: 'affiliate', fmt: 'listicle', rel: .9, seo: .95, m: [['rocket', 'Best online experience'], ['chase', 'Best for grants'], ['boa', 'Best for low down payment'], ['pnc', 'Best for local loan officers']] },
      { id: 'br', dom: 'bankrate.com', t: 'Best Mortgage Lenders of 2026', type: 'affiliate', fmt: 'listicle', rel: .84, seo: .9, m: [['rocket', 'Best overall'], ['boa', 'Best for assistance'], ['wf', 'Best big bank']], boost: [2, 'Best for down payment grants'] },
      { id: 'jdp', dom: 'jdpower.com', t: 'U.S. Mortgage Origination Satisfaction Study', type: 'authority', fmt: 'review', rel: .72, seo: .7, m: [['rocket', 'Highest ranked'], ['chase', 'Above average'], ['pnc', 'Above average']] },
      { id: 'rd', dom: 'reddit.com', path: '/r/FirstTimeHomeBuyer', t: 'Lender recommendations? Big bank vs. broker', type: 'social', fmt: 'thread', rel: .74, seo: .78, m: [['rocket', '~', 9, 'Rocket was fast but our loan officer changed twice.'], ['chase', '+', 5, 'Chase gave us their grant.'], ['boa', '+', 4, 'BofA’s grant covered our closing costs.']], boost: ['+', 6, 'PNC gave us the Homebuyer Grant, $5k toward closing. Our loan officer was local and responsive.'] },
      { id: 'yt', dom: 'youtube.com', t: 'First-Time Home Buyer Grants Explained', type: 'social', fmt: 'video', rel: .64, seo: .72, m: [['boa', '+', 1, 'Bank of America has a down payment grant in some markets.'], ['chase', '+', 1, 'Chase has a homebuyer grant too.']], boost: ['+', 1, 'PNC’s Homebuyer Grant is up to $5,000 in eligible areas.'] },
      { id: 'cfpb', dom: 'consumerfinance.gov', t: 'How much do you need for a down payment?', type: 'authority', fmt: 'explainer', rel: .86, seo: .8, m: [] },
      { id: 'comp', dom: 'rocketmortgage.com', t: 'Get Approved Online', type: 'competitor', fmt: 'product', rel: .66, seo: .9, brand: 'rocket' }
    ],
    smb: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best SBA Lenders', type: 'affiliate', fmt: 'listicle', rel: .86, seo: .9, m: [['wf', 'Best for volume'], ['usbank', 'Best in the Midwest'], ['chase', 'Best big bank'], ['pnc', 'Best for 504 loans']] },
      { id: 'fa', dom: 'forbes.com', path: '/advisor', t: 'Best Commercial Real Estate Loans', type: 'affiliate', fmt: 'listicle', rel: .8, seo: .8, m: [['chase', 'Best overall'], ['wf', 'Best for SBA'], ['usbank', 'Best for small loans']], boost: [2, 'Best for owner-occupied buildings'] },
      { id: 'rd', dom: 'reddit.com', path: '/r/smallbusiness', t: 'SBA 504 to buy our building: who did you use?', type: 'social', fmt: 'thread', rel: .72, seo: .7, m: [['usbank', '+', 6, 'U.S. Bank did our 504, smooth.'], ['wf', '~', 4, 'Wells was slow.'], ['chase', '~', 3, 'Chase quoted us but we went elsewhere.']], boost: ['+', 5, 'PNC did our 504 and our business banker handled the CDC side.'] },
      { id: 'sba', dom: 'sba.gov', t: '504 loans', type: 'authority', fmt: 'explainer', rel: .86, seo: .85, m: [] },
      { id: 'comp', dom: 'wellsfargo.com', t: 'SBA Loans', type: 'competitor', fmt: 'product', rel: .64, seo: .82, brand: 'wf' }
    ]
  }
},

/* ====================== WEALTH MANAGEMENT ====================== */
wealth: {
  name: 'Wealth Management', short: 'Wealth', ic: 'chart',
  segOf: { smb: 'smb' },
  cat: { default: ['financial advisor', 'financial advisors'], smb: ['small business retirement plan', 'small business retirement plans'] },
  feeword: 'fees and minimums', localQ: 'PNC Investments advisor',
  trustQ: 'how to check a financial advisor FINRA BrokerCheck',
  cols: ['Minimum to start', 'How advice works', 'Standout'],
  schemaType: 'FinancialService',
  faqQ: ['Is there a minimum to work with an advisor?', 'How are PNC Investments advisors paid?'],
  compare: { default: ['pnc', 'fidelity', 'schwab'], smb: ['pnc', 'fidelity', 'chase'] },
  prompts: {
    info: ['When does it make sense to work with a financial advisor?', 'How should a college student start investing with a little money?', 'I just started my 401(k). Should I also open a Roth IRA or work with an advisor?', 'Should I keep investing or put everything toward my down payment?', 'I have about $180k saved and my income keeps growing. When should I hire a financial advisor?', 'What retirement plan options do small business owners have, like a SEP IRA or 401(k)?'],
    rec: ['What are the best banks or firms for financial advice?', 'What’s the best place for a college student to start investing?', 'What’s the best place to open a Roth IRA for a beginner?', 'Where’s the best place to keep my down payment savings and still earn something?', 'What’s the best bank for premium perks and wealth management in one place?', 'Which banks are best for small business owners who want a 401(k) for employees and personal wealth advice?'],
    compare: ['PNC Investments vs Fidelity vs Schwab for financial advice?', 'PNC Investments vs Fidelity vs Schwab for a student starting to invest?', 'PNC vs Fidelity vs Schwab for opening my first Roth IRA?', 'PNC vs Fidelity vs Schwab for parking my down payment savings?', 'PNC vs Fidelity vs Schwab for advice with about $180k invested?', 'PNC vs Fidelity vs Chase for a small business 401(k) and owner advice?'],
    txn: ['I want to schedule a meeting with a financial advisor this month. Who should I contact?', 'How do I open my first investment account today?', 'I want to open a Roth IRA today. Where should I do it?', 'Where should I open an account for my down payment savings today?', 'I want to meet with a financial advisor at a bank near me in Philadelphia this month. Who should I contact?', 'I want to set up a 401(k) for my 14 employees. Who should I talk to?']
  },
  products: {
    default: {
      pnc: ['PNC Investments', 'Advisors in PNC branches, connected to your PNC banking, with a path to PNC Private Bank as assets grow.', 'Varies by service', 'Advisor-led planning in branch or virtual', 'Connected to your PNC banking and lending', 'you want advice connected to your bank relationship'],
      fidelity: ['Fidelity', 'Low-cost investing with hybrid advisory options.', '$0 for self-directed', 'Robo, hybrid or advisor', 'Low costs', 'you want low-cost investing'],
      schwab: ['Charles Schwab', 'Robo portfolios with access to certified planners.', '$0 self-directed; varies for advice', 'Robo plus planners', 'Planning access', 'you want robo plus a planner'],
      boa: ['Merrill (Bank of America)', 'Merrill advisors integrated with Preferred Rewards.', 'Varies', 'Advisor-led', 'Preferred Rewards tie-in', 'you bank with Bank of America'],
      chase: ['J.P. Morgan Wealth Management', 'Advisors in Chase branches plus self-directed investing.', '$0 self-directed', 'Advisor-led or digital', 'Chase branch access', 'you bank with Chase']
    },
    smb: {
      pnc: ['PNC for business owners', 'Employee retirement plans, business banking and personal wealth advice in one relationship, with PNC Private Bank as you grow.', 'Varies by plan size', 'Business banker plus wealth advisor', 'One relationship for business and personal wealth', 'you want business and personal finances coordinated'],
      fidelity: ['Fidelity Small Business 401(k)', 'A well-known 401(k) provider with low-cost options.', 'Varies', 'Plan specialists', 'Recordkeeping scale', 'you want a standalone 401(k)'],
      chase: ['J.P. Morgan for business owners', 'Business banking with J.P. Morgan advisors.', 'Varies', 'Advisor-led', 'Chase business tie-in', 'you bank with Chase'],
      schwab: ['Schwab', 'SEP IRA and solo 401(k) accounts for owners.', '$0', 'Self-directed or advisor', 'Low-cost SEP IRA', 'you want a simple SEP IRA']
    }
  },
  pages: {
    default: { path: '/personal-banking/investments', t: 'PNC Investments | Financial Advice' },
    smb: { path: '/small-business/retirement-plans', t: 'Retirement Plans for Business Owners | PNC', js: true }
  },
  article: { path: '/insights/personal-finance/invest/do-you-need-a-financial-advisor', t: 'Do You Need a Financial Advisor?' },
  ppages: {
    student: { path: '/insights/college/investing-basics-for-students', t: 'Investing Basics for College Students', line: 'PNC’s student guide explains starting with small automatic contributions.' },
    starter: { path: '/insights/first-job/401k-vs-roth-ira-first-job', t: '401(k) vs Roth IRA at Your First Job', line: 'PNC’s first-job guide explains the order of operations: employer match, emergency fund, then a Roth IRA.' },
    fthb: { path: '/insights/home/invest-or-save-for-down-payment', t: 'Invest or Save for a Down Payment?', line: 'PNC’s home-saver guide compares savings and short-term options for a down payment fund.' },
    ema: { path: '/insights/wealth/when-to-hire-a-financial-advisor', t: 'When to Hire a Financial Advisor: Thresholds and Triggers', line: 'PNC’s guide for growing wealth covers RSUs, tax planning and when advice pays for itself.' },
    smb: { path: '/small-business/insights/retirement-plans-for-small-business', t: 'Retirement Plans for Small Business Owners', line: 'PNC’s small business guide compares SEP IRA, SIMPLE IRA and 401(k) for teams of 10 to 25.' }
  },
  points: {
    default: [['When advice helps', 'Common triggers are equity compensation, a big tax bill, competing goals or a major life event. Many people consider advice at $100k to $250k invested.'], ['How advisors are paid', 'Fee-only advisors charge a flat or percent-of-assets fee; commission-based advisors are paid on products. Ask whether they act as a fiduciary.'], ['Check credentials', 'Look up any advisor on FINRA BrokerCheck or the SEC’s adviser search.']],
    smb: [['Plan options', 'SEP IRAs are simple, SIMPLE IRAs suit small teams, and a 401(k) offers the highest limits and most flexibility.'], ['Cost and admin', 'A 401(k) has more admin but tax credits can offset startup costs for small employers.'], ['Owner planning', 'Pair the company plan with personal planning for taxes and an eventual exit.']]
  },
  pp: {
    student: 'As a student, starting with small automatic investments matters more than picking the perfect fund.',
    starter: 'At a first job, capture the full 401(k) match first, then consider a Roth IRA.',
    fthb: 'Money you need within a year or two usually belongs in savings, not stocks.',
    ema: 'With equity compensation and a growing balance, advice on taxes and RSU timing can pay for itself.',
    smb: 'With 14 employees, a 401(k) can help retention and startup tax credits can offset costs.'
  },
  steps: { default: ['Shortlist two or three advisors and look each up on FINRA BrokerCheck.', 'Book online or call. Most firms offer intro meetings within a week.', 'Bring recent statements, your equity comp details and your top three goals.', 'Ask how they’re paid and whether they act as a fiduciary.'], smb: ['Decide between SEP IRA, SIMPLE IRA and 401(k).', 'Gather employee census data and payroll details.', 'Meet with a provider to compare fees and services.', 'Set up payroll integration and enroll employees.'] },
  pools: {
    default: [
      { id: 'inv', dom: 'investopedia.com', t: 'When Should You Hire a Financial Advisor?', type: 'affiliate', fmt: 'explainer', rel: .88, seo: .92, m: [['fidelity', 'Example: hybrid advice'], ['schwab', 'Example: robo plus planner']] },
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Financial Advisors and Wealth Management Firms', type: 'affiliate', fmt: 'listicle', rel: .84, seo: .88, m: [['fidelity', 'Best overall'], ['schwab', 'Best for planning'], ['boa', 'Best for bank integration'], ['chase', 'Best for branch access']], boost: [3, 'Best for banking and advice in one place'] },
      { id: 'rd', dom: 'reddit.com', path: '/r/financialindependence', t: 'At what net worth did you hire an advisor?', type: 'social', fmt: 'thread', rel: .72, seo: .74, m: [['fidelity', '+', 10, 'Fidelity’s planners are solid and cheap.'], ['schwab', '+', 8, 'Schwab Intelligent Portfolios Premium was worth it.'], ['boa', '~', 3, 'Merrill pushed products on me.']], boost: ['+', 4, 'A PNC advisor helped with RSUs and our mortgage at the same time. Being under one roof helped.'] },
      { id: 'yt', dom: 'youtube.com', t: 'Do You Need a Financial Advisor? (Fee-Only vs Bank)', type: 'social', fmt: 'video', rel: .62, seo: .7, m: [['fidelity', '+', 1, 'Fidelity is great for low cost.'], ['schwab', '+', 1, 'Schwab if you want a planner.']], boost: ['+', 1, 'Bank advisors like PNC can make sense if you want banking and investing together.'] },
      { id: 'finra', dom: 'finra.org', t: 'Choosing an investment professional', type: 'authority', fmt: 'explainer', rel: .82, seo: .8, m: [] },
      { id: 'comp', dom: 'schwab.com', t: 'Schwab Wealth Advisory', type: 'competitor', fmt: 'product', rel: .6, seo: .85, brand: 'schwab' }
    ],
    smb: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best 401(k) Providers for Small Businesses', type: 'affiliate', fmt: 'listicle', rel: .86, seo: .9, m: [['fidelity', 'Best overall'], ['schwab', 'Best low cost'], ['chase', 'Best for banking tie-in']], boost: [2, 'Best for owners who want a banker and advisor'] },
      { id: 'fa', dom: 'forbes.com', path: '/advisor', t: 'Best SEP IRA and Solo 401(k) Providers', type: 'affiliate', fmt: 'listicle', rel: .78, seo: .8, m: [['fidelity', 'Best overall'], ['schwab', 'Best for SEP IRA']] },
      { id: 'rd', dom: 'reddit.com', path: '/r/smallbusiness', t: 'Setting up a 401k for 14 employees, who did you use?', type: 'social', fmt: 'thread', rel: .72, seo: .7, m: [['fidelity', '+', 6, 'Fidelity, easy payroll sync.'], ['schwab', '~', 3, 'Schwab works for SEP but not 401k for us.']], boost: ['+', 4, 'Our PNC business banker set up the 401(k) and connected me with a wealth advisor for my own planning.'] },
      { id: 'dol', dom: 'dol.gov', t: 'Choosing a retirement plan for your small business', type: 'authority', fmt: 'explainer', rel: .84, seo: .82, m: [] },
      { id: 'comp', dom: 'fidelity.com', t: 'Small Business Retirement Plans', type: 'competitor', fmt: 'product', rel: .62, seo: .85, brand: 'fidelity' }
    ]
  }
},

/* ====================== CREDIT CARDS ====================== */
cards: {
  name: 'Credit Cards', short: 'Credit cards', ic: 'card',
  segOf: { student: 'student', starter: 'student', smb: 'smb' },
  cat: { default: ['cash back credit card', 'cash back credit cards'], student: ['starter credit card', 'starter credit cards'], smb: ['business credit card', 'business credit cards'] },
  feeword: 'rewards and fees', localQ: 'PNC branch',
  trustQ: 'how credit cards affect your credit score CFPB',
  cols: ['Rewards', 'Annual fee & intro offer', 'Standout'],
  schemaType: 'CreditCard',
  faqQ: ['What rewards does this card earn?', 'Is there an annual fee?'],
  compare: { default: ['pnc', 'citi', 'wf'], student: ['pnc', 'discover', 'capone'], smb: ['pnc', 'chase', 'amex'] },
  prompts: {
    info: ['How do cash back credit cards work, and how do I pick one?', 'How should a college student use a credit card to build credit?', 'How do I build credit with my first credit card without getting into debt?', 'Will opening a new credit card hurt my chances of getting a mortgage?', 'Are premium travel credit cards worth the annual fee?', 'Should I get a business credit card, and how does it affect my personal credit?'],
    rec: ['What’s the best cash back credit card right now?', 'What’s the best credit card for a college student with no credit history?', 'What’s the best first credit card to build credit after college?', 'What’s a good no-annual-fee card I can open without hurting my mortgage application?', 'What’s the best rewards credit card for a high spender?', 'What’s the best business credit card for a small business?'],
    compare: ['PNC Cash Unlimited vs Citi Double Cash vs Wells Fargo Active Cash: which 2% card is best?', 'PNC Cash Rewards vs Discover it Student vs Capital One for a student’s first card?', 'PNC Cash Rewards Visa vs Discover it vs Capital One Quicksilver for my first card?', 'PNC Cash Unlimited vs Citi Double Cash vs Wells Fargo Active Cash if I’m buying a house soon?', 'PNC Cash Unlimited vs Citi Double Cash vs Wells Fargo Active Cash for big monthly spending?', 'PNC business card vs Chase Ink Business Unlimited vs Amex Blue Business Cash?'],
    txn: ['I want to apply for a no-annual-fee 2% cash back card today. Where should I apply?', 'How do I apply for my first credit card as a student?', 'I want to apply for my first credit card today. Which one and how?', 'I want a no-annual-fee card but don’t want to hurt my mortgage pre-approval. Should I apply now?', 'I want to apply for a cash back card that pairs with my bank. Where should I apply?', 'I want to apply for a business credit card for my company today. What do I need?']
  },
  products: {
    default: {
      pnc: ['PNC Cash Unlimited Visa Signature', 'Unlimited 2% cash back with no annual fee, and it works smoothly with PNC Virtual Wallet.', 'Unlimited 2% cash back', 'No annual fee; see pnc.com for current offer', 'Pairs with Virtual Wallet', 'you already bank with PNC'],
      citi: ['Citi Double Cash', 'Up to 2% back: 1% when you buy and 1% when you pay.', 'Up to 2%', 'No annual fee; balance transfer intro APR', 'Converts to ThankYou points', 'you want a balance transfer or points'],
      wf: ['Wells Fargo Active Cash', 'Unlimited 2% cash rewards and a cash welcome bonus.', 'Unlimited 2%', 'No annual fee; welcome bonus and intro APR', 'Cell phone protection', 'you want a welcome bonus'],
      capone: ['Capital One Quicksilver', 'Unlimited 1.5% cash back and no annual fee.', '1.5%', 'No annual fee', 'No foreign transaction fees', 'you travel abroad'],
      chase: ['Chase Freedom Unlimited', '1.5% base plus bonus categories.', '1.5% plus categories', 'No annual fee', 'Pairs with Sapphire', 'you’re in the Chase ecosystem']
    },
    student: {
      pnc: ['PNC Cash Rewards Visa', 'Cash back on gas, dining and groceries with no annual fee. Applying as a PNC customer can help.', 'Category cash back', 'No annual fee', 'Works with PNC Virtual Wallet', 'you already bank with PNC'],
      discover: ['Discover it Student', 'No annual fee, cash back and a first-year cashback match.', 'Rotating 5% plus 1%', 'No annual fee; cashback match', 'Built for thin credit files', 'you have no credit history'],
      capone: ['Capital One Quicksilver', 'Flat cash back and prequalification without a hard pull.', '1.5%', 'No annual fee', 'Prequalify with no hard pull', 'you want to check approval odds first'],
      chase: ['Chase Freedom Rise', 'Built for people new to credit.', '1.5%', 'No annual fee', 'Easier approval with Chase checking', 'you already bank with Chase']
    },
    smb: {
      pnc: ['PNC Cash Rewards Visa Signature Business', 'Cash back on gas, dining and office supplies, with employee cards and controls in PNC business online banking.', 'Category cash back', 'No annual fee', 'Integrated with PNC business banking', 'you bank your business with PNC'],
      chase: ['Chase Ink Business Unlimited', 'Unlimited 1.5% cash back and a large welcome bonus.', '1.5%', 'No annual fee; large bonus', 'Pairs with Ink Preferred', 'you want a large welcome bonus'],
      amex: ['American Express Blue Business Cash', '2% cash back on the first $50k a year.', '2% up to $50k/yr', 'No annual fee', 'Expanded buying power', 'you spend under $50k a year'],
      capone: ['Capital One Spark Cash Plus', 'Unlimited 2% cash back for higher spend.', '2%', 'Annual fee', 'No preset spending limit', 'you spend heavily']
    }
  },
  pages: {
    default: { path: '/personal-banking/banking/credit-cards/cash-unlimited', t: 'PNC Cash Unlimited® Visa Signature®', js: true },
    student: { path: '/personal-banking/banking/credit-cards/cash-rewards', t: 'PNC Cash Rewards® Visa®', js: true },
    smb: { path: '/small-business/credit-cards', t: 'Business Credit Cards | PNC' }
  },
  article: { path: '/insights/personal-finance/borrow/how-cash-back-cards-work', t: 'How Do Cash Back Credit Cards Work?' },
  ppages: {
    student: { path: '/insights/college/first-credit-card-for-students', t: 'Your First Credit Card in College: A Safe Start', line: 'PNC’s student guide explains autopay and keeping utilization low.' },
    starter: { path: '/insights/first-job/build-credit-first-card', t: 'Build Credit With Your First Card After College', line: 'PNC’s first-job guide covers building credit without carrying a balance.' },
    fthb: { path: '/insights/home/credit-cards-before-a-mortgage', t: 'Should You Open a Credit Card Before a Mortgage?', line: 'PNC’s home-buyer guide explains why to wait on new cards until after closing.' },
    ema: { path: '/insights/wealth/maximize-card-rewards', t: 'Getting the Most From Card Rewards at Higher Spend', line: 'PNC’s guide for high spenders compares flat-rate and category cards.' },
    smb: { path: '/small-business/insights/business-credit-card-guide', t: 'Business Credit Cards: Employee Cards, Controls and Credit', line: 'PNC’s small business guide explains employee card controls and how business cards report to credit bureaus.' }
  },
  points: {
    default: [['How cash back works', 'You earn a percentage of each purchase back: flat-rate cards pay the same on everything, category cards pay more on gas, dining or groceries.'], ['Avoid interest', 'Rewards are only worth it if you pay the full balance. Interest wipes out cash back fast.'], ['Pick by spending', 'Flat 2% suits most people. Category cards win if you spend heavily in a few areas.']],
    smb: [['Separate expenses', 'A business card keeps spending separate for bookkeeping and taxes.'], ['Personal credit', 'Most small business cards require a personal guarantee; some report only negative activity to personal bureaus.'], ['Employee cards', 'Look for free employee cards with spending limits and controls.']]
  },
  pp: {
    student: 'As a student, a no-annual-fee card with autopay for the full balance is the safest way to build credit.',
    starter: 'With a thin file, approval odds and no annual fee matter more than rewards.',
    fthb: 'Before a mortgage, avoid new credit inquiries until after closing if you can.',
    ema: 'At high spend, a premium card’s perks can outweigh the fee, but flat 2% is hard to beat for simplicity.',
    smb: 'With 14 employees, free employee cards and spending controls matter as much as the cash back.'
  },
  steps: { default: ['Check prequalification (a soft pull won’t affect your score).', 'Have your income, housing payment and SSN ready.', 'Apply online; decisions are often instant.', 'Set up autopay for the full statement balance.'], smb: ['Have your EIN, business revenue and owner SSN ready.', 'Decide how many employee cards and limits you need.', 'Apply online or with your business banker.', 'Connect the card to your accounting software.'] },
  pools: {
    default: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Cash Back Credit Cards of 2026', type: 'affiliate', fmt: 'listicle', rel: .9, seo: .95, m: [['wf', 'Best flat-rate'], ['citi', 'Best for balance transfers'], ['chase', 'Best for categories'], ['capone', 'Best for travel']], boost: [3, 'Best for PNC banking customers'] },
      { id: 'tpg', dom: 'thepointsguy.com', t: 'Best 2% Cash Back Cards', type: 'affiliate', fmt: 'listicle', rel: .8, seo: .82, m: [['citi', 'Best overall'], ['wf', 'Best welcome bonus']], boost: [3, 'Best for bank relationship'] },
      { id: 'br', dom: 'bankrate.com', t: 'PNC Cash Unlimited review', type: 'affiliate', fmt: 'review', rel: .7, seo: .62, m: [['pnc', 'Review: 4.0/5']] },
      { id: 'rd', dom: 'reddit.com', path: '/r/CreditCards', t: 'Active Cash or Double Cash? Is the PNC one any good?', type: 'social', fmt: 'thread', rel: .7, seo: .75, m: [['citi', '+', 9, 'Double Cash forever.'], ['wf', '+', 8, 'Active Cash, simpler and there’s a bonus.'], ['pnc', '~', 2, 'PNC’s is fine if you bank there.']], boost: ['+', 5, 'PNC Cash Unlimited: 2% and it shows right in Virtual Wallet. Simple.'] },
      { id: 'yt', dom: 'youtube.com', t: 'The ONLY 2% Card You Need', type: 'social', fmt: 'video', rel: .62, seo: .7, m: [['wf', '+', 1, 'Active Cash is my pick.'], ['citi', '+', 1, 'Double Cash if you want points.']], boost: ['+', 1, 'If you bank with PNC, Cash Unlimited is the easy 2% choice.'] },
      { id: 'cfpb', dom: 'consumerfinance.gov', t: 'Credit card basics', type: 'authority', fmt: 'explainer', rel: .66, seo: .72, m: [] },
      { id: 'comp', dom: 'wellsfargo.com', t: 'Active Cash® Card', type: 'competitor', fmt: 'product', rel: .7, seo: .88, brand: 'wf' }
    ],
    student: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Credit Cards to Build Credit', type: 'affiliate', fmt: 'listicle', rel: .92, seo: .95, m: [['discover', 'Best overall'], ['capone', 'Best flat-rate'], ['chase', 'Best for Chase customers']], boost: [4, 'Best for PNC customers'] },
      { id: 'cs', dom: 'cnbc.com', path: '/select', t: 'Best credit cards for no credit', type: 'affiliate', fmt: 'listicle', rel: .8, seo: .82, m: [['discover', 'Best overall'], ['capone', 'Best for prequalification']] },
      { id: 'rd', dom: 'reddit.com', path: '/r/CreditCards', t: 'What should be my first card? (2026 megathread)', type: 'social', fmt: 'thread', rel: .84, seo: .82, m: [['discover', '+', 16, 'Discover it Student, the classic first card.'], ['capone', '+', 11, 'Quicksilver, prequalify first.'], ['chase', '+', 6, 'Freedom Rise if you bank with Chase.']], boost: ['+', 5, 'Got my first card at PNC since I already had Virtual Wallet. Approved with a thin file.'] },
      { id: 'tk', dom: 'tiktok.com', t: 'First Credit Card Tips Nobody Tells You', type: 'social', fmt: 'video', rel: .52, seo: .4, m: [['discover', '+', 1, 'Discover’s student card is easy to get.']], boost: ['+', 1, 'Your own bank, like PNC, is often the easiest first approval.'] },
      { id: 'cfpb', dom: 'consumerfinance.gov', t: 'How do I get and keep a good credit score?', type: 'authority', fmt: 'explainer', rel: .7, seo: .75, m: [] },
      { id: 'comp', dom: 'capitalone.com', t: 'Quicksilver: See if you’re pre-approved', type: 'competitor', fmt: 'product', rel: .62, seo: .85, brand: 'capone' }
    ],
    smb: [
      { id: 'nw', dom: 'nerdwallet.com', t: 'Best Business Credit Cards of 2026', type: 'affiliate', fmt: 'listicle', rel: .9, seo: .95, m: [['chase', 'Best overall'], ['amex', 'Best flat-rate'], ['capone', 'Best for high spend']], boost: [4, 'Best for business banking integration'] },
      { id: 'tpg', dom: 'thepointsguy.com', t: 'Best Cash Back Business Cards', type: 'affiliate', fmt: 'listicle', rel: .8, seo: .82, m: [['amex', 'Best overall'], ['chase', 'Best bonus'], ['capone', 'Best uncapped']] },
      { id: 'rd', dom: 'reddit.com', path: '/r/smallbusiness', t: 'Best business card for a service company?', type: 'social', fmt: 'thread', rel: .72, seo: .72, m: [['amex', '+', 7, 'Amex Blue Business Cash, 2% on everything.'], ['chase', '+', 6, 'Ink Unlimited plus Ink Preferred combo.'], ['capone', '~', 3, 'Spark is good but has a fee.']], boost: ['+', 4, 'PNC’s business card shows up in the same dashboard as our checking. Employee limits are easy.'] },
      { id: 'sba', dom: 'sba.gov', t: 'Business credit basics', type: 'authority', fmt: 'explainer', rel: .7, seo: .75, m: [] },
      { id: 'comp', dom: 'chase.com', t: 'Ink Business Unlimited®', type: 'competitor', fmt: 'product', rel: .66, seo: .88, brand: 'chase' }
    ]
  }
}
};

/* ---------- AEO levers (what-if toggles) ---------- */
const LEVERS = {
  schema:  { n: 'Page-level schema', on: 'With schema', off: 'Without schema', d: 'JSON-LD on pnc.com product and guide pages (FinancialProduct, FAQPage, audience, dateModified).' },
  persona: { n: 'Persona-targeted content', on: 'Persona pages live', off: 'General SEO article only', d: 'A pnc.com guide written for this persona’s situation, alongside the general SEO article.' },
  third:   { n: 'Third-party & social presence', on: 'After outreach', off: 'Current coverage', d: 'PNC placements on affiliate roundups and authentic participation in Reddit and YouTube communities.' }
};

/* ---------- Pipeline ---------- */
const PIPELINE = [
  { k: 'understand', n: 'Understand', d: 'Parse the prompt, apply memory, and infer the implied intent behind the words.' },
  { k: 'fanout', n: 'Fan out', d: 'Rewrite one prompt into many sub-queries: definitions, comparisons, persona, local, fresh and entity.' },
  { k: 'retrieve', n: 'Retrieve', d: 'Hit a search index and fetch candidate pages. Pages it can’t read drop out, unless structured data survives.' },
  { k: 'rank', n: 'Rank', d: 'Score passages for relevance, authority, audience match, organic strength and intent fit, then keep the top few.' },
  { k: 'extract', n: 'Extract', d: 'Read the kept pages for entities: which brands each affiliate list, thread and video mentions, and what PNC’s schema states.' },
  { k: 'synth', n: 'Synthesize', d: 'Weigh first-party, affiliate, social and memory evidence per brand and decide who earns a mention.' },
  { k: 'render', n: 'Render & cite', d: 'Pick an answer shape for the intent and attach citations.' }
];
