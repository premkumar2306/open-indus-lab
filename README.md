# Open Indus Lab

**An open computational framework for testing and comparing Indus-Harappan script decipherment hypotheses.**

> ⚠️ This platform does not claim to have decoded the Indus script. It provides reproducible tools for evaluating competing hypotheses using data, rule engines, and peer review workflows.

---

## What is this?

The Indus-Harappan script (~2600–1900 BCE) remains one of the world's longest-undeciphered writing systems. Over 4,000 inscribed objects have been found, yet no scholarly consensus on their meaning exists.

Open Indus Lab is a local-first, open-source research platform that allows researchers to:
- **Load** the corpus of known seals and signs
- **Define** competing decipherment hypotheses (Tamil, Dravidian, non-linguistic, etc.)
- **Apply** deterministic rule engines to generate candidate readings
- **Compare** readings statistically against null and alternative hypotheses
- **Invite** peer reviewers and track objections systematically

---

## Data (Stage 1 — Complete)

All seed data is in [`data/seed/`](./data/seed/).

| File | Description | Rows |
|---|---|---|
| `seals.csv` | Seal corpus from CISI/Parpola (MIT license) | 179 |
| `signs.csv` | 397 Parpola sign concordance entries | 397 |
| `sign_sequences.csv` | Ordered sign sequences per seal | 1,003 |
| `sites.csv` | 8 major excavation sites | 8 |
| `hypotheses.csv` | 6 competing hypotheses incl. null | 6 |
| `motifs.csv` | 8 motif types with dual interpretations | 8 |
| `phoneme_mappings_VPS2024.csv` | Key sign→Tamil phoneme mappings | 9 |
| `phoneme_mappings_appendixA_full.csv` | **Full 241-sign phoneme table** (VPS2024) | 241 |
| `readings_VPS2024.csv` | Named seal readings with English glosses | 22 |
| `readings_appendixB_tamil.csv` | 116 seal readings in Tamil script | 116 |
| `readings_body_english.csv` | English readings from research text | 15 |
| `decoding_rules_VPS2024.csv` | 10 deterministic decoding rules | 10 |
| `tally_mark_rules.csv` | Tally 1–12 phoneme rules | 11 |
| `evidence_links.csv` | Academic citations per reading | 8 |

---

## Corpus Sources

- **Seal corpus**: [`mayig/indus-valley-script-corpus`](https://github.com/mayig/indus-valley-script-corpus) — MIT license digitisation of CISI (Parpola et al.)
- **Sign features**: Parpola (1982) sign concordance
- **VPS2024 hypothesis**: Ponmuthu Shanmugham, *Reading Indus-Harappan Script: Research Keys* (2026)

---

## Competing Hypotheses Modelled

| Code | Researcher | Claim |
|---|---|---|
| VPS2024 | V.P. Shanmugham | Old Tamil (syllabic) |
| PARPOLA | Asko Parpola | Proto-Dravidian (logo-syllabic) |
| MAHADEVAN | Iravatham Mahadevan | Dravidian (concordance) |
| FSW2004 | Farmer-Sproat-Witzel | Non-linguistic (null hypothesis) |
| RAO2009 | Rajesh Rao et al. | Language-like structure (statistical) |
| RAJARAM | Rajaram-Jha | Vedic Sanskrit (archived) |

---

## Tech Stack

- **Backend**: Python FastAPI + PostgreSQL + pgvector
- **Frontend**: React + TypeScript + Vite
- **Analysis**: Jupyter notebooks + scikit-learn + NetworkX
- **Infrastructure**: Docker Compose (local-first, no cloud required)

---

## Project Stages

- [x] **Stage 1**: Data model & schema
- [x] **Stage 2**: Corpus loader & CSV seed data ← *you are here*
- [ ] **Stage 3**: Rule engine (sign→phoneme→reading)
- [ ] **Stage 4**: Research dashboard (React frontend)
- [ ] **Stage 5**: Statistical validation
- [ ] **Stage 6**: Knowledge graph
- [ ] **Stage 7**: Peer review workflow
- [ ] **Stage 8**: Publication strategy

---

## License

MIT — corpus data credit to respective sources listed above.

Data from *Reading Indus-Harappan Script: Research Keys* © Ponmuthu Shanmugham 2026. Used with permission for research purposes.
