export type LocalizedText = { tr: string; en: string };

export type SurahSource = {
  name: string;
  url?: string;
  accessedAt?: string;
};

export type TafsirContent = {
  text: LocalizedText;
  source: SurahSource;
  verified: boolean;
};

export type EventKind = 'asbab' | 'general_context';

export type EventContent = {
  kind: EventKind;
  text: LocalizedText;
  source: SurahSource;
  verified: boolean;
};

export type SurahLocation = {
  name: LocalizedText;
  coords: [number, number, number];
};

export type SurahName = {
  ar: string;
  en: string;
  tr: string;
};

export type Surah = {
  id: number;
  surahNumber: number;
  surahName: SurahName;
  period: 'Mekke' | 'Medine';
  year: string;
  revelationOrder: number;
  verses: string;
  event: EventContent;
  context?: LocalizedText;
  coordinates: [number, number, number];
  location: SurahLocation;
  tafsir: TafsirContent;
};
