# Translation Tracker — Layer 2 (English Meanings)

Status as of June 2026.

## Summary
| Status | Count |
|---|---|
| ✅ Complete (Tamil + Phoneme + English) | 17 |
| 🔲 Pending (Tamil + Phoneme only) | 189 |
| **Total** | **206** |

## What needs to be done
For each of the 189 pending seals in `readings_enriched_VPS2024.csv`:
- Confirm or correct the auto-generated `phoneme_roman` field
- Add `morpheme_english` — English meaning of the reading
- Add `semantic_domain` — category (dairy products, governance, animal husbandry, etc.)

## How to contribute
1. Open `data/seed/readings_enriched_VPS2024.csv`
2. Find rows where `translation_status = pending`
3. Fill in `morpheme_english` and `semantic_domain`
4. Set `translation_status = complete`
5. Submit as pull request or email to vpshanmugham@yahoo.com

## Semantic Domains (use these consistently)
- `dairy products` — ghee, milk, buttermilk, sesame oil
- `animal husbandry` — cow care, cattle sheds, aged cattle
- `animal welfare` — elder cattle, temple cows
- `governance / law` — ordinances, orders, guild laws
- `social welfare` — elder care, children's food, homes
- `agriculture` — fields, farmers, grain
- `religious / civic` — temple, Shiva, sacred
- `labour / certification` — skill certs, worker roles
- `food commodities` — general food products
- `governance` — leader roles, village care

## Two-Layer Structure
Every reading has two layers:

**Layer 1 — Phoneme (sound):**
```
tamil_script:  வ வ ெய்
phoneme_roman: thava thava ney
```

**Layer 2 — Morpheme (meaning):**
```
morpheme_english: very good ghee
semantic_domain:  dairy products
translation_status: complete
```

This allows:
- **Tamil speakers**: access Layer 1 immediately — full reading available now
- **Non-Tamil peer reviewers**: access Layer 2 when complete
- **Statistics**: run on Layer 1 even while Layer 2 is being filled
- **UI**: show `[meaning pending]` badge rather than hiding the reading
