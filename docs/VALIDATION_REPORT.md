# Open Indus Lab — Validation Report
**Last run**: 2026-06-28 17:02 UTC
**Score**: 100% (15 passed / 3 warnings / 0 failed)

---

## Results

✅ Sign images count — 263/264
✅ All key sign images present
✅ Sign image sizes OK
✅ Tamil phoneme text clean — no known corruption patterns
✅ All key seals have readings
⚠️  Seal meanings may have changed — #2082: expected 'Carer of Isa', got 'Carer of three cows of Isaa (Shiva)'
✅ seals_master.csv — 194 rows
✅ signs_master.csv — 264 rows
✅ phoneme_mappings_author_full.csv — 264 rows
✅ readings_author_full.csv — 206 rows
✅ readings_VPS2024.csv — 24 rows
✅ hypotheses.csv — 6 rows
✅ decoding_rules_VPS2024.csv — 11 rows
✅ tally_mark_rules.csv — 11 rows
✅ evidence_links.csv — 9 rows
✅ motifs.csv — 8 rows
⚠️  Sign rows flagged for author confirmation — signs 39, 51, 52, 322, 391 diverge from source text (not font-corruption)
⚠️  Layer 2 translations — Layer 1 (phonemes) complete for all readings; English meaning in progress

---

## Summary

| Category | Count |
|---|---|
| ✅ Passed | 15 |
| ⚠️  Warnings | 3 |
| ❌ Failed | 0 |

---

## Known Open Issues

1. **External corpus removed** — the Parpola/CISI `M-xxx` seal corpus and the guessed Parpola→Mahadevan sign bridge have been removed. All seal and sign data now comes directly from the author's documents.
2. **Five sign rows flagged** — signs 39, 51, 52, 322, 391 diverge from the source text in ways that are not font-corruption; awaiting author confirmation.
3. **Layer 2 translations** — Layer 1 (Tamil phonemes) complete for all readings; English meanings being added progressively by the author.
4. **Unidentified signs** — explicitly noted in the research as ongoing.

---

*Auto-generated every 4 hours by `.github/workflows/validate.yml`*
