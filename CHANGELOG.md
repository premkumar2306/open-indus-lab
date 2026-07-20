# Changelog — Open Indus Lab

Human-readable project history. For the complete append-only record, see the
[commit log](https://github.com/premkumar2306/open-indus-lab/commits/main);
auto-validate commits appear only when validation results change.

## 2026-07 — Final paper hosted; verification diff; git hygiene
- Author's **final paper** hosted (previous "Download" link had been broken by a
  gitignore rule since Publications launched — root-caused and fixed).
- **Table 1 verification diff** run against the platform's sign registry after the
  author fixed an Excel sort error that had scrambled the paper's sign numbers:
  37 matches, 7 paper-only refinements, 2 residual slips returned to the author.
  The scramble never contaminated the platform — the freeze-don't-guess rule held.
- Signs 373 (வ) and 387 (வய) corrected (word-initial kombu corruption surfaced
  by the diff).
- Auto-validate commit noise stopped at the source (deterministic report; daily
  schedule); dead deploy workflow removed.

## 2026-07 — Author corrections; community review opens
- **Sign-numbering question resolved by the author**: the reading-book numbering
  (342 = aa) is canonical; the paper's Table 1 error traced to a spreadsheet sort.
- 19 sign Tamil readings corrected per the author's review; source sign "3411"
  confirmed as a typo for **341** (பண், பண); glyph restored.
- **Kombu-corruption defence** built from the author's diagnosis: automated fixer
  (`scripts/tamil_kombu_fix.py`) + CI guard that fails if corruption ever returns.
- **GitHub Discussions opened** for attributable review — concur/challenge/question
  any reading; votes never alter the dataset.
- Author's Overview wording deployed; data-version stamp added to the header.

## 2026-07 — Final-paper data; clean imagery; mobile
- VER_4/final Table 2 ingested: **Layer 2 English meanings for 40 seals**; 5 new
  seals including pottery shard 2929 (the GC-MS falsification test piece).
- **All imagery re-extracted from source**: 263 sign glyphs (dynamic per-row
  bounds) and 32 seal strips (text-anchored crops) — zero truncation, verified by
  edge-ink audit; Featured Gallery grew from 14 to 32 seals.
- Mobile-responsive layout; Publications tab (paper + books + foundational
  references) replaces the Research tab per the author's direction.

## 2026-07 — Peer-review readiness
- **v1.0.0 citable release** + `CITATION.cff`; GitHub topics for discoverability.
- Overview landing page for researchers arriving cold; falsification tests
  (stratigraphic sign-compression, GC-MS, blind concordance read) given top billing.
- Submission kit prepared: abstract draft, HSSC anonymisation checklist,
  harappa.com outreach, OSF/Zenodo plan.

## 2026-06 — The author-direct rebuild
- **External Parpola/CISI corpus removed** (zero verified correspondence to the
  author's numbering; the guessed sign bridge had produced unreliable readings).
- Canonical datasets established: `seals_master.csv` (194 readings) and
  `signs_master.csv` (264 mappings), transcribed verbatim from the author's
  documents with all corrections logged in-row.
- Seal Browser expanded from 20 to 199+ readings; validation suite established.

## Origins
- Initial platform: data model, rule-engine scaffold, first dashboard, and the
  founding principle that has held throughout: **the author's documents are the
  single source of truth, and nothing is ever guessed on his behalf.**
