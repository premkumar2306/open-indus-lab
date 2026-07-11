#!/usr/bin/env python3
"""
tamil_kombu_fix.py — repair Tamil text corrupted by PDF font extraction.

ROOT CAUSE (diagnosed by the author, Ponmuthu Shanmugham, 2026-07-10):
PDF text extraction mishandles the Tamil kombu vowel signs, which are
written BEFORE the consonant they modify:

  ஒற்றைக் கொம்பு (single kombu, ெ)  — glyph-swapped with வ
  இரட்டைக் கொம்பு (double kombu, ே) — extracted as a spurious க prefix
  இணைக் கொம்பு  (paired kombu, ொ/ோ) — split around the consonant
  ஐகார ை                            — extracted as ம

DECODED RULES (each confirmed against the author's corrections):
  ெX (visual order)  -> Xெ ; ெ<->வ swap:  காவ்ெ -> காவ்வ, சிெம் -> சிவம்
  ேX -> Xே  (ே appears as க):            ககாயில் -> கோயில், கமற்படி -> மேற்படி
  ைX -> Xை  (ை appears as ம):            அளமெ -> அளவை, வெண்மம -> வெண்மை
  ொ/ோ split:                             வதாழு -> தொழு, கமார் -> மோர்

Usage:
  python3 scripts/tamil_kombu_fix.py <file.csv> [column]   # fix in place
  python3 scripts/tamil_kombu_fix.py --scan <path>          # report only
"""
import sys, re, glob, os

# Author-confirmed word-level corrections (exact, safest — applied first)
CONFIRMED = {
    "ககாயில்": "கோயில்",  "ககாழி": "கோழி",   "சிெம்": "சிவம்",
    "சிென்": "சிவன்",     "வதாண்டு": "தொண்டு", "வதாழு": "தொழு",
    "கமற்படி": "மேற்படி", "கமற்ப்டி": "மேற்படி", "கமார்": "மோர்",
    "கெலி": "வேலி",       "அளமெ": "அளவை",     "வெண்மம": "வெண்மை",
    "காவ்ெ": "காவ்வ",     "ஆகாவ்ெ": "ஆகாவ்வ",  "வ்ெ": "வ்வ",
}

VOWEL_SIGNS = "".join(chr(c) for c in range(0x0BBE, 0x0BCE))

def fix(text: str) -> str:
    for bad, good in CONFIRMED.items():
        text = text.replace(bad, good)
    # rejoin consonant + spurious space + dependent vowel sign
    text = re.sub(r"\s+([" + VOWEL_SIGNS + r"])", r"\1", text)
    return text

def scan(path: str):
    hits = []
    for f in glob.glob(os.path.join(path, "**", "*.*"), recursive=True):
        if not f.endswith((".csv", ".json", ".md", ".jsx", ".txt")):
            continue
        try:
            t = open(f, encoding="utf-8").read()
        except Exception:
            continue
        found = [tok for tok in CONFIRMED if tok in t]
        if found:
            hits.append((f, found))
    return hits

if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "--scan":
        for f, toks in scan(sys.argv[2]):
            print(f"{f}: {', '.join(toks)}")
        sys.exit(0)
    if len(sys.argv) >= 2:
        p = sys.argv[1]
        t = open(p, encoding="utf-8").read()
        t2 = fix(t)
        open(p, "w", encoding="utf-8").write(t2)
        print(f"{p}: {'fixed' if t2 != t else 'already clean'}")
