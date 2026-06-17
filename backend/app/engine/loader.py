"""
Open Indus Lab — Engine Data Loader

Loads all seed CSVs into memory for the rule engine.
Works from CSV files directly (no DB required for Stage 3).
In Stage 4 this will be replaced by DB queries.
"""

import csv
import os
from dataclasses import dataclass, field
from typing import Dict, List, Optional

DATA_DIR = os.path.join(
    os.path.dirname(__file__),
    "../../../../data/seed"
)


@dataclass
class PhonemeMapping:
    mahadevan_number: int
    tamil_phoneme: str        # Tamil script: "ஆ"
    phoneme_roman: str        # Derived Roman: "aa"
    hypothesis: str


@dataclass
class TallyRule:
    tally_count: int
    phonemes: str             # "na, naa"
    tamil_script: str
    tamil_name: str
    example_seals: List[str]
    notes: str


@dataclass
class DecodingRule:
    rule_type: str            # sign_phoneme | tally_phoneme | modifier | compound | motif_context
    name: str
    priority: int
    input_signs: List[str]    # Parpola IDs
    input_tally_count: Optional[int]
    output_phoneme: str
    output_morpheme: str
    confidence: float
    rationale: str


@dataclass
class KnownReading:
    seal_id: str
    tamil_script: str
    phoneme_roman: str
    morpheme_english: str
    semantic_domain: str
    translation_status: str
    confidence: float


class EngineData:
    """All data needed by the rule engine, loaded from CSVs once."""

    def __init__(self, data_dir: str = DATA_DIR):
        self.data_dir = data_dir
        self.phoneme_map: Dict[int, PhonemeMapping] = {}    # mahadevan_number → mapping
        self.tally_rules: Dict[int, TallyRule] = {}          # tally_count → rule
        self.decoding_rules: List[DecodingRule] = []
        self.known_readings: Dict[str, KnownReading] = {}   # seal_id → reading
        self._load()

    def _path(self, filename: str) -> str:
        return os.path.join(self.data_dir, filename)

    def _load(self):
        self._load_phoneme_mappings()
        self._load_tally_rules()
        self._load_decoding_rules()
        self._load_known_readings()

    def _tamil_to_roman(self, text: str) -> str:
        """Convert Tamil script to Roman phoneme string."""
        vowels = {
            'அ':'a','ஆ':'aa','இ':'i','ஈ':'ii','உ':'u','ஊ':'uu',
            'எ':'e','ஏ':'ee','ஐ':'ai','ஒ':'o','ஓ':'oo','ஔ':'au'
        }
        consonants = {
            'க':'k','ங':'ng','ச':'ch','ஞ':'ny','ட':'t','ண':'N',
            'த':'th','ந':'n','ப':'p','ம':'m','ய':'y','ர':'r',
            'ல':'l','வ':'v','ழ':'zh','ள':'L','ற':'R','ன':'n',
            'ஜ':'j','ஷ':'sh','ஸ':'s','ஹ':'h'
        }
        markers = {
            'ா':'aa','ி':'i','ீ':'ii','ு':'u','ூ':'uu',
            'ெ':'e','ே':'ee','ை':'ai','ொ':'o','ோ':'oo','ௌ':'au',
            '்':''
        }
        result = []
        i = 0
        while i < len(text):
            c = text[i]
            if c in consonants:
                base = consonants[c]
                if i + 1 < len(text) and text[i+1] in markers:
                    result.append(base + markers[text[i+1]])
                    i += 2
                    continue
                else:
                    result.append(base + 'a')
            elif c in vowels:
                result.append(vowels[c])
            elif c in markers:
                result.append(markers[c])
            else:
                result.append(c)
            i += 1
        import re
        return re.sub(r' +', ' ', ''.join(result)).strip()

    def _load_phoneme_mappings(self):
        path = self._path("phoneme_mappings_author_full.csv")
        with open(path, encoding="utf-8") as f:
            for row in csv.DictReader(f):
                try:
                    num = int(row["mahadevan_number"])
                    tamil = row["tamil_phoneme"].strip()
                    roman = self._tamil_to_roman(tamil)
                    self.phoneme_map[num] = PhonemeMapping(
                        mahadevan_number=num,
                        tamil_phoneme=tamil,
                        phoneme_roman=roman,
                        hypothesis=row.get("hypothesis", "VPS2024")
                    )
                except (ValueError, KeyError):
                    pass

    def _load_tally_rules(self):
        path = self._path("tally_mark_rules.csv")
        with open(path, encoding="utf-8") as f:
            for row in csv.DictReader(f):
                try:
                    count = int(row["tally_count"])
                    seals = [s.strip() for s in row.get("example_seal","").split(",") if s.strip()]
                    self.tally_rules[count] = TallyRule(
                        tally_count=count,
                        phonemes=row["phonemes"],
                        tamil_script=row["tamil_script"],
                        tamil_name=row["tamil_name"],
                        example_seals=seals,
                        notes=row.get("notes","")
                    )
                except (ValueError, KeyError):
                    pass

    def _load_decoding_rules(self):
        path = self._path("decoding_rules_VPS2024.csv")
        with open(path, encoding="utf-8") as f:
            for row in csv.DictReader(f):
                try:
                    signs = [s.strip() for s in row.get("input_parpola_signs","").split(",") if s.strip()]
                    tally = None
                    if row.get("input_tally_count","").strip():
                        tally = int(row["input_tally_count"])
                    self.decoding_rules.append(DecodingRule(
                        rule_type=row["rule_type"],
                        name=row["name"],
                        priority=int(row.get("priority", 10)),
                        input_signs=signs,
                        input_tally_count=tally,
                        output_phoneme=row.get("output_phoneme",""),
                        output_morpheme=row.get("output_morpheme",""),
                        confidence=float(row.get("confidence", 0.5)),
                        rationale=row.get("rationale","")
                    ))
                except (ValueError, KeyError):
                    pass
        self.decoding_rules.sort(key=lambda r: r.priority)

    def _load_known_readings(self):
        path = self._path("readings_enriched_VPS2024.csv")
        with open(path, encoding="utf-8") as f:
            for row in csv.DictReader(f):
                sid = row["seal_id"].strip()
                self.known_readings[sid] = KnownReading(
                    seal_id=sid,
                    tamil_script=row.get("tamil_script",""),
                    phoneme_roman=row.get("phoneme_roman",""),
                    morpheme_english=row.get("morpheme_english",""),
                    semantic_domain=row.get("semantic_domain",""),
                    translation_status=row.get("translation_status","pending"),
                    confidence=float(row.get("confidence", 0.65))
                )
