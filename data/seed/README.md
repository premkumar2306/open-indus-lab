# Open Indus Lab — Seed Data

**Total: 2,503 rows | 16 CSV files | 5 chart images**

---

## Data Hierarchy

Use data in this priority order for the rule engine:

### Phoneme Mappings (sign → Tamil sound)
1. `phoneme_mappings_author_full.csv` ← **USE THIS** (264 signs, author's working document, June 2026)
2. `phoneme_mappings_appendixA_full.csv` (241 signs, from Research Keys Appendix A)
3. `phoneme_mappings_VPS2024.csv` (9 key signs, from paper — includes English notes)

### Seal Readings
1. `readings_author_full.csv` ← **USE THIS** (206 seals, author's working document, June 2026)
2. `readings_VPS2024.csv` (22 seals with English glosses and paper source quotes)
3. `readings_appendixB_tamil.csv` (116 seals, Research Keys Appendix B)
4. `readings_body_english.csv` (15 seals with English, from Research Keys body)

---

## File Reference

| File | Rows | Source |
|---|---|---|
| `phoneme_mappings_author_full.csv` | 264 | Author upload — Indus_Signs_Reading.pdf |
| `readings_author_full.csv` | 206 | Author upload — INDUS_SEALS_READ_in_book_5.pdf |
| `signs.csv` | 397 | mayig/indus-valley-script-corpus (MIT) |
| `sign_sequences.csv` | 1,003 | mayig/indus-valley-script-corpus (MIT) |
| `seals.csv` | 179 | mayig/indus-valley-script-corpus (MIT) |
| `phoneme_mappings_appendixA_full.csv` | 241 | Research Keys Appendix A |
| `readings_appendixB_tamil.csv` | 116 | Research Keys Appendix B |
| `readings_VPS2024.csv` | 22 | Draft paper (with source quotes) |
| `hypotheses.csv` | 6 | Published literature |
| `motifs.csv` | 8 | VPS2024 + Parpola |
| `decoding_rules_VPS2024.csv` | 10 | Draft paper |
| `tally_mark_rules.csv` | 11 | Research Keys §2.40–2.60 |
| `evidence_links.csv` | 8 | Paper endnotes i–ix |
| `sites.csv` | 8 | ASI / published records |
| `readings_body_english.csv` | 15 | Research Keys body text |
| `phoneme_mappings_VPS2024.csv` | 9 | Draft paper |

---

## Notes

- Tamil script requires UTF-8 rendering
- Confidence scores (0.0–1.0) are researcher estimates, not validated probabilities
- Each seal in `readings_author_full.csv` may represent a group of 1–350 similar seals
- 50+ signs currently unidentified (explicitly stated in paper)
- Seal IDs in readings use RMRL numeric format; seals.csv uses CISI format (cross-ref needed)
