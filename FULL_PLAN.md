# Open Indus Lab — Full Project Plan
**Version 1.0 | June 2026**

---

## What We Are Building

An open, local-first research platform that lets scholars test competing theories about the Indus-Harappan script using reproducible data, rule engines, and peer review workflows.

**Positioning**: "An open computational framework for testing and comparing Indus script decipherment hypotheses." We do not claim to have decoded the script.

**Primary input**: The research of Ponmuthu Shanmugham — 4 books, 1 draft paper, 1 99-page Research Keys report, 400+ seal readings, 241 phoneme mappings.

---

## Where We Are Now

| Stage | Name | Status |
|---|---|---|
| Stage 1 | Data Model | ✅ Done — PostgreSQL schema, 12 tables |
| Stage 2 | Corpus Loader | ✅ Done — 14 CSVs, 2000+ rows, GitHub live |
| Stage 3 | Rule Engine | 🔲 Next |
| Stage 4 | Research Dashboard | 🔲 Planned |
| Stage 5 | Statistical Validation | 🔲 Planned |
| Stage 6 | Knowledge Graph | 🔲 Planned |
| Stage 7 | Peer Review Loop | 🔲 Planned |
| Stage 8 | Publication Strategy | 🔲 Planned |

---

## Stage 2 — Completion Task (Before Stage 3)

One item left: the **database loader** — a Python script that reads the 14 CSVs and imports them into the live PostgreSQL database.

### Files to Build
- `backend/scripts/import_csv.py` — reads all seed CSVs, inserts into DB
- `backend/scripts/validate_db.py` — counts rows, checks foreign keys, prints report
- Fix: add `rmrl_number` cross-reference column to seals table

### Time: 1 session

---

## Stage 3 — Rule Engine

**Goal**: Given a seal's sign sequence, apply the VPS2024 rule set deterministically and produce a candidate Tamil reading with a confidence score.

### What It Does
```
Input:  Seal 1076 → signs [tally-4, Y-sign, Y-sign]
Rules:  tally_phoneme(4) → "na" + sign_phoneme(162) → "y"
Output: phoneme_string = "na y na y" → "ney ney" → "thava ney"
        proposed_meaning = "very good ghee"
        confidence = 0.72
        rules_applied = ["tally-4-na", "y-sign-ney", "ditto-mark-repeat"]
```

### Files to Build
```
backend/app/
  engine/
    rule_engine.py       ← core engine class
    rules/
      sign_phoneme.py    ← sign → phoneme lookup
      tally_phoneme.py   ← tally count → phoneme
      modifier.py        ← vowel-e and suffix modifiers
      compound.py        ← sign fusion rules (10+12→15)
      motif_context.py   ← motif → jurisdiction label
    scorer.py            ← weighted confidence calculator
    candidate.py         ← Reading candidate dataclass
  api/
    routes/engine.py     ← POST /api/engine/run/{seal_id}
```

### Key Rules to Implement (from paper)
1. `sign_phoneme` — M-142 → "aa" (cow)
2. `tally_phoneme` — tally-3 → "mu/muu"; tally-4 → "na/naa"; tally-6 → "a/aa"
3. `modifier` — sign-216(sa) + modifier → sign-219(si) → sign-220(sivam)
4. `compound` — signs 10+12 → sign 15 (aakaavva)
5. `motif_context` — unicorn → Market Common; none → city-wide
6. `ditto_mark` — single ditto repeats one preceding sound; double repeats all

### Confidence Scoring
- Base score per rule: from `decoding_rules_VPS2024.csv` confidence column
- Penalise: unresolved signs, missing phoneme mappings
- Boost: matching semantic domain, cross-seal consistency
- Output: 0.0–1.0 float, stored in `readings.confidence`

### Validation
- Run engine on all 24 known readings → check output matches paper
- Run on 100 unseeded seals → human review of output

### Time: 2 sessions

---

## Stage 4 — Research Dashboard

**Goal**: A React frontend where researchers can explore seals, signs, hypotheses, and readings side by side.

### Design Direction
Subject: ancient stone seals, terracotta script, scholarly precision
Palette: deep slate `#1a1f2e`, warm ochre `#c8922a`, aged parchment `#f2ead8`, terracotta `#b85c38`
Type: Libre Baskerville (display) + Inter (UI) + JetBrains Mono (sign data)
Signature: each seal card renders its sign sequence as an inline glyph strip

### Pages

#### 1. Seal Browser
- Grid of seal cards: corpus ID, site, motif icon, sign count, sign glyph strip
- Filter by: site, motif, sign count, has-reading, hypothesis
- Click seal → Seal Detail view
- Seal Detail: sign sequence, all readings across hypotheses, evidence links, confidence bars

#### 2. Sign Registry
- Table of all 397 Parpola signs
- Columns: Parpola ID, Mahadevan number, description, corpus frequency bar, Tamil phoneme (VPS2024)
- Filter by: sign type (tally, modifier, compound, pictogram, geometric)
- Click sign → which seals contain it

