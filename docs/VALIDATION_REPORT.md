# Open Indus Lab — Validation Report
**Last run**: 2026-06-23 14:35 UTC
**Score**: 100% (15 passed / 3 warnings / 0 failed)

---

## Results

✅ Sign images count — 263/264
✅ All key sign images present
✅ Sign image sizes OK
✅ Tamil phoneme text clean — no known corruption patterns
✅ All key seals have readings
⚠️  Seal meanings may have changed — #2082: expected 'Carer of Isa', got 'Carer of three cows of Isaa (Shiva)'
✅ seals.csv — 179 rows
✅ signs.csv — 397 rows
✅ phoneme_mappings_author_full.csv — 264 rows
✅ readings_author_full.csv — 206 rows
✅ readings_VPS2024.csv — 24 rows
✅ hypotheses.csv — 6 rows
✅ decoding_rules_VPS2024.csv — 11 rows
✅ tally_mark_rules.csv — 11 rows
✅ evidence_links.csv — 9 rows
✅ motifs.csv — 8 rows
⚠️  Seal #1076 sign sequence — shows [95,162,162] but source PDF shows thava+thava+ney — needs author confirmation
⚠️  Layer 2 translations — 189 of 206 readings still pending English translation

---

## Summary

| Category | Count |
|---|---|
| ✅ Passed | 15 |
| ⚠️  Warnings | 3 |
| ❌ Failed | 0 |

---

## Known Open Issues

1. **Seal #1076 sign sequence** — dashboard shows `[M-95, M-162, M-162]` but PDF shows `thava thava ney` (M-391 + M-391 + M-95 + M-162). Awaiting author confirmation of correct Mahadevan numbers for all key seals.
2. **Layer 2 translations** — 189 of 206 readings have Tamil phoneme only. English meanings being added progressively by author.
3. **50+ unidentified signs** — explicitly noted in research. Ongoing.

---

*Auto-generated every 4 hours by `.github/workflows/validate.yml`*
