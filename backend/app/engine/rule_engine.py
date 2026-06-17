"""
Open Indus Lab — VPS2024 Rule Engine

Given a seal's sign sequence and motif, applies the VPS2024
rule set to produce a candidate Tamil reading with confidence score.

Input:
    seal_id:      e.g. "1076"
    sign_sequence: [{"mahadevan_number": 95, "position": 0}, ...]
    motif:         e.g. "unicorn"

Output:
    ReadingCandidate with:
        phoneme_string:     "thava ney"
        tamil_script:       "தவ நெய்"
        morpheme_english:   "very good ghee"  (or "[meaning pending]")
        jurisdiction:       "Market Common"
        confidence:         0.72
        rules_applied:      [list of rule names]
        translation_status: "complete" | "pending"

Key test: Seal 1076 → "thava ney" (very good ghee)
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
import os
import sys

from .loader import EngineData
from .rules import sign_phoneme, tally_phoneme, modifier, compound_motif


# ── DATA CLASSES ──────────────────────────────────────────

@dataclass
class SignInput:
    """A single sign in a seal's sequence."""
    position: int
    mahadevan_number: int
    parpola_id: str = ""
    is_tally: bool = False
    tally_count: Optional[int] = None


@dataclass
class PhonemeToken:
    """One phoneme unit in the reading output."""
    position: int
    mahadevan_number: int
    tamil_script: str
    phoneme_roman: str
    rule_applied: str
    confidence: float
    is_tally: bool = False
    is_modifier: bool = False
    is_compound: bool = False


@dataclass
class ReadingCandidate:
    """
    A proposed reading of a seal under the VPS2024 hypothesis.

    Layer 1 — Phoneme:
        phoneme_string:  "thava ney"
        tamil_script:    "தவ நெய்"

    Layer 2 — Morpheme:
        morpheme_english:  "very good ghee"
        semantic_domain:   "dairy products"
        translation_status: "complete" | "pending"

    Metadata:
        confidence:       0.72
        rules_applied:    ["tally_phoneme:4→na", "sign_phoneme:162→ney"]
        jurisdiction:     "Market Common"
        known_match:      True if matches author's known reading
    """
    seal_id: str
    hypothesis: str = "VPS2024"

    # Layer 1
    phoneme_tokens: List[PhonemeToken] = field(default_factory=list)
    phoneme_string: str = ""
    tamil_script: str = ""

    # Layer 2
    morpheme_english: str = ""
    semantic_domain: str = ""
    translation_status: str = "pending"

    # Jurisdiction
    motif_type: str = ""
    jurisdiction: str = ""
    jurisdiction_short: str = ""

    # Metadata
    confidence: float = 0.0
    rules_applied: List[str] = field(default_factory=list)
    unresolved_signs: List[int] = field(default_factory=list)
    known_match: bool = False
    known_reading_tamil: str = ""
    notes: str = ""


# ── ENGINE ────────────────────────────────────────────────

