# Open Indus Lab

**An open computational framework for testing and comparing Indus-Harappan script decipherment hypotheses.**

**Live platform:** https://premkumar2306.github.io/open-indus-lab/ · **Paper (final draft, PDF):** [download](./docs/paper/Indus-Harappan-Script_Shanmugham_2026.pdf) · **Citable dataset:** [v1.0.0 release](https://github.com/premkumar2306/open-indus-lab/releases/tag/v1.0.0)


## Current Reading Layer Status

> **Note from the author (Ponmuthu Shanmugham):** *"I haven't completed the English translations as I didn't need them for the research, but they will help non-Tamil speakers. It needs two levels — phoneme (sounds) and morphemes (meaning). It needs to be done, but I haven't."*

| Layer | What | Status |
|---|---|---|
| **Layer 1 — Phoneme** | Tamil script + Roman transliteration (the sounds) | ✅ Complete for all 204 readings shown |
| **Layer 2 — Morpheme** | English meaning (the translation) | 🔲 40 complete (sourced from the final paper, Table 2), 164 pending |

Tamil-speaking researchers can evaluate all 204 readings now via Layer 1. Non-Tamil researchers can evaluate the 40 complete readings and the full methodology. See [`docs/READING_LAYERS.md`](./docs/READING_LAYERS.md) for full explanation.

---

> ⚠️ This platform does not claim to have decoded the Indus script. It provides reproducible, open tools for evaluating competing hypotheses using corpus data, rule engines, statistics, and peer review workflows.

### Data provenance (single source of truth)

Every seal reading and sign mapping is sourced **directly from the author's documents**
(`INDUS_SEALS_READ_in_book_5`, `Indus_Signs_Reading`, and the draft article). The
canonical tables are [`data/seed/seals_master.csv`](./data/seed/seals_master.csv)
(194 seal readings) and [`data/seed/signs_master.csv`](./data/seed/signs_master.csv)
(264 sign→phoneme mappings). The external Parpola/CISI corpus and the guessed
Parpola→Mahadevan sign bridge have been **removed** — see
[`docs/VALIDATION_REBUILD_REPORT.md`](./docs/VALIDATION_REBUILD_REPORT.md).

### How to cite

> Shanmugham, P. (2026). *Open Indus Lab: Indus-Harappan Seal Readings and
> Sign-Phoneme Mappings (Ancient Tamil Hypothesis)*, v1.0.0.
> https://github.com/premkumar2306/open-indus-lab

