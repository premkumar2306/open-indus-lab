-- Open Indus Lab: Two-Layer Reading Schema
-- Migration: 0002_two_layer_readings

ALTER TABLE readings 
  ADD COLUMN IF NOT EXISTS tamil_script          TEXT,
  ADD COLUMN IF NOT EXISTS phoneme_roman         VARCHAR(500),
  ADD COLUMN IF NOT EXISTS phoneme_ipa           VARCHAR(500),
  ADD COLUMN IF NOT EXISTS morpheme_english      TEXT,
  ADD COLUMN IF NOT EXISTS morpheme_tamil_gloss  TEXT,
  ADD COLUMN IF NOT EXISTS translation_status    VARCHAR(20) DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS ix_readings_translation_status 
  ON readings(translation_status);

-- Migrate existing readings_VPS2024 data
UPDATE readings SET translation_status = 'complete' 
WHERE morpheme_english IS NOT NULL 
  AND morpheme_english != '';

COMMENT ON COLUMN readings.tamil_script IS 
  'Layer 1: Original Tamil script reading';
COMMENT ON COLUMN readings.phoneme_roman IS 
  'Layer 1: Auto-transliterated Roman phonemes (author-reviewable)';
COMMENT ON COLUMN readings.morpheme_english IS 
  'Layer 2: English meaning — human-added, may be pending';
COMMENT ON COLUMN readings.translation_status IS 
  'complete | pending | partial — drives UI badge display';