#### 3. Hypothesis Viewer
- Side-by-side comparison of 6 hypotheses
- For each: researcher, claim, publication, status badge, key evidence
- Shared seal selected → shows all hypothesis readings for that seal
- Confidence comparison chart

#### 4. Reading Comparison
- Select any seal → see all proposed readings across hypotheses
- Show: phoneme string, English meaning, Tamil script, confidence, source quote
- Flag conflicts, highlight agreements

#### 5. Frequency Dashboard
- Sign frequency bar chart (top 30)
- Motif distribution pie chart
- Signs-per-seal histogram
- Site distribution map (leaflet.js)
- All from live DB, not static images

#### 6. Peer Review Dashboard
- List of open review requests
- Reviewer submission form
- Objection tracker: claim → objection → author response
- Public methodology page

### Files to Build
```
frontend/
  src/
    pages/
      SealBrowser.tsx
      SealDetail.tsx
      SignRegistry.tsx
      HypothesisViewer.tsx
      ReadingComparison.tsx
      FrequencyDashboard.tsx
      PeerReview.tsx
    components/
      SealCard.tsx
      SignGlyphStrip.tsx
      ConfidenceBar.tsx
      HypothesisBadge.tsx
      EvidenceCard.tsx
      MotifIcon.tsx
    api/
      client.ts         ← axios wrapper
      seals.ts
      signs.ts
      readings.ts
      hypotheses.ts
```

### Time: 3 sessions

---

## Stage 5 — Statistical Validation

**Goal**: Produce reproducible statistical tests that either support or challenge the VPS2024 hypothesis against null and alternative baselines.

### Experiments to Run

#### Experiment 1: Sign Frequency Zipf Test
- Do Indus sign frequencies follow Zipf's law (expected of natural language)?
- Compare: actual frequency vs Zipf predicted, R² score
- Baseline: random symbol system
- Already partially done: `sign_frequency_distribution.png`

#### Experiment 2: Motif–Reading Co-occurrence Test
- Do unicorn seals significantly cluster around dairy/livestock semantic domains?
- Chi-squared test: motif × semantic_domain
- Null: motif and reading domain are independent
- Expected: p < 0.05 for unicorn-dairy co-occurrence

#### Experiment 3: Tamil Phoneme Coverage
- What % of the 241 mapped signs produce valid Tamil morphemes in CLDR/dictionary?
- Compare: VPS2024 coverage vs random Tamil phoneme assignment
- Metric: morpheme hit rate

#### Experiment 4: Cross-Seal Reading Consistency
- Do identical sign sequences produce identical readings across seals?
- Metric: consistency rate (should be high for a rule-based language)
- Seals 2444 and 2864 are the paper's own example (same inscription, different motif)

#### Experiment 5: GC-MS Lipid Prediction (Future)
- VPS2024 predicts: shards near ghee-reading seals contain milk/sesame lipids
- Precision of prediction: which seals, which sites, which ceramic types
- This platform generates the testable prediction; archaeochemists run the lab test

### Jupyter Notebooks
```
notebooks/
  01_sign_frequency_zipf.ipynb
  02_motif_reading_cooccurrence.ipynb
  03_tamil_phoneme_coverage.ipynb
  04_cross_seal_consistency.ipynb
  05_gcms_lipid_prediction_export.ipynb
```

### Time: 2 sessions

---

## Stage 6 — Knowledge Graph

**Goal**: Model the relationships between seals, signs, readings, meanings, evidence, and researchers as a queryable graph.

### Nodes
- Seal → Site → Region
- Sign → PhonemeMapping → Hypothesis
- Reading → SemanticDomain → Evidence
- Researcher → Hypothesis → PeerReview

### Edges
- Seal `CONTAINS` Sign (with position)
- Sign `MAPS_TO` Phoneme (under Hypothesis)
- Seal `HAS_READING` Reading (under Hypothesis)
- Reading `SUPPORTED_BY` Evidence
- Evidence `CITES` Publication
- Seal `IDENTICAL_INSCRIPTION_AS` Seal (e.g. 2444 ↔ 2864)
- Seal `EVOLVED_FROM` Seal (compound sign lineage)

### Implementation
- NetworkX for local graph analysis
- pgvector for semantic similarity between readings
- Optional: export to Neo4j or Gephi for visualisation

### Key Queries
- "Show me all seals related to dairy products"
- "Which signs appear exclusively in governance/law readings?"
- "What is the evidence chain for the unicorn=Market Common claim?"
- "Which seals share identical sign sequences?"

### Time: 2 sessions

---

## Stage 7 — Peer Review Loop

**Goal**: Give the author a structured, documented, public process for receiving and responding to scholarly review.

### What to Build

#### Reviewer Invitation System
- Email template (3 versions: archaeologist, linguist, computational)
- Personalised landing page per reviewer with specific questions
- One-click access to relevant seals and evidence

#### Review Form
- Structured scoring: methodology (1-5), evidence (1-5), reproducibility (1-5)
- Free text: major objections, minor objections, suggestions
- Ability to flag specific seal readings as questionable

