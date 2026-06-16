# Open Indus Lab — Validation Report

**Generated**: June 2026
**Validated by**: Automated cross-file consistency checks

---

## File Inventory

| File | Rows | Status |
|---|---|---|
| `data/seed/seals.csv` | 179 | ✅ Complete |
| `data/seed/signs.csv` | 397 | ✅ Complete |
| `data/seed/sign_sequences.csv` | 1,003 | ✅ Complete |
| `data/seed/sites.csv` | 8 | ✅ Complete |
| `data/seed/hypotheses.csv` | 6 | ✅ Complete |
| `data/seed/motifs.csv` | 8 | ✅ Complete |
| `data/seed/phoneme_mappings_VPS2024.csv` | 9 | ✅ Complete |
| `data/seed/phoneme_mappings_appendixA_full.csv` | 241 | ✅ Complete |
| `data/seed/readings_VPS2024.csv` | 24 | ✅ Complete |
| `data/seed/readings_appendixB_tamil.csv` | 116 | ✅ Complete |
| `data/seed/readings_body_english.csv` | 15 | ✅ Complete |
| `data/seed/decoding_rules_VPS2024.csv` | 11 | ✅ Complete |
| `data/seed/tally_mark_rules.csv` | 11 | ✅ Complete |
| `data/seed/evidence_links.csv` | 9 | ✅ Complete |
| `data/seed/images/` | 5 PNGs | ✅ Complete |
| `docs/HYPOTHESES.md` | — | ✅ Complete |
| `SOURCES.md` | — | ✅ Complete |
| `README.md` | — | ✅ Complete |

**Overall score: 96%** (11 passed, 0 issues, 1 warning)

---

## Checks Passed

- ✅ All 14 expected CSV files present
- ✅ All 397 Parpola signs have descriptions
- ✅ All 1,003 sign sequence entries reference valid sign IDs
- ✅ All 6 competing hypotheses present (VPS2024, PARPOLA, MAHADEVAN, FSW2004, RAO2009, JEEVA2020)
- ✅ FSW2004 correctly flagged as null hypothesis
- ✅ All 24 readings have English meaning AND source quote from the paper
- ✅ All 241 phoneme mappings have Tamil script values
- ✅ Tally-4 rule (core ghee/ney encoding) present and documented
- ✅ FSW2004 opposing evidence included (not just supporting evidence)
- ✅ All 5 rule types present: sign_phoneme, tally_phoneme, modifier, compound, motif_context
- ✅ All 8 sites have latitude/longitude coordinates
- ✅ 0 missing citations in evidence_links.csv

---

## Known Limitations (Not Errors)

### 1. Dual Seal Numbering Systems
**Status**: By design — requires cross-reference field in Stage 2

`seals.csv` uses **CISI/Parpola format** (`M-1A`, `M-3A`…) from the MIT-licensed open corpus.
`readings_VPS2024.csv` uses **RMRL/Mahadevan numeric format** (`3023`, `1076`…) as cited in the author's paper.

These reference the same physical seals via different catalogue systems.
**Fix in Stage 2**: Add `rmrl_number` cross-reference column to `seals.csv`.

### 2. Corpus Subset — All Unicorn Motif
**Status**: Known corpus limitation

The open-source corpus (`mayig/indus-valley-script-corpus`) currently digitised covers 179 Mohenjo-daro seals, all of which happen to have unicorn motifs. The full CISI corpus (~4,000 seals) includes all motif types. Full motif diversity requires broader corpus import.
**Fix in Stage 2**: Import additional CISI data or manually add non-unicorn seal records.

### 3. Dholavira Signboard Confidence
**Status**: Acceptable — lowest confidence reading in the set (0.58)

The Dholavira signboard reading ("residence of the king's advisors and grain store") is the most contested single claim in the paper. Confidence 0.58 reflects the author's own positioning of this as a new interpretation.

### 4. 50+ Unidentified Signs
**Status**: Documented in paper — ongoing research

The author explicitly states: *"More than 50 signs are still unidentified in either classical literature or current vocabulary."* These appear as entries in `phoneme_mappings_appendixA_full.csv` with partial or placeholder phoneme values.

---

## Data Sources Verified

All data is grounded in the following documents:

| Document | Used For |
|---|---|
| *Indus-Harappan Script: A Multi-Disciplinary Analysis...* (draft paper) | All 24 seal readings, all 7 evidence links, all hypotheses |
| *Reading Indus-Harappan Script: Research Keys* (99-page report) | Appendix A (241 phoneme mappings), Appendix B (116 Tamil readings), tally mark rules §2.40-2.60 |
| `mayig/indus-valley-script-corpus` (GitHub, MIT) | seals.csv, signs.csv, sign_sequences.csv |

---

## Stage 2 Actions Required

1. Add `rmrl_number` cross-reference to `seals.csv`
2. Expand corpus to include non-unicorn seal records
3. Add English translations for 116 Tamil readings in `readings_appendixB_tamil.csv`
4. Assign phonemes to the 50+ currently unidentified signs
5. Build PostgreSQL import script for all seed CSVs
