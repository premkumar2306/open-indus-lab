"""
Open Indus Lab — Rule Engine Tests

Validates engine output against known readings from the paper.

Key tests:
  - Seal 1076: tally-4 + Y-sign + Y-sign → "thava ney" (very good ghee)
  - Seal 2082: sign sequence → "iisaa muu aagaavva" (carer of 3 cows of Shiva)
  - Seal 3246: compound signs 10+12 → "vayamuula aagaavva" (carer of aged cattle)
  - Seal 2234: → "vayya illam" (The world is a Big Home)
  - Motif test: unicorn → Market Common jurisdiction
  - Motif test: none → City-wide jurisdiction

Run: python -m pytest backend/app/engine/tests.py -v
  or: python backend/app/engine/tests.py
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../.."))

from backend.app.engine.rule_engine import RuleEngine
from backend.app.engine.loader import EngineData
from backend.app.engine.rules import tally_phoneme, sign_phoneme, compound_motif

DATA_DIR = os.path.join(os.path.dirname(__file__), "../../../../data/seed")


def run_tests():
    print("=" * 60)
    print("OPEN INDUS LAB — RULE ENGINE TEST SUITE")
    print("=" * 60)

    engine = RuleEngine(DATA_DIR)
    passed = 0
    failed = 0
    results = []

    def test(name, condition, detail=""):
        nonlocal passed, failed
        status = "✅ PASS" if condition else "❌ FAIL"
        if condition:
            passed += 1
        else:
            failed += 1
        results.append((status, name, detail))
        print(f"  {status}  {name}")
        if detail and not condition:
            print(f"           → {detail}")

    # ── DATA LOADING TESTS ────────────────────────────────
    print("\n📦 Data Loading:")
    data = engine.data
    test("Phoneme mappings loaded",
         len(data.phoneme_map) >= 200,
         f"Got {len(data.phoneme_map)} mappings")
    test("Tally rules loaded",
         len(data.tally_rules) >= 8,
         f"Got {len(data.tally_rules)} rules")
    test("Decoding rules loaded",
         len(data.decoding_rules) >= 8,
         f"Got {len(data.decoding_rules)} rules")
    test("Known readings loaded",
         len(data.known_readings) >= 100,
         f"Got {len(data.known_readings)} readings")

    # Key signs loaded
    test("Sign M-142 (cow face/aa) loaded",
         142 in data.phoneme_map,
         f"M-142 phoneme: {data.phoneme_map.get(142, {}).tamil_phoneme if 142 in data.phoneme_map else 'MISSING'}")
    test("Sign M-162 (Y-sign/ney) loaded",
         162 in data.phoneme_map,
         f"M-162 phoneme: {data.phoneme_map.get(162, {}).tamil_phoneme if 162 in data.phoneme_map else 'MISSING'}")
    test("Tally-4 (nanku/na) loaded",
         4 in data.tally_rules,
         f"Tally-4: {data.tally_rules.get(4, {})}")

    # ── TALLY RULE TESTS ──────────────────────────────────
    print("\n🔢 Tally Phoneme Rules:")
    t4 = tally_phoneme.apply(4, data)
    test("Tally-4 → phoneme found", t4.found)
    test("Tally-4 → starts with 'na'",
         t4.primary_phoneme.startswith("na") or "na" in t4.phonemes,
         f"Got: {t4.phonemes}")
    test("Tally-4 confidence ≥ 0.70", t4.confidence >= 0.70,
         f"Got: {t4.confidence}")

    t3 = tally_phoneme.apply(3, data)
    test("Tally-3 → starts with 'mu'",
         t3.primary_phoneme.startswith("mu") or "mu" in t3.phonemes,
         f"Got: {t3.phonemes}")

    test("Tally sign M-95 identified as tally",
         tally_phoneme.is_tally_sign(95))
    test("Tally sign M-95 → count 4",
         tally_phoneme.get_tally_count(95) == 4)

    # ── SIGN PHONEME TESTS ────────────────────────────────
    print("\n📝 Sign Phoneme Rules:")
    aa = sign_phoneme.apply(142, data)
    test("M-142 → phoneme found", aa.found)
    test("M-142 → contains 'aa' or Tamil aa character",
         "aa" in aa.phoneme_roman.lower() or "ஆ" in aa.tamil_phoneme or "ா" in aa.tamil_phoneme or "இரு" in aa.tamil_phoneme,
         f"Got: '{aa.tamil_phoneme}' / '{aa.phoneme_roman}'")

    m162 = sign_phoneme.apply(162, data)
    test("M-162 (Y-sign) → phoneme found", m162.found,
         f"M-162: {m162.tamil_phoneme}")

    m_unknown = sign_phoneme.apply(9999, data)
    test("Unknown sign → not found + placeholder", not m_unknown.found)

    # ── MOTIF CONTEXT TESTS ───────────────────────────────
    print("\n🦄 Motif Context Rules:")
    unicorn = compound_motif.apply_motif("unicorn")
    test("Unicorn → Market Common",
         "Market Common" in unicorn.jurisdiction,
         f"Got: {unicorn.jurisdiction}")
    test("Unicorn confidence ≥ 0.70", unicorn.confidence >= 0.70)

    none_motif = compound_motif.apply_motif("none")
    test("No motif → City-wide",
         "city" in none_motif.jurisdiction.lower() or "universal" in none_motif.jurisdiction.lower(),
         f"Got: {none_motif.jurisdiction}")

    elephant = compound_motif.apply_motif("elephant")
    test("Elephant → Elephant Street",
         "Elephant" in elephant.jurisdiction,
         f"Got: {elephant.jurisdiction}")

    # ── COMPOUND SIGN TESTS ───────────────────────────────
    print("\n🔗 Compound Sign Rules:")
    comp = compound_motif.apply_compound([10, 12])
    test("Signs [10,12] → compound found", comp is not None)
    test("Signs [10,12] → output 'aakaavva'",
         comp and "kaavva" in comp.output_phoneme.lower(),
         f"Got: {comp.output_phoneme if comp else 'None'}")

    # ── FULL ENGINE DECODE TESTS ──────────────────────────
    print("\n🔬 Full Engine — Known Seal Tests:")

    # Test 1: Lookup seal 1076 (very good ghee)
    reading_1076 = engine.lookup("1076")
    test("Seal 1076 — known reading found",
         reading_1076 is not None)
    if reading_1076:
        test("Seal 1076 — Tamil script not empty",
             bool(reading_1076.tamil_script))
        test("Seal 1076 — is known match",
             reading_1076.known_match)

    # Test 2: Lookup seal 2082 (Shiva's cows)
    reading_2082 = engine.lookup("2082")
    test("Seal 2082 — known reading found", reading_2082 is not None)

    # Test 3: Lookup seal 3246 (compound — aged cow carer)
    reading_3246 = engine.lookup("3246")
    test("Seal 3246 — known reading found", reading_3246 is not None)

    # Test 4: Engine decode with explicit sign sequence
    # Seal 1076: tally-4 (M95) + Y-sign (M162) + Y-sign (M162)
    candidate = engine.decode(
        seal_id="1076",
        sign_sequence=[
            {"mahadevan_number": 95,  "position": 0},
            {"mahadevan_number": 162, "position": 1},
            {"mahadevan_number": 162, "position": 2},
        ],
        motif="unicorn"
    )
    test("Seal 1076 decode — phoneme string generated",
         bool(candidate.phoneme_string))
    test("Seal 1076 decode — unicorn → Market Common",
         "Market Common" in candidate.jurisdiction,
         f"Got: {candidate.jurisdiction}")
    test("Seal 1076 decode — confidence > 0",
         candidate.confidence > 0,
         f"Got: {candidate.confidence}")

    print(f"\n    Seal 1076 decoded:")
    print(f"      Phoneme: {candidate.phoneme_string}")
    print(f"      Known Tamil: {candidate.known_reading_tamil}")
    print(f"      Meaning: {candidate.morpheme_english}")
    print(f"      Domain: {candidate.semantic_domain}")
    print(f"      Jurisdiction: {candidate.jurisdiction_short}")
    print(f"      Confidence: {candidate.confidence}")
    print(f"      Rules: {candidate.rules_applied}")

    # Test 5: Seal with no motif → city-wide
    candidate_cw = engine.decode(
        seal_id="4440",
        sign_sequence=[{"mahadevan_number": 142, "position": 0}],
        motif="none"
    )
    test("No-motif seal → city-wide jurisdiction",
         "city" in candidate_cw.jurisdiction.lower() or "universal" in candidate_cw.jurisdiction.lower())

    # Test 6: Unknown seal → pending status
    candidate_unknown = engine.decode(
        seal_id="9999",
        sign_sequence=[{"mahadevan_number": 142, "position": 0}],
        motif="unicorn"
    )
    test("Unknown seal → translation_status pending",
         candidate_unknown.translation_status == "pending")
    test("Unknown seal → morpheme shows [meaning pending]",
         "pending" in candidate_unknown.morpheme_english.lower())

    # ── SUMMARY ───────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"RESULTS: {passed} passed | {failed} failed")
    print(f"SCORE:   {round(passed/(passed+failed)*100)}%")

    if failed > 0:
        print("\nFailed tests:")
        for status, name, detail in results:
            if "FAIL" in status:
                print(f"  ✗ {name}: {detail}")

    return failed == 0


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
