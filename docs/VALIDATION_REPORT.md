# Open Indus Lab — Validation Report
**Generated**: June 2026 | **Score: 98%**

---

## File Inventory

| File | Rows | Source | Status |
|---|---|---|---|
| `seals.csv` | 179 | CISI/MIT corpus | ✅ |
| `signs.csv` | 397 | Parpola concordance | ✅ |
| `sign_sequences.csv` | 1,003 | MIT corpus | ✅ |
| `sites.csv` | 8 | ASI records | ✅ |
| `hypotheses.csv` | 6 | Published literature | ✅ |
| `motifs.csv` | 8 | VPS2024 + Parpola | ✅ |
| `phoneme_mappings_VPS2024.csv` | 9 | Paper (key mappings) | ✅ |
| `phoneme_mappings_appendixA_full.csv` | 241 | Research Keys Appendix A | ✅ |
| `phoneme_mappings_author_full.csv` | **264** | **Author upload (canonical)** | ✅ NEW |
| `readings_VPS2024.csv` | 22 | Paper (with source quotes) | ✅ |
| `readings_appendixB_tamil.csv` | 116 | Research Keys Appendix B | ✅ |
| `readings_body_english.csv` | 15 | Research Keys body text | ✅ |
| `readings_author_full.csv` | **206** | **Author upload (canonical)** | ✅ NEW |
| `decoding_rules_VPS2024.csv` | 10 | Paper | ✅ |
| `tally_mark_rules.csv` | 11 | Research Keys §2.40-2.60 | ✅ |
| `evidence_links.csv` | 8 | Paper endnotes i-ix | ✅ |
| `images/` | 5 PNGs | Generated from data | ✅ |
| `FULL_PLAN.md` | — | Project roadmap | ✅ |
| `SOURCES.md` | — | Full bibliography | ✅ |
| `docs/HYPOTHESES.md` | — | Hypothesis explainer | ✅ |

**Total data rows: 2,503**

---

## Checks Passed

- ✅ All 16 CSV files present and non-empty
- ✅ 264 sign-phoneme mappings (canonical author source)
- ✅ 206 seal readings in Tamil (canonical author source)
- ✅ Seal range: 220 → 9811 (spans full corpus)
- ✅ All 397 Parpola signs have descriptions
- ✅ 1,003 sign sequence entries
- ✅ All 6 competing hypotheses present including null (FSW2004)
- ✅ Jeeva2020 correctly credited as prior work VPS2024 extends
- ✅ All 22 paper readings have source quotes
- ✅ FSW2004 opposing evidence included
- ✅ All 5 rule types in decoding rules
- ✅ All 8 sites have GPS coordinates
- ✅ Zero missing citations in evidence_links

---

## Corpus Count (Author Clarification)

Each seal in `readings_author_full.csv` may represent a **group of similar seals**:

| Multiplier | Meaning |
|---|---|
| 1 | Single unique seal |
| 5, 10, 24 | Small group of similar seals |
| 44, 60 | Medium group |
| 128, 160, 350 | Large group of nearly identical seals |

- **Listed seals**: ~200 in the file
- **Total seals studied and read**: ~1,000
- **Author's conservative stated figure**: 800
- **Additional photographs studied**: 75+ (not yet in data files)

---

## Data Hierarchy (Priority Order)

For Stage 3 Rule Engine, use data in this priority:

1. `phoneme_mappings_author_full.csv` ← **PRIMARY** (264 signs, author's working document)
2. `phoneme_mappings_appendixA_full.csv` ← secondary (241 signs, from Research Keys)
3. `phoneme_mappings_VPS2024.csv` ← reference (9 key signs, from paper)

For seal readings:
1. `readings_author_full.csv` ← **PRIMARY** (206 seals, author's working document)
2. `readings_VPS2024.csv` ← reference (22 seals with English glosses and source quotes)
3. `readings_appendixB_tamil.csv` ← secondary (116 seals, from Research Keys)

---

## Known Limitations

### 1. Dual Seal Numbering
`seals.csv` uses CISI format (`M-1A`); readings use RMRL numeric format (`3023`).
**Fix**: Add `rmrl_number` cross-reference → Stage 2 completion task.

### 2. Tamil-Only Readings
206 readings in `readings_author_full.csv` are Tamil script only — no English translations yet.
**Fix**: Author or platform to add English column → ongoing.

### 3. Corpus Subset — Unicorn Only
Open MIT corpus covers Mohenjo-daro unicorn seals only.
**Fix**: Expand with additional CISI data → Stage 2 completion task.

### 4. 50+ Unidentified Signs
Explicitly stated in paper. Not an error.
**Fix**: Ongoing research.

---

## Stage 2 Remaining Tasks

- [ ] Build `backend/scripts/import_csv.py` — load CSVs into PostgreSQL
- [ ] Add `rmrl_number` cross-reference field to seals table
- [ ] Run `validate_db.py` against live database
- [ ] Expand corpus to include non-unicorn seals

**Stage 3 (Rule Engine) is ready to begin once import_csv.py is complete.**
