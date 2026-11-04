# PNC AEO Lab

An internal, interactive tool that shows **how ChatGPT, Gemini, Claude and Copilot find and deliver information** when a customer prompts them, and what that means for PNC’s **Answer Engine Optimization (AEO)** strategy.

Open `index.html` in a browser (or share the single-file build in `dist/pnc-aeo-lab.html`). No server or install needed.

## What’s in it

1. **Prompt simulator**: choose a **model**, **persona** and **intent**, then run the prompt.
   - **Left, what the customer sees:** a chat window styled for each model, with its own citation style. The answer streams in.
   - **Right, what the model does:** a six-step pipeline (Understand → Fan out → Retrieve → Rank & filter → Synthesize → Render & cite) with a live retrieval log and an **AEO lever** at every step.
   - **Scorecard:** whether PNC was named and at what position, pnc.com citations, mention rate across 20 sampled runs, citation mix by source type, and AEO actions for that journey.
   - **Run again** re-samples the same settings to show run-to-run variability.
2. **Variability**: a persona × intent heatmap of PNC mention rate for each model, plus a four-model comparison with the result of each of the 20 runs.
3. **How it works**: the six retrieval steps and a profile of each model (index, crawlers, fan-out breadth, reliance on memory, JavaScript rendering, answer style).
4. **Playbook**: the four levers (Content, Technical, Off-site, Measurement) and the KPIs to track.

### Selectors
| Model | Persona | Intent |
|---|---|---|
| ChatGPT, Gemini, Claude, Copilot | General / none specified, College Student, The Starter, First-Time Home Buyer, Emerging Mass Affluent | Information gathering, Looking for recommendations, Comparing options, Purchase / transactional |

That gives 80 journeys, each with a PNC-specific prompt, fan-out queries, a candidate source set (pnc.com pages, publishers, .gov, Reddit/YouTube, competitors) and AEO recommendations.

## How the simulation works

`assets/engine.js` is a deliberately simple, explainable model. Nothing calls a live LLM.

- **Fan-out:** each model generates a different number and mix of sub-queries (for example, Gemini adds local queries from persona memory).
- **Retrieval:** each source is scored as `relevance × model preference for the source type × intent-format fit`, with seeded noise. Pages rendered with JavaScript are dropped for models whose fetchers don’t render them. Stale pages are down-weighted, more heavily for freshness-sensitive models and transactional intent.
- **Synthesis:** a brand is named if `evidence from cited sources + training-memory prior` clears a threshold. Brands named in the prompt are always addressed.
- **Variability:** the same settings with a new seed produce a different sample, and mention rates come from 20 samples.

Edit `assets/data.js` to change prompts, sources, PNC pages, model profiles or recommendations. The UI picks up changes automatically.

## Files
```
index.html          page markup
assets/styles.css   PNC-branded styles
assets/data.js      models, personas, intents, 20 scenarios, source sets, AEO actions
assets/engine.js    retrieval simulation
assets/app.js       UI: dropdowns, split view, streaming, pipeline, charts
assets/logos.js     PNC logo and model marks
tools/build.js      bundles everything into dist/pnc-aeo-lab.html
```

## Caveats
- **Simulated and illustrative.** Model behaviors are simplified from public documentation and commonly observed patterns, and they change often.
- PNC product details are for illustration and **must be validated with Product, Legal and Compliance** before external use.
- Model logos come from `@lobehub/icons` (MIT). All trademarks belong to their owners and are used for identification only.
