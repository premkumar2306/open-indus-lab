"""
Rule: tally_phoneme

Tally marks in Indus script are NOT just counting —
they encode phonemes via Tamil numeral names.

    tally-3 → munRu → mu/muu
    tally-4 → nanku  → na/naa  → enables "ney" (ghee) when followed by Y-sign
    tally-6 → aaRu   → a/aa    → also means "river"
    tally-7 → eLzu   → e/ee

Source: Research Keys §2.40-2.60; tally_mark_rules.csv
Key paper quote: "The tally marks are not just counting strokes.
They are phonetic placeholders that carry the initial sound
of the Tamil numeral name."
"""

from dataclasses import dataclass, field
from typing import List, Optional
from ..loader import EngineData, TallyRule


@dataclass
class TallyPhonemeResult:
    tally_count: int
    phonemes: List[str]       # e.g. ["na", "naa"] — short and long forms
    primary_phoneme: str      # the most common form
    tamil_script: str
    tamil_name: str
    confidence: float
    found: bool
    notes: str = ""


# Tally signs by Mahadevan number
# These signs ARE tally marks (single strokes, groups)
TALLY_SIGN_NUMBERS = {
    86: 1,   # onRu (one)
    87: 2,   # iru (two)
    88: 2,   # iru variant
    89: 3,   # munRu (three)
    90: 3,   # muu variant
    102: 3,  # munRu variant
    103: 3,  # munRu variant
    95: 4,   # nanku (four)
    104: 4,  # nanku variant
    96: 5,   # aintu (five)
    97: 1,   # oor variant
    98: 1,   # oor variant
    99: 2,   # iru variant
    100: 2,  # iru variant
    101: 2,  # iru variant
    105: 4,  # nanku variant
    106: 5,  # aintu variant
    107: 5,  # aintu variant
    108: 6,  # aaRu (six)
    109: 6,  # aaRu/river
    110: 7,  # eLzu (seven)
    112: 7,  # eLzu variant
    111: 7,  # eLzhuTTa variant
    113: 7,  # eLzhuTTa variant
    114: 8,  # ettu (eight)
    115: 9,  # toNdu (nine)
    116: 9,  # toNdu variant
    117: 9,  # toNdup variant
    121: 12, # panniru (twelve)
    122: 12, # panniru variant
}


def is_tally_sign(mahadevan_number: int) -> bool:
    return mahadevan_number in TALLY_SIGN_NUMBERS


def get_tally_count(mahadevan_number: int) -> Optional[int]:
    return TALLY_SIGN_NUMBERS.get(mahadevan_number)


def apply(tally_count: int, data: EngineData) -> TallyPhonemeResult:
    """
    Convert a tally count to its phoneme(s) via Tamil numeral name.

    Args:
        tally_count: integer count of tally marks (1-12)
        data: loaded engine data

    Returns:
        TallyPhonemeResult with phoneme options
    """
    rule = data.tally_rules.get(tally_count)

    if not rule:
        return TallyPhonemeResult(
            tally_count=tally_count,
            phonemes=[],
            primary_phoneme=f"[tally-{tally_count}?]",
            tamil_script="",
            tamil_name="",
            confidence=0.0,
            found=False
        )

    # Parse phoneme options e.g. "na, naa" → ["na", "naa"]
    phoneme_options = [p.strip() for p in rule.phonemes.split(",") if p.strip()]
    primary = phoneme_options[0] if phoneme_options else ""

    # Key tallies (4 and 3) have higher confidence — well documented
    KEY_TALLIES = {3, 4, 6, 7}
    confidence = 0.73 if tally_count in KEY_TALLIES else 0.60

    return TallyPhonemeResult(
        tally_count=tally_count,
        phonemes=phoneme_options,
        primary_phoneme=primary,
        tamil_script=rule.tamil_script,
        tamil_name=rule.tamil_name,
        confidence=confidence,
        found=True,
        notes=rule.notes
    )


def apply_from_sign(mahadevan_number: int, data: EngineData) -> Optional[TallyPhonemeResult]:
    """Apply tally rule given a Mahadevan sign number."""
    count = get_tally_count(mahadevan_number)
    if count is None:
        return None
    return apply(count, data)
