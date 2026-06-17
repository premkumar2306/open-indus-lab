"""
Rule: sign_phoneme

Maps a Mahadevan sign number directly to its Tamil phoneme.
Source: phoneme_mappings_author_full.csv (264 signs)

This is the most fundamental rule — the sign alphabet.
"""

from dataclasses import dataclass
from typing import Optional
from ..loader import EngineData


@dataclass
class SignPhonemeResult:
    mahadevan_number: int
    tamil_phoneme: str
    phoneme_roman: str
    confidence: float
    found: bool


def apply(mahadevan_number: int, data: EngineData) -> SignPhonemeResult:
    """
    Look up a single sign's phoneme value.

    Args:
        mahadevan_number: Mahadevan concordance number (e.g. 142)
        data: loaded engine data

    Returns:
        SignPhonemeResult with phoneme if found, empty result if not
    """
    mapping = data.phoneme_map.get(mahadevan_number)

    if not mapping:
        return SignPhonemeResult(
            mahadevan_number=mahadevan_number,
            tamil_phoneme="",
            phoneme_roman=f"[M{mahadevan_number}?]",
            confidence=0.0,
            found=False
        )

    # Base confidence from mapping; key signs have higher confidence
    KEY_SIGNS = {142, 162, 95, 104, 10, 12, 15, 216, 219, 220}
    base_conf = 0.75 if mahadevan_number in KEY_SIGNS else 0.65

    return SignPhonemeResult(
        mahadevan_number=mahadevan_number,
        tamil_phoneme=mapping.tamil_phoneme,
        phoneme_roman=mapping.phoneme_roman,
        confidence=base_conf,
        found=True
    )


def apply_sequence(mahadevan_numbers: list, data: EngineData) -> list:
    """Apply sign_phoneme rule to a sequence of sign numbers."""
    return [apply(n, data) for n in mahadevan_numbers]
