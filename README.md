# PNC AEO Lab

**Version 3.4** (November 2026)

**Built in-house by PNC’s Digital Organic Growth Team · SEO | AEO | Organic Content**

An internal, interactive tool that shows **how ChatGPT, Gemini, Claude and Copilot find and deliver information** when a customer prompts them, and what that means for PNC’s **Answer Engine Optimization (AEO)** strategy.

Open `index.html` in a browser (or share the single-file build in `dist/pnc-aeo-lab.html`). No server or install needed.

## What’s in it

1. **Prompt simulator**: choose **Model × Topic × Persona × Intent**, set the **AEO levers**, and run.
   - **Left:** what the customer sees. There's a chat skin for each model, and AI Overviews renders as a Google results page, with the Overview above the organic results so the SEO link is visible.
   - **Right:** a seven-step pipeline (Understand → Fan out → Retrieve → Rank → Extract → Synthesize → Render). It shows persona sub-queries, the JSON-LD the model parsed, audience matches, a brand-extraction matrix across affiliate and social pages, and evidence split into first-party, affiliate, social and memory.
   - **Peek:** click any source to see what the model read: affiliate list positions, Reddit comments and YouTube transcript lines with sentiment, or a pnc.com page with its JSON-LD (or the empty shell a non-rendering bot gets).
   - **Scorecard:** whether PNC was named and at what position, PNC pages cited and where its facts came from, the 20-run mention rate, PNC's evidence mix, lever impact in points, and AEO actions.
   - **Speed:** 0.5×, 1×, 2×, Fast, or **Step by step**, which pauses after each retrieval step until you click *Next step* (or press →).
2. **Presentation mode** (top bar or hero): a large, guided flow for a group. Pick a model, topic, persona and intent one screen at a time, run the prompt, then click *How did (model) arrive at this answer?* The card flips to a one-step-at-a-time retrieval walkthrough. Each step has its own lever panel showing what that lever changes at that step (e.g. "PNC pages readable: 2 of 3 → 3 of 3").
3. **VS mode:** pick a shared topic and intent, then two sides, each with its own model, persona and AEO lever settings. Quick presets set up persona vs persona, model vs model, or one lever off vs on with everything else held constant. Both answers run side by side, with a "Behind the answer" summary for each and a "What changed" panel (PNC outcome, mention rate, queries, sources and brands unique to each side).
4. **Schema lab**: one pnc.com page shown three ways (what the customer sees, the raw HTML, and the JSON-LD), plus a fact-extraction matrix for each model, before and after the schema rollout.
5. **Variability**: a persona × intent heatmap for each model and topic, and a five-model comparison showing current vs. potential (all levers on).
6. **How it works**: the seven steps, plus model profiles (SEO, affiliate, social and schema weights; memory; JavaScript rendering).
7. **Playbook**: Schema, Persona content, Affiliates & social, SEO & measurement.

### Selectors
| Model | Topic | Persona | Intent |
|---|---|---|---|
| ChatGPT, Gemini, AI Overviews, Claude, Copilot | Checking Accounts, Online Banking, Mortgage Loans, Wealth Management, Credit Cards | General, College Student, The Starter, First-Time Home Buyer, Emerging Mass Affluent, Small Business Owner | Information gathering, Recommendations, Comparing options, Purchase / transactional |

### AEO levers (what-if)
- **Page-level schema:** before vs. after rollout. JSON-LD lifts PNC pages (most for AI Overviews, Gemini and Copilot) and rescues JavaScript-rendered pages for bots that don't render JavaScript.
- **Persona-targeted content:** a general SEO article only vs. adding a persona guide. The guide matches the persona sub-queries the model fans out and wins on audience match.
- **Third-party & social presence:** current coverage vs. after outreach. Adds PNC to affiliate lists and community threads. ChatGPT weights this most and Claude least.

## How the simulation works

`assets/engine.js` builds each journey from the building blocks in `assets/data.js` and scores it:
- **Source score** = relevance × the model's weight for the source type × fit with the intent's answer format × organic strength (AI Overviews depends on organic ranking entirely) × audience match × schema lift, plus seeded noise.
- **Brand evidence** = first-party pages + affiliate list mentions (weighted by position) + social mentions (weighted by sentiment and count) + training memory. A brand is named if it clears an absolute bar and stays competitive with the leader.
- **Lever impact** reruns the same 20 seeds with one lever flipped.

## Files
```
index.html          page markup
assets/styles.css   PNC-branded styles
assets/data.js      team, models, personas, intents, 5 topics (products, prompts, sources with brand mentions, persona pages)
assets/engine.js    retrieval simulation
assets/app.js       UI: dropdowns, split view, streaming, pipeline, charts
assets/logos.js     PNC logo and model marks
assets/avatars.js   persona avatars (DiceBear Avataaars)
assets/favicons.js  site icons (simple-icons / iconify logos) + brand-colored fallbacks
tools/build.js      bundles everything into dist/pnc-aeo-lab.html
tools/fetch-favicons.js  re-downloads and embeds source-site favicons
```

## Accessibility
Text in the demo modes and the main page is checked against WCAG AA contrast (4.5:1, or 3:1 for large text). Buttons and highlights intentionally keep the PNC brand orange `#EF6A00` (white text on it is 3.1:1, an accepted exception).

## Hosting
The page carries `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">` so search engines and AI crawlers that honor it won't index or cite it. Don't also block the page in robots.txt: crawlers that can't fetch the page never see the noindex tag. noindex is not access control, so put the page behind a login if it must stay private.

## Caveats
- **Simulated and illustrative.** Model behaviors are simplified from public documentation and commonly observed patterns, and they change often.
- PNC product details are for illustration and **must be validated with Product, Legal and Compliance** before external use.
- Model logos come from `@lobehub/icons` (MIT). Persona avatars were generated with DiceBear's *Avataaars* style (design by Pablo Stanley, free for personal and commercial use). Site icons come from simple-icons and @iconify-json/logos (CC0). Each source site's real favicon is embedded in `assets/favicons.js` (fetched by `tools/fetch-favicons.js` from Google's and DuckDuckGo's favicon services), so they show offline. To refresh them, run `node tools/fetch-favicons.js && node tools/build.js` on a machine with internet access. Sites not yet embedded fall back to a brand-colored tile and try to load their favicon live. All trademarks belong to their owners and are used for identification only.