Stable dataset snapshots are published as [GitHub Releases](https://github.com/premkumar2306/open-indus-lab/releases); cite the release version you used. Machine-readable metadata: [`CITATION.cff`](./CITATION.cff).


---

## Project Status

| Stage | Name | Status |
|---|---|---|
| Stage 1 | Data model & seed schema | ✅ Complete |
| Stage 2 | Author-direct seed data (external corpus removed) | ✅ Complete |
| Stage 3 | Research dashboard (React, live on GitHub Pages) | ✅ Complete |
| Stage 4 | Citable dataset release (v1.0.0, CITATION.cff) | ✅ Complete |
| Stage 5 | Final paper ingestion (VER_4 Table 2 → Layer 2) | ✅ Complete |
| Stage 6 | Preprint + journal submission (OSF / HSSC / harappa.com) | 🔶 In progress |
| Stage 7 | Sign registry re-key to paper Table 1 numbering | ⏸ Awaiting author confirmation |
| Stage 8 | Statistical validation & rule engine | 🔲 Planned |

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
**Contact**: ponmuthushanmugham@gmail.com

### Published Works
| Title | ISBN |
|---|---|
| *Ancient Harappans Speak! After 5000 years* | 979-8-9949362-3-5 (pb) / 979-8-9940362-4-2 (eBook) |
| *Indus Script is a Language — A living language of 80 million* (Bilingual) | 979-8-9940362-6-6 (Kavin Publishers, 2026) |
| *Reading Indus-Harappan Script: Research Keys* (99 pages) | 979-8-9940362-9-7 (2026) |

### Draft Article
*Indus-Harappan Script: A Multi-Disciplinary Analysis of Linguistic Continuity and Urban Topology* (final draft, 2026) — [PDF on the platform](https://premkumar2306.github.io/open-indus-lab/paper/Indus-Harappan-Script_Shanmugham_2026.pdf). Submission targets: Humanities and Social Sciences Communications; harappa.com; Academia.edu.

---

## Data (`data/seed/`)

### Canonical author data (single source of truth)
| File | Rows | Description |
|---|---|---|
| `seals_master.csv` | **194** | Seal readings transcribed verbatim from `INDUS_SEALS_READ_in_book_5` |
| `signs_master.csv` | **264** | Sign→Tamil phoneme mappings from `Indus_Signs_Reading` (all corruption fixes documented in-row) |
| `readings_paper_VER4.csv` | **40** | Romanized readings + English meanings from the final paper (Table 2 & figures) |
| `phoneme_mappings_author_full.csv` | 264 | Working phoneme table (superseded by `signs_master.csv`) |
| `readings_author_full.csv` | 206 | Working readings table (superseded by `seals_master.csv`) |

### Research framework data
| File | Rows | Description |
|---|---|---|
| `hypotheses.csv` | 6 | Competing hypotheses incl. null (FSW2004) |
| `sites.csv` | 8 | Major excavation sites with GPS |
| `motifs.csv` | 8 | Seal motif catalogue |
| `decoding_rules_VPS2024.csv` | 11 | Deterministic rule engine rules |
| `tally_mark_rules.csv` | 11 | Tally 1–12 Tamil phoneme rules |
| `evidence_links.csv` | 9 | Academic citations (paper endnotes) |
| `readings_VPS2024.csv` / `readings_enriched_VPS2024.csv` / `readings_body_english.csv` | 24 / 206 / 15 | Article-derived reading detail |
| `phoneme_mappings_appendixA_full.csv` / `readings_appendixB_tamil.csv` | 241 / 116 | Research Keys appendices |

> **Removed (2026-07):** the external Parpola/CISI corpus (`seals.csv`, `signs.csv`, `sign_sequences.csv`) and the guessed Parpola→Mahadevan bridge. Its numbering had zero verified correspondence to the author's data. See [`docs/VALIDATION_REBUILD_REPORT.md`](./docs/VALIDATION_REBUILD_REPORT.md).

### Corpus scale (author clarification)
Each listed seal may represent a group of similar seals (1, 5, 20, 40, 60, 130, up to 400).
Seals shown read in the paper: **200+**, extrapolating to **700+** including represented groups.
Sample counts from the paper: cow 300, milk 44, ghee 24, ordinances 128, children's food 160, manure 60.

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
| 1076 | Unicorn | *thava thava ney* | Very good ghee |
| 2082 | Unicorn | *Isa muu aagaavva* | Cow carer of 3 cows of Isa |
| 2127 | Elephant | *eNNey* | Sesame oil |
| 2234 | Unicorn+Bull | *vayya yiir illam* | The world is a Big Home |
| 4718 | None | *ay ya ay o vyamun; ammu* | Panic milk for children (ordinance) |
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
| Frontend | React 18 + Vite, deployed to GitHub Pages (legacy mode, served from `main:/docs`) |
| Data | Versioned CSVs in `data/seed/` (canonical), validated every 4 hours by GitHub Actions |
| Backend (scaffold) | Python rule engine + PostgreSQL schema for the planned statistical stage |
| Validation | `scripts/validate.py` → `docs/VALIDATION_REPORT.md` (currently 16 pass / 0 fail) |

---

## Corpus Sources

| Source | Content | License |
|---|---|---|
| [mayig/indus-valley-script-corpus](https://github.com/mayig/indus-valley-script-corpus) | *Removed 2026-07 — incompatible numbering; see SOURCES.md* | MIT |
| RMRL Chennai — [indusscript.in](http://www.indusscript.in) | Seal images, Mahadevan concordance | Research use |
| CISI Vol.1 — Joshi & Parpola, Helsinki 1987 | Collections in India | Reference |
| CISI Vol.2 — Shah & Parpola, Helsinki 1991 | Collections in Pakistan | Reference |
| Dr. N. Yadav et al. — Harappa.com | Sign frequency data | Reference |
| Rajan & Sivamantham, Govt of Tamil Nadu (2025) | Graffiti mark morphology | Reference |

---

## License

MIT. Corpus data credit to respective sources above.

Research content © Ponmuthu Shanmugham 2026. Used with permission for open research and peer review.
