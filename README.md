# Open Indus Lab

**An open computational framework for testing and comparing Indus-Harappan script decipherment hypotheses.**

> ⚠️ This platform does not claim to have decoded the Indus script. It provides reproducible, open tools for evaluating competing hypotheses using corpus data, rule engines, statistics, and peer review workflows.

---

## Background

The Indus-Harappan script (~3300–1300 BCE) remains undeciphered after over 100 years of scholarship. More than 4,000 inscribed objects have been found across a 1.3 million sq km civilisation. Despite a century of effort, no scholarly consensus exists on the language or meaning of the signs.

This platform provides a neutral computational layer for researchers to:

- Load and explore the open seal corpus
- Register named, versioned decipherment hypotheses
- Apply deterministic rule engines to produce candidate readings
- Compare hypotheses statistically against null baselines
- Invite peer reviewers and track objections systematically

---

## Primary Research Input

This platform was developed in connection with the following scholarly work by **Ponmuthu Shanmugham** (Member of Technical Staff, Retd, Lucent Technologies – Bell Laboratories):

### Published Books
| Title | ISBN |
|---|---|
| *Ancient Harappans Speak! After 5000 years* | 979-8-9949362-3-5 (paperback); 979-8-9940362-4-2 (eBook) |
| *Indus Script is a Language, A living language of 80 million* (Bilingual) | 979-8-9940362-6-6 (Kavin Publishers, 2026) |

### Research Report
- *Reading Indus-Harappan Script: Research Keys — A New Paradigm* (99 pages, 2026). ISBN: 979-8-9940362-9-7

### Draft Article
- *Indus-Harappan Script: A Multi-Disciplinary Analysis of Linguistic Continuity and Urban Topology* (2026, submitted for peer review)

---

## The VPS2024 Hypothesis (as modelled in this platform)

The hypothesis proposes that the Indus-Harappan script encodes an ancient form of the Tamil language. Key claims (each falsifiable and modelled separately):

### 1. Phonetic Mapping
Identifies **10 vowels and 18 consonants** of the Indus script, structurally similar to the Tamizi script. The most frequent sign — a U-shape with two prominent serifs — is proposed to represent a cow's face, phoneme **'aa' (ஆ)**, from the Tamil morpheme for cow, supported by the ancient grammar treatise *Tholkaappiyam*.

### 2. Tally Marks as Phonetic Substitution
Tally marks function as phonetic placeholders for Tamil vowel sounds (உ, ஊ) absent from the geometric sign corpus. Tamil number names embed these sounds:
- Tally-3 → *mu / muu* (மு, மூ)
- Tally-4 → *na / naa* (ந, நா) → enables encoding of *ney* (நெய் = ghee)
- Tally-6 → *a / aa* (also means 'river' in Tamil)
- Tally-7 → *e / ee*

Demonstrated in seals 2950, 2322, 1133, 1076.

### 3. Urban Topology of Motifs
Seal motifs are proposed as **street and district identifiers**:

| Motif | Proposed jurisdiction |
|---|---|
| Unicorn (~60% of iconographic seals) | Market Common (commercial plaza) |
| Elephant | Elephant Street (ghee, sesame oil) |
| Bull | Bull Street (milk, oxen, banners) |
| Zebu / Tiger | High-value cattle district |
| Gharial | Riverine facilities |
| No motif | City-wide ordinance (universal) |

### 4. Key Seal Readings (from the paper)

| Seal | Motif | Reading | Meaning |
|---|---|---|---|
| 3023, 2358 | Unicorn | *didiir aa* | Just expressed fresh milk |
| 1076 | Unicorn | *thava ne-y* | Very good ghee |
| 2082 | Unicorn | *iisaa muu aagaavva* | Carer of three cows of Isaa (Shiva) |
| 2648 | Elephant | *mi mi na y thoLzu* | Very good ghee shed |
| 2127 | Elephant | *eNNey* | Sesame ghee (eNNey in Tamil) |
| 1386 | Composite | — | High-value cattle shed |
| 2444 | Unicorn | *aNNa(l) kai aaNai* | Order of the Leader (Market Common) |
| 2864 | Gharial | *aNNa(l) kai aaNai* | Order of the Leader (Riverine) |
| 4440 | None | — | Citywide curfew |
| 4371 | None | — | Farmers guild law |
| 4284 | None | — | Skill certification |
| 2234 | Unicorn + Bull | *vayya yiir illam* | The world is a Big Home |
| 4718 | None | — | Panic milk mandate for children |
| 1425 | None | *illam vaya muu thani* | Homes for the aged and alone |
| 5119 | Unicorn | *muu da aa thoLzu* | Shed for aged cattle |
| 3246 | None | *vayamuula aagaavva* | Carer of aged cattle |
| 1110 | Unicorn | — | Respected equanimous great leader |
| 2617 | Unicorn | — | Buttermilk available HERE (banner) |
| Dholavira signboard | None | — | Residence of king's advisors and grain store |

### 5. Script Construction Mechanisms
- **Modifiers**: Have form but no independent sound; alter the phoneme of adjacent signs (e.g. sign 216 *sa* → sign 219 *si* → sign 220 *Sivam/Sivan*)
- **Compound integration**: Signs 10 (*kaa*) + 12 (*kaavva*) → sign 15 (*aakaavva* = cow carer), documented in seal 3246
- **Pictogram evolution**: Pictograms simplified over time toward geometric standardisation across 1.3M sq km and ~2000 years