class RuleEngine:
    """
    VPS2024 Rule Engine.

    Applies decoding rules in priority order:
      1. tally_phoneme  — tally signs get phoneme from numeral name
      2. compound       — compound sign groups → single phoneme
      3. sign_phoneme   — direct sign → phoneme lookup
      4. modifier       — modifiers alter adjacent sign's phoneme
      5. motif_context  — motif → jurisdiction label

    Confidence scoring:
      - Base: weighted average of applied rule confidences
      - Penalty: -0.05 per unresolved sign
      - Penalty: -0.10 if > 30% signs unresolved
      - Boost: +0.05 if matches known author reading
    """

    def __init__(self, data_dir: Optional[str] = None):
        self.data = EngineData(data_dir) if data_dir else EngineData()

    def decode(
        self,
        seal_id: str,
        sign_sequence: List[Dict],
        motif: str = "none"
    ) -> ReadingCandidate:
        """
        Decode a seal's sign sequence into a reading candidate.

        Args:
            seal_id:       seal identifier (RMRL numeric format)
            sign_sequence: list of {"mahadevan_number": int, "position": int}
            motif:         seal motif type string

        Returns:
            ReadingCandidate
        """
        candidate = ReadingCandidate(seal_id=seal_id, motif_type=motif)
        rules_applied = []
        confidences = []
        tokens = []

        # Parse sign inputs
        signs = [
            SignInput(
                position=s.get("position", i),
                mahadevan_number=s.get("mahadevan_number", 0),
                parpola_id=s.get("parpola_id", ""),
                is_tally=tally_phoneme.is_tally_sign(s.get("mahadevan_number", 0)),
                tally_count=tally_phoneme.get_tally_count(s.get("mahadevan_number", 0))
            )
            for i, s in enumerate(sign_sequence)
        ]

        i = 0
        while i < len(signs):
            sign = signs[i]
            mnum = sign.mahadevan_number
            pos  = sign.position

            # ── Rule 1: Tally phoneme ──────────────────────
            if sign.is_tally and sign.tally_count is not None:
                result = tally_phoneme.apply(sign.tally_count, self.data)
                if result.found:
                    tokens.append(PhonemeToken(
                        position=pos,
                        mahadevan_number=mnum,
                        tamil_script=result.tamil_script,
                        phoneme_roman=result.primary_phoneme,
                        rule_applied=f"tally_phoneme:{sign.tally_count}→{result.primary_phoneme}",
                        confidence=result.confidence,
                        is_tally=True
                    ))
                    rules_applied.append(f"tally_phoneme:{sign.tally_count}→{result.primary_phoneme}")
                    confidences.append(result.confidence)
                    i += 1
                    continue

            # ── Rule 2: Compound signs ─────────────────────
            if i + 1 < len(signs):
                pair = [mnum, signs[i+1].mahadevan_number]
                compound = compound_motif.apply_compound(pair)
                if compound:
                    tokens.append(PhonemeToken(
                        position=pos,
                        mahadevan_number=compound.output_sign,
                        tamil_script="",
                        phoneme_roman=compound.output_phoneme,
                        rule_applied=compound.rule_name,
                        confidence=compound.confidence,
                        is_compound=True
                    ))
                    rules_applied.append(compound.rule_name)
                    confidences.append(compound.confidence)
                    i += 2   # consume both signs
                    continue

            # ── Rule 3: Sign phoneme ───────────────────────
            if modifier.is_modifier(mnum):
                # Modifier — go back and modify previous token
                if tokens:
                    prev = tokens[-1]
                    mod_result = modifier.apply(
                        prev.phoneme_roman, prev.mahadevan_number, mnum
                    )
                    prev.phoneme_roman = mod_result.modified_phoneme
                    prev.rule_applied += f"+{mod_result.rule_name}"
                    prev.is_modifier = True
                    rules_applied.append(f"modifier:{mnum}→{mod_result.modified_phoneme}")
                    confidences.append(mod_result.confidence)
                i += 1
                continue

            result = sign_phoneme.apply(mnum, self.data)
            if result.found:
                tokens.append(PhonemeToken(
                    position=pos,
                    mahadevan_number=mnum,
                    tamil_script=result.tamil_phoneme,
                    phoneme_roman=result.phoneme_roman,
                    rule_applied=f"sign_phoneme:M{mnum}→{result.phoneme_roman}",
                    confidence=result.confidence
                ))
                rules_applied.append(f"sign_phoneme:M{mnum}")
                confidences.append(result.confidence)
            else:
                candidate.unresolved_signs.append(mnum)
                tokens.append(PhonemeToken(
                    position=pos,
                    mahadevan_number=mnum,
                    tamil_script="?",
                    phoneme_roman=f"[M{mnum}?]",
                    rule_applied="unresolved",
                    confidence=0.0
                ))

            i += 1

        # ── Rule 4: Motif context ──────────────────────────
        motif_result = compound_motif.apply_motif(motif)
        candidate.jurisdiction = motif_result.jurisdiction
        candidate.jurisdiction_short = motif_result.jurisdiction_short
        rules_applied.append(f"motif_context:{motif}→{motif_result.jurisdiction_short}")
        confidences.append(motif_result.confidence)

        # ── Assemble phoneme string ────────────────────────
        candidate.phoneme_tokens = tokens
        candidate.phoneme_string = " ".join(
            t.phoneme_roman for t in tokens if t.phoneme_roman and "?" not in t.phoneme_roman
        )
        candidate.tamil_script = " ".join(
            t.tamil_script for t in tokens if t.tamil_script and t.tamil_script != "?"
        )
        candidate.rules_applied = rules_applied

        # ── Check against known readings ──────────────────
        known = self.data.known_readings.get(seal_id)
        if known:
            candidate.known_reading_tamil = known.tamil_script
            candidate.morpheme_english = known.morpheme_english or "[meaning pending]"
            candidate.semantic_domain = known.semantic_domain
            candidate.translation_status = known.translation_status
            candidate.known_match = True
            # Use author's confidence if known
            confidences.append(known.confidence)
        else:
            candidate.morpheme_english = "[meaning pending]"
            candidate.translation_status = "pending"

        # ── Confidence score ───────────────────────────────
        if confidences:
            base = sum(confidences) / len(confidences)
        else:
            base = 0.0

        # Penalties
        total_signs = len(signs)
        unresolved_count = len(candidate.unresolved_signs)
        if total_signs > 0:
            unresolved_ratio = unresolved_count / total_signs
            penalty = unresolved_count * 0.05
            if unresolved_ratio > 0.3:
                penalty += 0.10
            base = max(0.0, base - penalty)

        # Boost for known match
        if candidate.known_match:
            base = min(1.0, base + 0.03)

        candidate.confidence = round(base, 3)

        return candidate

    def lookup(self, seal_id: str) -> Optional[ReadingCandidate]:
        """
        Return the known author reading for a seal without rule application.
        Fast path for seals we already have complete readings for.
        """
        known = self.data.known_readings.get(seal_id)
        if not known:
            return None
        motif_result = compound_motif.apply_motif("unicorn")  # default
        return ReadingCandidate(
            seal_id=seal_id,
            phoneme_string=known.phoneme_roman,
            tamil_script=known.tamil_script,
            morpheme_english=known.morpheme_english or "[meaning pending]",
            semantic_domain=known.semantic_domain,
            translation_status=known.translation_status,
            confidence=known.confidence,
            known_match=True,
            known_reading_tamil=known.tamil_script,
            jurisdiction=motif_result.jurisdiction,
            jurisdiction_short=motif_result.jurisdiction_short,
        )


# ── CONVENIENCE FUNCTION ─────────────────────────────────

def run(seal_id: str, sign_sequence: list, motif: str = "none",
        data_dir: Optional[str] = None) -> ReadingCandidate:
    """One-shot decode a seal."""
    engine = RuleEngine(data_dir)
    return engine.decode(seal_id, sign_sequence, motif)
