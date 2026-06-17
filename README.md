# Open Indus Lab

**An open computational framework for testing and comparing Indus-Harappan script decipherment hypotheses.**

> ⚠️ This platform does not claim to have decoded the Indus script. It provides reproducible, open tools for evaluating competing hypotheses using corpus data, rule engines, statistics, and peer review workflows.

---

## Project Status

| Stage | Name | Status |
|---|---|---|
| Stage 1 | Data Model (PostgreSQL schema) | ✅ Complete |
| Stage 2 | Corpus Loader & Seed Data | ✅ Complete |
| Stage 3 | Rule Engine | 🔲 Next |
| Stage 4 | Research Dashboard (React) | 🔲 Planned |
| Stage 5 | Statistical Validation | 🔲 Planned |
| Stage 6 | Knowledge Graph | 🔲 Planned |
| Stage 7 | Peer Review Workflow | 🔲 Planned |
| Stage 8 | Publication Strategy | 🔲 Planned |

See [`FULL_PLAN.md`](./FULL_PLAN.md) for complete roadmap.

---

## Background

The Indus-Harappan script (~3300–1300 BCE) remains undeciphered after over 100 years of scholarship. More than 4,000 inscribed objects have been found across a 1.3 million sq km civilisation.

This platform provides a neutral computational layer for researchers to:
- Load and explore the open seal corpus
- Register named, versioned decipherment hypotheses
- Apply deterministic rule engines to produce candidate readings
- Compare hypotheses statistically against null baselines
- Invite peer reviewers and track objections systematically

---

## Primary Research Input

**Author**: Ponmuthu Shanmugham (Member of Technical Staff, Retd., Lucent Technologies – Bell Laboratories)
**Contact**: vpshanmugham@yahoo.com

### Published Works
| Title | ISBN |
|---|---|
| *Ancient Harappans Speak! After 5000 years* | 979-8-9949362-3-5 (pb) / 979-8-9940362-4-2 (eBook) |
| *Indus Script is a Language — A living language of 80 million* (Bilingual) | 979-8-9940362-6-6 (Kavin Publishers, 2026) |
| *Reading Indus-Harappan Script: Research Keys* (99 pages) | 979-8-9940362-9-7 (2026) |

### Draft Article
*Indus-Harappan Script: A Multi-Disciplinary Analysis of Linguistic Continuity and Urban Topology* (2026, submitted for peer review)

---

## Data (`data/seed/`)

**Total: 2,503 rows across 16 CSV files**

### Canonical Author Data (Primary)
| File | Rows | Description |
|---|---|---|
| `phoneme_mappings_author_full.csv` | **264** | Complete sign→Tamil phoneme table (author's working document) |
| `readings_author_full.csv` | **206** | Seal readings in Tamil, seals 220–9811 |

### Open Corpus Data (MIT Licensed)
| File | Rows | Description |
|---|---|---|
| `seals.csv` | 179 | Seal metadata from CISI/Parpola |
| `signs.csv` | 397 | Parpola sign concordance |
| `sign_sequences.csv` | 1,003 | Ordered sign occurrences per seal |

### Research Framework Data
| File | Rows | Description |
|---|---|---|
| `hypotheses.csv` | 6 | Competing hypotheses incl. null (FSW2004) |
| `sites.csv` | 8 | Major excavation sites with GPS |
| `motifs.csv` | 8 | Seal motif catalogue |
| `decoding_rules_VPS2024.csv` | 10 | Deterministic rule engine rules |
| `tally_mark_rules.csv` | 11 | Tally 1–12 Tamil phoneme rules |
| `evidence_links.csv` | 8 | Academic citations (endnotes i–ix) |
| `readings_VPS2024.csv` | 22 | Key readings with source quotes |
| `phoneme_mappings_appendixA_full.csv` | 241 | Signs from Research Keys Appendix A |
| `readings_appendixB_tamil.csv` | 116 | Readings from Research Keys Appendix B |

### Corpus Scale (Author Clarification)
Each listed seal may represent a group of similar seals (1, 5, 10, 24, 44, 60, 128, 160, or 350).
Total seals studied and read: **~1,000** (stated conservatively as 800).
75+ additional seal photographs studied but not yet in data files.

---

## The VPS2024 Hypothesis

### Core Claims
1. **Phonetics**: 10 vowels + 18 consonants mapped to Tamil. Most frequent sign = cow face = phoneme *aa* (ஆ)
2. **Tally marks**: Phonetic placeholders using Tamil numeral names (tally-4 = *nanku* → *na* → enables *ney* = ghee)
3. **Motifs as street signs**: Unicorn = Market Common; Elephant = Elephant Street; No motif = city-wide ordinance
4. **Modifiers**: Have form but no independent sound; alter adjacent sign phoneme
5. **Compound integration**: Signs 10+12 → sign 15 (*aakaavva* = cow carer), documented in seal 3246

### Key Seal Readings
| Seal | Motif | Reading | Meaning |
|---|---|---|---|
| 3023, 2358 | Unicorn | *didiir aa* | Just expressed fresh milk |
| 1076 | Unicorn | *thava ney* | Very good ghee |
| 2082 | Unicorn | *iisaa muu aagaavva* | Carer of 3 cows of Isaa (Shiva) |
| 2127 | Elephant | *eNNey* | Sesame oil |
| 2234 | Unicorn+Bull | *vayya yiir illam* | The world is a Big Home |
| 4718 | None | — | Panic milk mandate for children |
| 1425 | None | *illam vaya muu thani* | Homes for the aged and alone |
| 2444 | Unicorn | *aNNal kai aaNai* | Order of the Leader |
| Dholavira | None | — | Residence of king's advisors + grain store |

---

## Competing Hypotheses

| Code | Researcher | Claim | Role |
|---|---|---|---|
| VPS2024 | Ponmuthu Shanmugham | Ancient Tamil, syllabic | Primary input |
| JEEVA2020 | Purnachandra Jeeva | Ancient Tamil (prior work) | Extended by VPS2024 |
| PARPOLA | Asko Parpola | Proto-Dravidian, logo-syllabic | Comparison |
| MAHADEVAN | Iravatham Mahadevan | Dravidian concordance | Comparison |
| FSW2004 | Farmer, Sproat, Witzel | Non-linguistic emblems | **Null hypothesis** |
| RAO2009 | Rajesh Rao et al. | Language-like entropy | Statistical baseline |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python FastAPI + PostgreSQL 16 + pgvector |
| Frontend | React 18 + TypeScript + Vite + Tailwind |
| Analysis | Jupyter + pandas + scikit-learn + NetworkX |
| Infrastructure | Docker Compose (local-first, no cloud) |

---

## Corpus Sources

| Source | Content | License |
|---|---|---|
| [mayig/indus-valley-script-corpus](https://github.com/mayig/indus-valley-script-corpus) | 179 seals, 397 signs (Mohenjo-daro) | MIT |
| RMRL Chennai — [indusscript.in](http://www.indusscript.in) | Seal images, Mahadevan concordance | Research use |
| CISI Vol.1 — Joshi & Parpola, Helsinki 1987 | Collections in India | Reference |
| CISI Vol.2 — Shah & Parpola, Helsinki 1991 | Collections in Pakistan | Reference |
| Dr. N. Yadav et al. — Harappa.com | Sign frequency data | Reference |
| Rajan & Sivamantham, Govt of Tamil Nadu (2025) | Graffiti mark morphology | Reference |

---

## License

MIT. Corpus data credit to respective sources above.

Research content © Ponmuthu Shanmugham 2026. Used with permission for open research and peer review.
