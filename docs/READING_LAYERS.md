# Reading Layers — Status Note for Peer Reviewers

## What Exists Now

Every seal reading in this platform has **two distinct layers**:

---

### Layer 1 — Phoneme (Sound)
**Status: Complete for all 199 readings shown**

The Tamil script reading and its Roman transliteration.

| Seal | Tamil Script | Phoneme (Roman) |
|---|---|---|
| 1076 | வ வ நெய் | thava thava ney |
| 2082 | சிவ மூ ஆகாவ்வ | siva muu aakaavva |
| 3246 | வய மூ ள ஆகாவ்வ | vaya muu La aakaavva |

Tamil-speaking researchers can read, verify, and critique all 206 readings **right now** from Layer 1.

---

### Layer 2 — Morpheme (Meaning)
**Status: 20 complete, 179 pending**

The English translation and semantic domain.

| Seal | Phoneme (L1) | Meaning (L2) | Status |
|---|---|---|---|
| 1076 | thava thava ney | Very Good Ghee | ✅ Complete |
| 2082 | siva muu aakaavva | Carer of Isa's 3 cows | ✅ Complete |
| 3246 | vaya muu La aakaavva | Carer of aged cattle | ✅ Complete |
| 232 | malai aracha | [meaning pending] | 🔲 Pending |
| 1102 | taNNi | [meaning pending] | 🔲 Pending |

---

## Why Layer 2 Is Incomplete

The author (Ponmuthu Shanmugham) states directly:

> *"I haven't completed it as I didn't need it for the research, but it will help non-Tamil speakers. It needs two levels — phoneme (sounds) and morphemes (meaning). It needs to be done, but I haven't."*

The research was conducted in Tamil. The phoneme readings (Layer 1) are the primary research output. English translations (Layer 2) are a secondary task for accessibility — they are being added progressively.

---

## What Peer Reviewers Can Do Now

| Reviewer type | Can evaluate | Using |
|---|---|---|
| Tamil-speaking researcher | All 206 readings | Layer 1 (Tamil script + phoneme) |
| Non-Tamil researcher | 20 complete readings | Layer 2 (English meaning) |
| Any researcher | Methodology, rules, motif hypothesis | Research Keys + decoding_rules_VPS2024.csv |
| Any researcher | Statistical patterns | Frequency dashboard charts |
| Any researcher | Competing hypotheses | Hypothesis Viewer (6 frameworks) |

---

## How to Help Complete Layer 2

If you are a Tamil speaker and wish to contribute English translations:

1. Download `data/seed/readings_enriched_VPS2024.csv` from this repo
2. Find rows where `translation_status = pending`
3. Fill in `morpheme_english` and `semantic_domain`
4. Submit as a pull request or email: **ponmuthushanmugham@gmail.com**

Semantic domains in use: `dairy products`, `animal husbandry`, `animal welfare`, `governance / law`, `social welfare`, `agriculture`, `religious / civic`, `labour / certification`, `food commodities`, `governance`

---

## Platform Positioning

This platform does **not** claim the Indus script has been decoded.

It is positioned as: *"An open computational framework for testing and comparing Indus-Harappan script decipherment hypotheses."*

The incompleteness of Layer 2 is not a flaw — it is an honest statement of where the research stands, and an open invitation for collaborative completion.
