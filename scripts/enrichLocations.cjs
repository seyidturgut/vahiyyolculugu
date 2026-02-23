const fs = require('fs');

const LOCATIONS = {
    hira: { name: { tr: 'Hira Mağarası', en: 'Cave of Hira' }, coords: [2, 4, 2] },
    mecca: { name: { tr: 'Mekke', en: 'Makkah' }, coords: [0, 0, 0] },
    medina: { name: { tr: 'Medine', en: 'Madinah' }, coords: [28, 0, 8] },
    miraj: { name: { tr: 'Miraç (Gökyüzü)', en: 'Al-Miraj (Heavens)' }, coords: [0, 12, 0] },
    taif: { name: { tr: 'Taif', en: 'Ta\'if' }, coords: [-8, 2, 12] },
    badr: { name: { tr: 'Bedir', en: 'Badr' }, coords: [20, 0, -6] },
    uhud: { name: { tr: 'Uhud', en: 'Uhud' }, coords: [24, 3, -4] },
    khandaq: { name: { tr: 'Hendek', en: 'Trench' }, coords: [26, 0, 6] },
    hudaybiya: { name: { tr: 'Hudeybiye', en: 'Hudaybiyyah' }, coords: [8, 0, -8] },
    sinai: { name: { tr: 'Tur Dağı', en: 'Mount Sinai' }, coords: [-15, 5, -15] },
};

