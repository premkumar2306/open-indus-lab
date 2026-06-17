"""
Rule: modifier

Modifiers have form but NO independent sound.
They modify the phoneme of adjacent signs.

Two types:
  1. Vowel modifier — changes the vowel of a preceding consonant sign
     e.g. sign-216 (sa) + vowel-e modifier → sign-219 (si)
          sign-219 (si) + suffix modifier  → sign-220 (sivam/sivan)

  2. Suffix modifier — adds Tamil grammatical endings
     -am, -an, -al, -ar, -aar, -van, -val

Source: paper p.5 "The Mechanism of Modifiers"
Key quote: "Modifiers possess name and form but no sound of their own.
They preserve the Tamizi/Tamil system where the modifier keeps the
consonant form constant while producing varied syllabic sounds."
"""

from dataclasses import dataclass, field
from typing import Optional, List


@dataclass
class ModifierResult:
    base_sign: int
    modifier_sign: int
    base_phoneme: str
    modified_phoneme: str
    modification_type: str    # vowel | suffix
    suffix_added: str
    confidence: float
    rule_name: str


# Known modifier chains from the paper
# Format: (base_sign, modifier_sign) → modified_phoneme
MODIFIER_CHAINS = {
    (216, None):  ("sa",    "vowel_base"),    # sign-216 base = "sa"
    (216, 219):   ("si",    "vowel_e"),       # sa + e-modifier = si
    (219, 220):   ("sivam", "suffix_am"),     # si + suffix-am = sivam/sivan
}

# Suffix modifiers — sign numbers that add grammatical endings
SUFFIX_MODIFIER_SIGNS = {
    # From Research Keys: suffix modifier adds -am, -an, -al, -ar
    # These are approximate — author to confirm exact Mahadevan numbers
    140: "-am/-an/-al/-ar",   # irutha suffix variants
    143: "-am/-an/-al/-ar",   # iruthatam variants
    164: "-am/-an/-al/-ar",   # ya suffix variants
    308: "-am/-an/-al/-ar",   # ma suffix variants
}

# Vowel modifier signs (alter vowel of preceding consonant)
VOWEL_MODIFIER_SIGNS = {
    # These add specific vowels to preceding consonant
    # Approximate — derived from sign chain analysis
    219: "i",     # adds i-vowel (sa → si)
    229: "ii",    # adds ii-vowel
}


def is_modifier(mahadevan_number: int) -> bool:
    return (mahadevan_number in SUFFIX_MODIFIER_SIGNS or
            mahadevan_number in VOWEL_MODIFIER_SIGNS)


def apply(base_phoneme: str, base_sign: int,
          modifier_sign: int, data=None) -> ModifierResult:
    """
    Apply a modifier to a base sign's phoneme.

    Args:
        base_phoneme: the phoneme of the sign being modified
        base_sign: Mahadevan number of the base sign
        modifier_sign: Mahadevan number of the modifier
        data: engine data (optional)

    Returns:
        ModifierResult with modified phoneme
    """
    # Check known chains first
    chain_key = (base_sign, modifier_sign)
    if chain_key in MODIFIER_CHAINS:
        modified, mod_type = MODIFIER_CHAINS[chain_key]
        return ModifierResult(
            base_sign=base_sign,
            modifier_sign=modifier_sign,
            base_phoneme=base_phoneme,
            modified_phoneme=modified,
            modification_type=mod_type.split("_")[0],
            suffix_added=mod_type.split("_")[1] if "_" in mod_type else "",
            confidence=0.70,
            rule_name=f"chain: M{base_sign}→M{modifier_sign}"
        )

    # Vowel modifier
    if modifier_sign in VOWEL_MODIFIER_SIGNS:
        vowel = VOWEL_MODIFIER_SIGNS[modifier_sign]
        # Strip existing vowel from base phoneme and add new one
        # Simple approach: take consonant part + new vowel
        consonant = base_phoneme.rstrip("aeiouAEIOU")
        modified = consonant + vowel if consonant else base_phoneme + vowel
        return ModifierResult(
            base_sign=base_sign,
            modifier_sign=modifier_sign,
            base_phoneme=base_phoneme,
            modified_phoneme=modified,
            modification_type="vowel",
            suffix_added=vowel,
            confidence=0.60,
            rule_name=f"vowel_modifier: +{vowel}"
        )

    # Suffix modifier
    if modifier_sign in SUFFIX_MODIFIER_SIGNS:
        suffix = SUFFIX_MODIFIER_SIGNS[modifier_sign]
        return ModifierResult(
            base_sign=base_sign,
            modifier_sign=modifier_sign,
            base_phoneme=base_phoneme,
            modified_phoneme=base_phoneme + suffix,
            modification_type="suffix",
            suffix_added=suffix,
            confidence=0.58,
            rule_name=f"suffix_modifier: +{suffix}"
        )

    # Unknown modifier — pass through with low confidence
    return ModifierResult(
        base_sign=base_sign,
        modifier_sign=modifier_sign,
        base_phoneme=base_phoneme,
        modified_phoneme=base_phoneme + "[mod?]",
        modification_type="unknown",
        suffix_added="",
        confidence=0.30,
        rule_name=f"unknown_modifier: M{modifier_sign}"
    )


def apply_suffix_variants(phoneme: str) -> List[str]:
    """
    Return all grammatical suffix variants for a phoneme.
    Used when a suffix modifier is present but suffix type is ambiguous.
    """
    suffixes = ["am", "an", "al", "ar", "aal", "van", "val", "vam"]
    return [phoneme + s for s in suffixes]
