# Open Indus Lab — Validation Against Author Sources & Rebuild Plan

Validated the live repo (`premkumar2306/open-indus-lab`) against the three author
documents in the project: the draft article (`INDUS_HARAPPAN_VER_3_PREM`), the seal
readings (`INDUS_SEALS_READ_in_book_5`), and the sign registry (`Indus_Signs_Reading`).

## Bottom line

The author's **raw data is sound**. The defect is **architectural**: the dashboard's
seal display is built on an unrelated external corpus, bridged to the author's data by
a guessed sign-number map. That is what reads as "wrong in both seals and scripts."

## What is actually correct (keep)

| File | Status |
|------|--------|
| `readings_author_full.csv` (194 seals) | **Exact match** to the seal source — 0 missing, 0 extra seal IDs. |
| `phoneme_mappings_author_full.csv` (264 signs) | All 261 source signs present (+402–404). 19 differences are correct வ↔ெ font-corruption fixes. |
| `readings_enriched_VPS2024.csv` | Keyed by the author's real seal IDs; faithful. |
| `readings_VPS2024.csv` (24 seals) | Hand-curated from the paper body (3023, 2358, 1076…); accurate. |

## What is wrong (fix)

**1. The Seal Browser shows seals the author never read.**
`seals.csv` contains 179 CISI/Parpola corpus seals (`M-1A`, `M-100A`, …).
The author's 194 readings are numbered `220`, `1110`, `2444`, …
**Overlap between the two sets = 0.** The seals on screen and the author's research
are two disconnected halves.

**2. Composed readings rely on a guessed Parpola→Mahadevan bridge.**
`signs.csv` maps 324 Parpola signs to Mahadevan numbers; 106 of those M-numbers are
not in the author's phoneme map at all, and 46 of the author's are never used. Any
reading the engine composes for an `M-xxx` seal flows through this guessed bridge —
exactly the Mahadevan-number guessing that has produced errors before.

**3. Five sign rows diverge from the source text (not font fixes) — confirm with author:**

| Sign | Source | Repo currently | 
|------|--------|----------------|
| 39 | வக, கக | கெ, கே |
| 51 | 'கதளணஅ' | தேளணஅ |
| 52 | 'கதளனர்' | தேளனர் |
| 322 | ெென்,வ்ென் | வன்,வ்வன் |
| 391 | ட் / தெ (source lists 391 twice) | தவ |

## The correct rebuild

Make the **author's three documents the single source of truth** and stop presenting
the external corpus as readings:

1. **Seal layer** = the 194 verified author readings (`seals_master.csv`), keyed by the
   author's own seal IDs, shown verbatim with the Tamil reading and the author's
   embedded English glosses (e.g. `1076 → very good ghee`).
2. **Sign layer** = the 264 verified sign→phoneme mappings (`signs_master.csv`), font
   corrections applied, the 5 divergences flagged for author confirmation.
3. **External corpus** (Parpola `M-xxx`, sign sequences) → demote to an **optional,
   clearly-labelled "unverified cross-reference,"** never the primary reading, until
   the author supplies a verified seal-ID concordance.

## Files produced in this pass

- `seals_master.csv` — 194 author seals, source-faithful.
- `signs_master.csv` — 264 author signs, with `source` + `corrected` columns and flags.
- `VALIDATION_REBUILD_REPORT.md` — this report.
