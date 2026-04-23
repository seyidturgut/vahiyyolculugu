// One-shot migration: wraps existing tafsir/event strings into
// { text, source, verified } shape so downstream UI can cite sources
// and mark unverified AI-authored content explicitly.
//
// Run once with: node scripts/migrate-quran-schema.mjs
// Idempotent: skips entries already in new shape.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, '../src/data/quranChronology.json');

const data = JSON.parse(readFileSync(jsonPath, 'utf8'));

const PENDING_SOURCE = {
  name: 'Doğrulama bekliyor',
  url: 'https://kuran.diyanet.gov.tr/',
};

function wrapTafsir(entry) {
  if (entry.tafsir && typeof entry.tafsir === 'object' && 'text' in entry.tafsir) {
    return entry.tafsir; // already migrated
  }
  const legacy = entry.tafsir ?? entry.context ?? { tr: '', en: '' };
  return {
    text: { tr: legacy.tr ?? '', en: legacy.en ?? '' },
    source: { ...PENDING_SOURCE },
    verified: false,
  };
}

function wrapEvent(entry) {
  if (entry.event && typeof entry.event === 'object' && 'text' in entry.event) {
    return entry.event;
  }
  const legacy = entry.event ?? { tr: '', en: '' };
  return {
    kind: 'general_context',
    text: { tr: legacy.tr ?? '', en: legacy.en ?? '' },
    source: { ...PENDING_SOURCE },
    verified: false,
  };
}

const migrated = data.map((entry) => ({
  ...entry,
  tafsir: wrapTafsir(entry),
  event: wrapEvent(entry),
}));

writeFileSync(jsonPath, JSON.stringify(migrated, null, 2) + '\n', 'utf8');
console.log(`Migrated ${migrated.length} surah entries.`);
