# Vahiy Yolculuğu (Revelation Journey)

React + TypeScript + Vite ile geliştirilmiş; 114 Kur'an suresinin iniş kronolojisini 3D atlas ve zaman tüneli olarak sunan interaktif uygulama.

## İçerik Kaynakları ve Doğrulama Durumu

Sure "Tefsir" (Sureyi Anlat) ve "İniş Sebebi / Genel Nüzul Bağlamı" alanları, dini içeriğin sahihliği açısından **Türkiye Diyanet Vakfı İslâm Ansiklopedisi** (`https://islamansiklopedisi.org.tr/`) sure maddelerinden özetlenir; ikincil çapraz referans olarak **Diyanet İşleri Başkanlığı — Kur'an Yolu Tefsiri** (`https://kuran.diyanet.gov.tr/`) ve esbâb-ı nüzul için Vâhidî'nin *Esbâbü'n-Nüzûl* eseri kullanılır. Her özet, kaynağın yazarı ve URL'i ile atıflandırılır.

**İngilizce metinler hakkında:** TDV İslâm Ansiklopedisi yalnızca Türkçe yayımlanır; resmî İngilizce baskısı yoktur. Bu sebeple `tafsir.text.en` ve `event.text.en` alanları, ilgili kaynak maddesinden alınan **Türkçe özetin sadakatli çevirisi**dir — doğrudan bir İngilizce kaynaktan alıntı değildir. Kaynak atfı (`source.name`, `source.url`) Türkçe orijinale işaret eder.

### Veri Şeması

Her sure kaydındaki `tafsir` ve `event` alanları kaynak atfı taşır (bkz. [src/types/surah.ts](src/types/surah.ts)):

```ts
tafsir: { text: {tr, en}, source: { name, url, accessedAt? }, verified: boolean }
event:  { kind: 'asbab' | 'general_context', text: {tr, en}, source: {...}, verified: boolean }
```

- `verified: true` → içerik Diyanet kaynağından elle özetlenmiş, kaynak URL'i doğrudur.
- `verified: false` → içerik henüz doğrulanmamış (mevcut eski metinler); UI'da **"Doğrulanmamış — Diyanet kaynağıyla güncelleniyor"** uyarısı gösterilir.
- `event.kind: 'asbab'` → klasik bir sebeb-i nüzul rivayeti vardır; UI başlığı "İniş Sebebi" olur.
- `event.kind: 'general_context'` → spesifik rivayet yok; UI başlığı "Genel Nüzul Bağlamı" olur, Mekki/Medeni dönem bağlamı verilir.

### Manuel Küratörlük İş Akışı

Her sure kaydı için:

1. `https://kuran.diyanet.gov.tr/` üzerinden ilgili sureyi aç; **mukaddime** ve ilk ayetlerin tefsir notlarını oku.
2. `tafsir.text.tr` alanına 2-4 cümlelik Türkçe özet yaz (sadakatli, yorumsuz).
3. `tafsir.text.en` alanına aynı özetin İngilizce karşılığını yaz.
4. `tafsir.source.url` alanına ilgili Diyanet sayfasının tam URL'sini koy; `tafsir.source.accessedAt` olarak erişim tarihini (ISO: `YYYY-MM-DD`) ekle.
5. Sebeb-i nüzul için Diyanet mukaddimesini + Vâhidî'yi tara:
   - Sahih rivayet varsa: `event.kind = 'asbab'`, özeti yaz, kaynağı belirt.
   - Spesifik rivayet yoksa: `event.kind = 'general_context'`, dönemi ve genel çerçeveyi yaz.
6. `tafsir.verified` ve `event.verified` alanlarını `true` yap.

Doğrulanan her kayıt, UI'da kaynak linkini küçük gri bir satırla gösterir; doğrulanmayanlar uyarı ikonu alır.

### Şema Göçü (Tek Seferlik)

Eski düz metinli JSON şemasını yeni kaynak-atıflı şemaya çevirmek için:

```bash
node scripts/migrate-quran-schema.mjs
```

Idempotent — yeni şemada olan kayıtları atlar.

---

## Geliştirme

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
