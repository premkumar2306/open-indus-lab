# Open Indus Lab — Seed Data

## Sources

### Corpus Data (open source, MIT)
- `seals.csv`, `signs.csv`, `sign_sequences.csv`
- Source: [mayig/indus-valley-script-corpus](https://github.com/mayig/indus-valley-script-corpus)
- Digitisation of: Corpus of Indus Seals and Inscriptions (CISI), Parpola et al.
- Coverage: Mohenjo-daro, 179 seals, 397 signs, 1003 sign occurrences

### Research Hypothesis Data (VPS2024)
- `phoneme_mappings_*.csv`, `readings_*.csv`, `decoding_rules_*.csv`, `tally_mark_rules.csv`
- Source: Ponmuthu Shanmugham, *Reading Indus-Harappan Script: Research Keys* (2026)
- ISBN: 979-8-9940362-9-7
- Used with permission for research and peer review purposes

### Reference Data
- `sites.csv` — 8 excavation sites (ASI, HARP records)
- `hypotheses.csv` — 6 competing hypotheses
- `motifs.csv` — 8 motif types

## Notes
- All confidence scores (0.0–1.0) are researcher estimates, not validated probabilities
- Tamil script in `readings_appendixB_tamil.csv` requires UTF-8 rendering
- PNG charts in `images/` are generated from this seed data