const locationMap = [
    LOCATIONS.hira,    // 1  - Alak
    LOCATIONS.mecca,   // 2  - Kalem
    LOCATIONS.mecca,   // 3  - Müzzemmil
    LOCATIONS.mecca,   // 4  - Müddessir
    LOCATIONS.mecca,   // 5  - Fatiha
    LOCATIONS.mecca,   // 6  - Tebbet
    LOCATIONS.mecca,   // 7  - Tekvir
    LOCATIONS.mecca,   // 8  - A'la
    LOCATIONS.mecca,   // 9  - Leyl
    LOCATIONS.mecca,   // 10 - Fecr
    LOCATIONS.mecca,   // 11 - Duha
    LOCATIONS.mecca,   // 12 - İnşirah
    LOCATIONS.mecca,   // 13 - Asr
    LOCATIONS.mecca,   // 14 - Adiyat
    LOCATIONS.mecca,   // 15 - Kevser
    LOCATIONS.mecca,   // 16 - Tekasür
    LOCATIONS.mecca,   // 17 - Maun
    LOCATIONS.mecca,   // 18 - Kafiroon
    LOCATIONS.mecca,   // 19 - Feel
    LOCATIONS.mecca,   // 20 - Felak
    LOCATIONS.mecca,   // 21 - Nas
    LOCATIONS.mecca,   // 22 - İhlas
    LOCATIONS.miraj,   // 23 - Necm (Mi'raj vizyonu)
    LOCATIONS.mecca,   // 24 - Abese
    LOCATIONS.mecca,   // 25 - Kadir
    LOCATIONS.mecca,   // 26 - Şems
    LOCATIONS.mecca,   // 27 - Buruc
    LOCATIONS.mecca,   // 28 - Tin
    LOCATIONS.mecca,   // 29 - Kureyş
    LOCATIONS.mecca,   // 30 - Karia
    LOCATIONS.mecca,   // 31 - Kıyamet
    LOCATIONS.mecca,   // 32 - Hümeze
    LOCATIONS.mecca,   // 33 - Mürselat
    LOCATIONS.mecca,   // 34 - Kaf
    LOCATIONS.mecca,   // 35 - Beled
    LOCATIONS.mecca,   // 36 - Tarık
    LOCATIONS.mecca,   // 37 - Kamer
    LOCATIONS.mecca,   // 38 - Sad
    LOCATIONS.mecca,   // 39 - A'raf
    LOCATIONS.mecca,   // 40 - Cin
    LOCATIONS.mecca,   // 41 - Ya Sin
    LOCATIONS.mecca,   // 42 - Furkan
    LOCATIONS.mecca,   // 43 - Fatır
    LOCATIONS.mecca,   // 44 - Meryem (Habeşistan göçü öncesi)
    LOCATIONS.mecca,   // 45 - Ta-Ha
    LOCATIONS.mecca,   // 46 - Vakıa
    LOCATIONS.mecca,   // 47 - Şuara
    LOCATIONS.mecca,   // 48 - Neml
    LOCATIONS.mecca,   // 49 - Kasas
    LOCATIONS.miraj,   // 50 - İsra (Miraç)
    LOCATIONS.mecca,   // 51 - Yunus
    LOCATIONS.mecca,   // 52 - Hud
    LOCATIONS.mecca,   // 53 - Yusuf
    LOCATIONS.mecca,   // 54 - Hicr
    LOCATIONS.mecca,   // 55 - En'am
    LOCATIONS.mecca,   // 56 - Saffat
    LOCATIONS.mecca,   // 57 - Lokman
    LOCATIONS.mecca,   // 58 - Sebe
    LOCATIONS.mecca,   // 59 - Zümer
    LOCATIONS.mecca,   // 60 - Mümin
    LOCATIONS.mecca,   // 61 - Fussilet
    LOCATIONS.mecca,   // 62 - Şura
    LOCATIONS.mecca,   // 63 - Zuhruf
    LOCATIONS.mecca,   // 64 - Duhan
    LOCATIONS.mecca,   // 65 - Casiye
    LOCATIONS.mecca,   // 66 - Ahkaf
    LOCATIONS.mecca,   // 67 - Zariyat
    LOCATIONS.mecca,   // 68 - Gaşiye
    LOCATIONS.mecca,   // 69 - Kehf
    LOCATIONS.mecca,   // 70 - Nahl
    LOCATIONS.mecca,   // 71 - Nuh
    LOCATIONS.mecca,   // 72 - İbrahim
    LOCATIONS.mecca,   // 73 - Enbiya
    LOCATIONS.mecca,   // 74 - Mü'minun
    LOCATIONS.mecca,   // 75 - Secde
    LOCATIONS.sinai,   // 76 - Tur (Sina)
    LOCATIONS.mecca,   // 77 - Mülk
    LOCATIONS.mecca,   // 78 - Hakka
    LOCATIONS.mecca,   // 79 - Mearic
    LOCATIONS.mecca,   // 80 - Nebe
    LOCATIONS.mecca,   // 81 - Naziat
    LOCATIONS.mecca,   // 82 - İnfitar
    LOCATIONS.mecca,   // 83 - İnşikak
    LOCATIONS.mecca,   // 84 - Rum
    LOCATIONS.mecca,   // 85 - Ankebut
    LOCATIONS.mecca,   // 86 - Mutaffifin
    LOCATIONS.medina,  // 87 - Bakara
    LOCATIONS.badr,    // 88 - Enfal (Bedir)
    LOCATIONS.uhud,    // 89 - Al-i İmran (Uhud)
    LOCATIONS.khandaq, // 90 - Ahzab (Hendek)
    LOCATIONS.hudaybiya,// 91 - Mümtehine
    LOCATIONS.medina,  // 92 - Nisa
    LOCATIONS.medina,  // 93 - Zilzal
    LOCATIONS.medina,  // 94 - Hadid
    LOCATIONS.badr,    // 95 - Muhammed (Bedir)
    LOCATIONS.medina,  // 96 - Ra'd
    LOCATIONS.medina,  // 97 - Rahman
    LOCATIONS.medina,  // 98 - İnsan
    LOCATIONS.medina,  // 99 - Talak
    LOCATIONS.medina,  // 100 - Beyyine
    LOCATIONS.medina,  // 101 - Haşr
    LOCATIONS.medina,  // 102 - Nur
    LOCATIONS.mecca,   // 103 - Hac
    LOCATIONS.medina,  // 104 - Münafikun
    LOCATIONS.medina,  // 105 - Mücadele
    LOCATIONS.medina,  // 106 - Hucurat
    LOCATIONS.medina,  // 107 - Tahrim
    LOCATIONS.medina,  // 108 - Tegabün
    LOCATIONS.medina,  // 109 - Saf
    LOCATIONS.medina,  // 110 - Cuma
    LOCATIONS.hudaybiya,// 111 - Fetih (Hudeybiye)
    LOCATIONS.medina,  // 112 - Maide
    LOCATIONS.mecca,   // 113 - Tevbe (Mekke Fethi)
    LOCATIONS.medina,  // 114 - Nasr
];

// Load current data
const currentData = JSON.parse(fs.readFileSync(__dirname + '/../src/data/quranChronology.json', 'utf-8'));

// Add location to each entry
const enriched = currentData.map((item, i) => ({
    ...item,
    location: locationMap[i] || LOCATIONS.mecca,
    coordinates: (locationMap[i] || LOCATIONS.mecca).coords,
}));

fs.writeFileSync(
    __dirname + '/../src/data/quranChronology.json',
    JSON.stringify(enriched, null, 2)
);
console.log(`✅ Enriched ${enriched.length} surahs with geographic locations`);