### 6. Prior Work Extended
This hypothesis extends and modifies the work of:
- **Iravatham Mahadevan** — sign concordance (1977, RMRL Chennai)
- **Asko Parpola** — Dravidian framework, *Deciphering the Indus Script* (CUP, 1994)
- **Purnachandra Jeeva** — *sinthuveLiyil munthu thamiz* (சிந்துவெளியில் முந்து தமிழ்), Yalisaip Pathippagam, ISBN 978-81-9427-9105 (2020)

---

## Competing Hypotheses Modelled

| Code | Researcher | Claim | Status |
|---|---|---|---|
| VPS2024 | Ponmuthu Shanmugham | Old Tamil, syllabic | Active |
| PARPOLA | Asko Parpola | Proto-Dravidian, logo-syllabic | Active |
| MAHADEVAN | Iravatham Mahadevan | Dravidian concordance | Active |
| FSW2004 | Farmer, Sproat, Witzel | Non-linguistic emblems | Active (null hypothesis) |
| RAO2009 | Rajesh Rao et al. | Language-like structure (statistical) | Active |
| RAJARAM | Rajaram, Jha | Vedic Sanskrit | Archived (discredited) |

> FSW2004 reference: "The Collapse of the Indus Script Thesis: The myth of a literate Harappan civilization", Electronic Journal of Vedic Studies, 02/11/2004.

---

## Corpus Sources

| Source | Content | License |
|---|---|---|
| [mayig/indus-valley-script-corpus](https://github.com/mayig/indus-valley-script-corpus) | 179 seals, 397 signs, 1003 sign sequences (Mohenjo-daro) | MIT |
| RMRL Chennai — [www.indusscript.in](http://www.indusscript.in) | Seal images and Mahadevan concordance | Research use |
| CISI Vol.1 — Joshi & Parpola, Helsinki 1987 | Collections in India | Reference |
| CISI Vol.2 — Shah & Parpola, Helsinki 1991 | Collections in Pakistan | Reference |
| Dr. N. Yadav et al. — Harappa.com | Sign frequency distribution | Reference |
| K. Rajan, R. Sivamantham, Dept of Archaeology, Govt of Tamil Nadu (2025) | Graffiti marks morphological study | Reference |

---

## Data Files (`data/seed/`)

| File | Description | Rows | Source |
|---|---|---|---|
| `seals.csv` | Seal corpus, Mohenjo-daro | 179 | CISI / MIT corpus |
| `signs.csv` | Parpola sign concordance | 397 | MIT corpus |
| `sign_sequences.csv` | Ordered sign occurrences per seal | 1,003 | MIT corpus |
| `sites.csv` | 8 major excavation sites | 8 | ASI / published records |
| `hypotheses.csv` | 6 competing hypotheses | 6 | Published literature |
| `motifs.csv` | 8 motif types, dual interpretations | 8 | VPS2024 + Parpola |
| `phoneme_mappings_VPS2024.csv` | Key sign→Tamil phoneme mappings | 9 | VPS2024 paper |
| `phoneme_mappings_appendixA_full.csv` | Full 241-sign phoneme table | 241 | Research Keys Appendix A |
| `readings_VPS2024.csv` | Named seal readings with English glosses | 22 | VPS2024 paper |
| `readings_appendixB_tamil.csv` | 116 Tamil-script readings | 116 | Research Keys Appendix B |
| `readings_body_english.csv` | English readings from Research Keys body | 15 | Research Keys chapters |
| `decoding_rules_VPS2024.csv` | 10 deterministic decoding rules | 10 | VPS2024 paper |
| `tally_mark_rules.csv` | Tally 1–12 phoneme rules | 11 | Research Keys §2.40–2.60 |
| `evidence_links.csv` | Academic citations per claim | 8 | Paper endnotes |

---

## Future Validation Pathways (from the paper)

1. **Stratigraphic correlation** — correlate sign forms with Ravi/Kot Diji/Mature Harappan phases
2. **Spectroscopic analysis** — GC-MS on shards near ghee/sesame/buttermilk reading seals to detect milk and sesame lipids
3. **Comparative Tamil family study** — 50+ unidentified signs may resolve via Malayalam, Kannada, Telugu, Tulu, Brahui trade jargon
4. **Expanded corpus** — only 10–15% of ~4000+ Harappan sites excavated; longer inscriptions may exist

---

## Tech Stack

- **Backend**: Python FastAPI + PostgreSQL + pgvector
- **Frontend**: React + TypeScript + Vite
- **Analysis**: Jupyter Notebooks + scikit-learn + NetworkX
- **Infrastructure**: Docker Compose (local-first, no cloud required)

---

## Project Stages

- [x] **Stage 1** — Data model & PostgreSQL schema
- [x] **Stage 2** — Corpus loader & CSV seed data ← *current*
- [ ] **Stage 3** — Rule engine (sign → phoneme → reading)
- [ ] **Stage 4** — Research dashboard (React frontend)
- [ ] **Stage 5** — Statistical validation & null hypothesis testing
- [ ] **Stage 6** — Knowledge graph
- [ ] **Stage 7** — Peer review workflow
- [ ] **Stage 8** — Publication & conference submission

---

## License

MIT. Corpus data credit to respective sources listed above.

Research Keys content © Ponmuthu Shanmugham 2026 (ISBN 979-8-9940362-9-7). Used with permission for open research and peer review.

Contact: vpshanmugham@yahoo.com | 8112 Northway Drive, Hanover Park, IL 60133
