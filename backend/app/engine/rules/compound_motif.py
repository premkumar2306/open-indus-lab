"""
Rule: compound + motif_context

COMPOUND: Two or more signs fused into one integrated sign.
    Signs 10 + 12 → sign 15 (aakaavva = cow carer)
    Documented in seal 3246.

MOTIF: Seal iconographic motif as jurisdictional identifier.
    Unicorn  → Market Common (commercial plaza)
    Elephant → Elephant Street (ghee, sesame oil)
    Bull     → Bull Street (milk, oxen)
    Gharial  → Riverine district
    None     → City-wide ordinance (universal)
"""

from dataclasses import dataclass
from typing import List, Optional, Dict


# ── COMPOUND RULES ────────────────────────────────────────

@dataclass
class CompoundResult:
    input_signs: List[int]
    output_sign: int
    output_phoneme: str
    output_meaning: str
    confidence: float
    rule_name: str


# Known compound integrations from the paper
# Format: frozenset(input_signs) → (output_sign, phoneme, meaning)
COMPOUND_MAP: Dict[frozenset, tuple] = {
    frozenset({10, 12}): (15,  "aakaavva",  "cow carer / guardian"),
    frozenset({10}):     (10,  "kaa",        "to guard / protect"),
    frozenset({12}):     (12,  "kaavva",     "guardian"),
}


def apply_compound(sign_numbers: List[int]) -> Optional[CompoundResult]:
    """
    Check if a set of adjacent signs form a known compound.

    Args:
        sign_numbers: list of Mahadevan numbers to check

    Returns:
        CompoundResult if a compound match found, None otherwise
    """
    key = frozenset(sign_numbers)
    match = COMPOUND_MAP.get(key)

    if match:
        output_sign, phoneme, meaning = match
        return CompoundResult(
            input_signs=sign_numbers,
            output_sign=output_sign,
            output_phoneme=phoneme,
            output_meaning=meaning,
            confidence=0.70,
            rule_name=f"compound: {sign_numbers} → M{output_sign}"
        )

    # Check subsets
    for signs_key, (output_sign, phoneme, meaning) in COMPOUND_MAP.items():
        if signs_key.issubset(set(sign_numbers)):
            return CompoundResult(
                input_signs=list(signs_key),
                output_sign=output_sign,
                output_phoneme=phoneme,
                output_meaning=meaning,
                confidence=0.60,
                rule_name=f"partial_compound: {list(signs_key)} → M{output_sign}"
            )

    return None


# ── MOTIF CONTEXT RULES ───────────────────────────────────

@dataclass
class MotifResult:
    motif_type: str
    jurisdiction: str
    jurisdiction_short: str
    description: str
    confidence: float
    examples: List[str]


MOTIF_JURISDICTIONS = {
    "unicorn": MotifResult(
        motif_type="unicorn",
        jurisdiction="Market Common (commercial plaza and administrative centre)",
        jurisdiction_short="Market Common",
        description=(
            "Unicorn = emblem of the central commercial plaza. "
            "~60% of all iconographic seals. Consistently features: "
            "dairy products, cattle, governance, laws, facility management."
        ),
        confidence=0.72,
        examples=["3023", "2358", "1076", "2082", "1045", "1110", "2617"]
    ),
    "elephant": MotifResult(
        motif_type="elephant",
        jurisdiction="Elephant Street (ghee shed, sesame oil producer)",
        jurisdiction_short="Elephant Street",
        description="Elephant Street district. Associated with ghee sheds and sesame oil production.",
        confidence=0.67,
        examples=["2648", "2127"]
    ),
    "bull": MotifResult(
        motif_type="bull",
        jurisdiction="Bull Street (milk, oxen, market banners)",
        jurisdiction_short="Bull Street",
        description="Bull Street district. Fresh milk, ox pens, market banners.",
        confidence=0.65,
        examples=["2234"]
    ),
    "zebu": MotifResult(
        motif_type="zebu",
        jurisdiction="Zebu/High-value Cattle District",
        jurisdiction_short="Zebu District",
        description="High-value cattle district. Zebu and tiger associated.",
        confidence=0.63,
        examples=[]
    ),
    "tiger": MotifResult(
        motif_type="tiger",
        jurisdiction="High-value Cattle District",
        jurisdiction_short="Tiger District",
        description="High-value cattle sheds. Premium livestock.",
        confidence=0.62,
        examples=["1386"]
    ),
    "gharial": MotifResult(
        motif_type="gharial",
        jurisdiction="Riverine Facilities District",
        jurisdiction_short="Riverine District",
        description="River-adjacent district. Laws governing river facility usage.",
        confidence=0.65,
        examples=["2864"]
    ),
    "composite": MotifResult(
        motif_type="composite",
        jurisdiction="Multi-District (combined jurisdictions)",
        jurisdiction_short="Multi-District",
        description="Composite motif = multiple street/district identifiers combined.",
        confidence=0.58,
        examples=["1386"]
    ),
    "none": MotifResult(
        motif_type="none",
        jurisdiction="City-wide (universal ordinance — not location-restricted)",
        jurisdiction_short="City-wide",
        description=(
            "No motif = applies to entire city domain. "
            "Includes: curfews, guild laws, skill certifications, "
            "elder care, children's food mandates."
        ),
        confidence=0.68,
        examples=["4440", "4371", "4284", "1425", "4718"]
    ),
}


def apply_motif(motif_type: str) -> MotifResult:
    """
    Get the jurisdictional context for a seal's motif.

    Args:
        motif_type: string e.g. "unicorn", "elephant", "none"

    Returns:
        MotifResult with jurisdiction and confidence
    """
    motif_key = motif_type.lower().strip() if motif_type else "none"
    return MOTIF_JURISDICTIONS.get(
        motif_key,
        MotifResult(
            motif_type=motif_key,
            jurisdiction="Unknown jurisdiction",
            jurisdiction_short="Unknown",
            description="Motif not yet mapped to a jurisdiction.",
            confidence=0.30,
            examples=[]
        )
    )