#### Objection Tracker
- Each objection logged with: claim, reviewer, objection text, severity
- Author response field
- Status: open / addressed / withdrawn / standing dispute
- Public view: shows all objections and responses (no hidden reviews)

#### Reproducibility Statement
One-page document a reviewer can sign stating:
*"I imported the VPS2024 rule set into Open Indus Lab and obtained [X] identical readings out of [Y] tested."*

#### Files to Build
```
backend/app/api/routes/
  peer_reviews.py      ← POST /api/reviews, GET /api/reviews/{hypothesis}
  objections.py        ← CRUD for objection tracker

frontend/src/pages/
  ReviewForm.tsx
  ObjectionTracker.tsx
  PublicMethodology.tsx

docs/
  REVIEWER_GUIDE.md
  REPRODUCIBILITY_STATEMENT.md
  EMAIL_TEMPLATES.md
```

### Time: 2 sessions

---

## Stage 8 — Publication Strategy

**Goal**: Package the platform and research for journal submission and conference presentation.

### Paper Outline (for the draft article)
1. Abstract (150 words, structured)
2. Introduction — research gap, 100 years of failed decipherment
3. Methodology — sign mapping, tally mark rules, motif topology hypothesis
4. Results — 24 key readings with evidence, statistical validation scores
5. Critical Analysis — FSW2004 rebuttal, Zipf test, co-occurrence test
6. Limitations — 50+ unidentified signs, corpus coverage (10-15%), no bilingual text
7. Future Work — GC-MS, Tamil family comparative study, expanded excavation
8. Conclusions — 7 proven hypotheses listed
9. Reproducibility Statement — "All readings reproducible via Open Indus Lab"
10. References — grounded in endnotes i-ix from the paper

### Target Journals
- *Journal of Archaeological Science* (spectroscopic + computational methods)
- *Lingua* (linguistic methodology)
- *Cambridge Archaeological Journal*
- *Ancient Asia* (open access)

### Conference Targets
- International Colloquium on Harappan Civilization (established venue)
- Digital Humanities conference (computational angle)
- Tamil Studies conference (linguistic angle)

### GitHub README as Living Document
- Badges: build status, data completeness, peer reviews received
- Citation format in BibTeX
- DOI via Zenodo for data archive

### Files to Build
```
docs/
  PAPER_OUTLINE.md
  ABSTRACT.md
  LIMITATIONS.md
  REPRODUCIBILITY_STATEMENT.md
  CONFERENCE_SUBMISSION_PLAN.md
  CITATION.bib
```

### Time: 1 session

---

## Technology Decisions

### Backend
- **FastAPI** — async Python, clean REST endpoints
- **PostgreSQL 16 + pgvector** — stores all structured data + future embedding search
- **SQLAlchemy 2.0** — ORM with async support
- **Alembic** — database migrations, versioned schema

### Frontend
- **React 18 + TypeScript + Vite** — fast dev experience
- **TanStack Query** — data fetching and caching
- **Recharts** — frequency and confidence charts
- **Leaflet.js** — site map
- **Tailwind CSS** — utility styling

### Analysis
- **Jupyter notebooks** — reproducible experiments
- **pandas + numpy** — data manipulation
- **scikit-learn** — statistical tests, baseline comparisons
- **NetworkX** — knowledge graph
- **scipy** — Zipf test, chi-squared

### Infrastructure
- **Docker Compose** — one command to run everything locally
- **GitHub Actions** — CI on push (validate CSVs, run tests)
- No cloud required — fully local-first

---

## Session Roadmap

| Session | Stage | Output |
|---|---|---|
| Next | Stage 2 finish | DB import script + validation |
| 2 | Stage 3 start | Rule engine core + sign_phoneme + tally_phoneme |
| 3 | Stage 3 finish | Modifier, compound, motif rules + confidence scorer |
| 4 | Stage 4 start | Seal Browser + Sign Registry pages |
| 5 | Stage 4 middle | Hypothesis Viewer + Reading Comparison |
| 6 | Stage 4 finish | Frequency Dashboard + Docker + working local app |
| 7 | Stage 5 | All 4 statistical notebooks |
| 8 | Stage 6 | Knowledge graph + key queries |
| 9 | Stage 7 | Peer review system + reviewer emails |
| 10 | Stage 8 | Paper outline, abstract, GitHub release |

---

## Immediate Next 3 Actions

1. **Build `import_csv.py`** — load all 14 CSVs into PostgreSQL with cross-references fixed
2. **Build `rule_engine.py`** — core engine, start with sign_phoneme and tally_phoneme rules
3. **Test engine on seal 1076** — expected output: "thava ney" = very good ghee

---

## Success Criteria

The platform succeeds when a peer reviewer can:

1. Clone the repo and run `docker compose up`
2. Import the VPS2024 rule set from the seed CSVs
3. Select any seal and run the rule engine
4. Get the same reading the author published
5. Dispute a specific claim and log it in the objection tracker
6. See all evidence for and against that claim in one view
7. Sign a reproducibility statement that goes into the peer review record

That is the academic credibility target. Everything else serves that goal.
