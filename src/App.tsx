import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, MapPin, BookOpen } from 'lucide-react';
import Layout from './components/layout/Layout';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useAppStore } from './store/useAppStore';
import quranData from './data/quranChronology.json';
import BottomSheet from './components/ui/BottomSheet';
import AtlasScene from './components/webgl/AtlasScene';
import LoadingScreen from './components/ui/LoadingScreen';

const T = {
  TR: {
    heroTitle: 'Vahiy', heroSubtitle: 'Yolculuğu',
    heroText: "Her surenin hangi yılda, hangi olay üzerine indiğini keşfet.",
    dailyInsight: 'Günün İlhamı',
    dailyVerse: '"Oku! Yaratan Rabbinin adıyla oku..."',
    explore: '1. Sureyi Keşfet →',
    enter: 'Yolculuğa Başla',
    timelineTitle: 'Nüzul Yolu',
    timelineSub: 'sure · Kronolojik İniş Sırası',
    continueFrom: 'Son Baktığın Sure',
    mecca: 'Mekke', medina: 'Medine',
    atlasTitle: 'Coğrafi Atlas',
    atlasComingSoon: 'İnteraktif harita yakında gelecek',
    settingsTitle: 'Ayarlar',
  },
  EN: {
    heroTitle: 'Revelation', heroSubtitle: 'Journey',
    heroText: 'Discover when and why each surah was revealed.',
    dailyInsight: 'Daily Insight',
    dailyVerse: '"Read! In the name of your Lord, who created..."',
    explore: 'Explore Stage 1 →',
    enter: 'Enter the Journey',
    timelineTitle: 'Path of Nuzul',
    timelineSub: 'surahs · Chronological Order',
    continueFrom: 'Last Viewed Surah',
    mecca: 'Makkah', medina: 'Madinah',
    atlasTitle: 'Sacred Atlas',
    atlasComingSoon: 'Interactive map coming soon',
    settingsTitle: 'Settings',
  }
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full">
    {children}
  </motion.div>
);

// ─── HOME ────────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const { language, lastViewedNode, setCurrentNode } = useAppStore();
  const t = T[language];
  const lastNode = lastViewedNode ? (quranData as any[]).find(n => n.id === lastViewedNode) : null;

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 px-4 md:px-0 py-6">
        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-5 py-10">
          <div className="w-28 h-28 flex items-center justify-center mb-0">
            <img src="/vahiy_yolcugu_logo.png" alt="Logo" className="w-[120%] h-[120%] object-contain" />
          </div>
          <div className="flex flex-row items-baseline justify-center gap-3">
            <h1 className="text-5xl md:text-6xl font-light text-white leading-tight">
              {t.heroTitle}
            </h1>
            <h1 className="text-5xl md:text-6xl font-bold italic text-amber-200 leading-tight">
              {t.heroSubtitle}
            </h1>
          </div>
          <p className="text-lg text-white/60 leading-relaxed max-w-xs">{t.heroText}</p>
        </div>

        {/* Last viewed */}
        {lastNode && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onClick={() => navigate('/timeline')}
            className="glass-card p-6 flex items-center gap-5 cursor-pointer hover:border-amber-200/25 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-200/12 border border-amber-200/20 flex items-center justify-center shrink-0">
              <BookOpen size={24} className="text-amber-200/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm uppercase tracking-widest text-amber-200/60 font-bold mb-1">{t.continueFrom}</p>
              <p className="text-white font-bold text-2xl truncate">{lastNode.surahName[language.toLowerCase() as 'en' | 'tr']}</p>
              <p className="text-white/50 text-base mt-0.5">#{lastNode.revelationOrder} · {lastNode.year}</p>
            </div>
            <ChevronRight size={22} className="text-white/25 group-hover:text-amber-200/60 group-hover:translate-x-1 transition-all shrink-0" />
          </motion.div>
        )}

        {/* Daily Insight */}
        <div className="glass-card p-7 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-amber-200/70 font-bold">
            <Sparkles size={14} />
            <span>{t.dailyInsight}</span>
          </div>
          <p className="text-xl text-white/85 leading-relaxed italic">{t.dailyVerse}</p>
          <div className="h-px bg-white/8" />
          <button onClick={() => setCurrentNode(1)} className="flex items-center justify-between text-base text-white/55 hover:text-amber-200 transition-colors group font-medium">
            {t.explore}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <button onClick={() => navigate('/timeline')} className="sacred-btn w-full py-5 text-base">{t.enter}</button>
      </div>
    </PageWrapper>
  );
};

// ─── SURAH CARD ──────────────────────────────────────────────────────────────
const SurahCard = ({ node, language, t, onClick }: any) => (
  <motion.div
    whileHover={{ scale: 1.01, y: -2 }}
    whileTap={{ scale: 0.99 }}
    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
    className="h-full relative rounded-2xl border p-6 flex flex-col gap-4 cursor-pointer select-none bg-white/[0.06] border-white/12 hover:bg-white/[0.09] hover:border-amber-200/25 transition-all duration-200 hover:shadow-[0_4px_24px_rgba(251,191,36,0.08)]"
  >
    {/* Top row */}
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-base font-mono text-white/55 font-bold">#{node.revelationOrder}</span>
      {node.year && <span className="text-base text-amber-200/70 font-medium">{node.year}</span>}
      {node.period && (
        <span className={`text-xs px-3 py-1 rounded-full border font-bold ${node.period === 'Mekke'
          ? 'border-orange-400/40 text-orange-300 bg-orange-400/10'
          : 'border-emerald-400/40 text-emerald-300 bg-emerald-400/10'
          }`}>
          {node.period === 'Mekke' ? t.mecca : t.medina}
        </span>
      )}
    </div>

    {/* Name */}
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-3xl font-bold text-white leading-tight">
          {node.surahName[language.toLowerCase() as 'en' | 'tr']}
        </h3>
        <p className="text-white/50 text-base mt-1">{node.surahName.en}</p>
      </div>
      <p className="text-4xl font-arabic text-amber-200/70 shrink-0 leading-none" dir="rtl">
        {node.surahName.ar}
      </p>
    </div>

    {/* Context */}
    <p className="text-base text-white/65 leading-relaxed line-clamp-2">
      {(node.context || node.event)?.[language.toLowerCase() as 'en' | 'tr']}
    </p>

    {/* Location */}
    {node.location?.name && (
      <div className="mt-auto flex items-center gap-2 text-white/40 text-sm">
        <MapPin size={13} />
        <span>{node.location.name[language.toLowerCase() as 'en' | 'tr']}</span>
      </div>
    )}
  </motion.div>
);

// ─── TIMELINE ────────────────────────────────────────────────────────────────
import { Search, ArrowUp } from 'lucide-react';

const Timeline = () => {
  const { language, setCurrentNode } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'Hepsi' | 'Mekke' | 'Medine'>('Hepsi');
  const [showFAB, setShowFAB] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = T[language];
  const data = quranData as any[];

  useEffect(() => {
    const container = containerRef.current?.closest('main');
    if (!container) return;
    const onScroll = () => setShowFAB(container.scrollTop > 400);
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    containerRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter data based on search term and period filter
  const filteredData = useMemo(() => {
    return data.filter(node => {
      // Period filter
      if (filterPeriod !== 'Hepsi' && node.period !== filterPeriod) return false;

      // Search filter
      if (!searchTerm.trim()) return true;
      const lowerSearch = searchTerm.toLowerCase();

      // Search by Turkish Name
      if (node.surahName.tr.toLowerCase().includes(lowerSearch)) return true;
      // Search by English Name
      if (node.surahName.en.toLowerCase().includes(lowerSearch)) return true;
      // Search by Arabic Name
      if (node.surahName.ar.includes(searchTerm)) return true;
      // Search by Revelation Order Number
      if (node.revelationOrder.toString() === searchTerm) return true;
      // Search by Period (Mekke/Medine)
      if (node.period.toLowerCase().includes(lowerSearch)) return true;

      return false;
    });
  }, [data, searchTerm, filterPeriod]);

  return (
    <PageWrapper>
      <div ref={containerRef} className="px-4 md:px-0 py-4">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-light text-white">{t.timelineTitle}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <p className="text-white/45 text-lg">{filteredData.length} {t.timelineSub}</p>

              {/* Period Filter Toggle */}
              <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                <button
                  onClick={() => setFilterPeriod('Hepsi')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterPeriod === 'Hepsi' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/80'}`}
                >
                  {language === 'TR' ? 'Tümü' : 'All'}
                </button>
                <button
                  onClick={() => setFilterPeriod('Mekke')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterPeriod === 'Mekke' ? 'bg-orange-400 text-black shadow-[0_0_15px_rgba(251,146,60,0.4)]' : 'text-white/40 hover:text-white/80'}`}
                >
                  {t.mecca}
                </button>
                <button
                  onClick={() => setFilterPeriod('Medine')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterPeriod === 'Medine' ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)]' : 'text-white/40 hover:text-white/80'}`}
                >
                  {t.medina}
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-white/30 group-focus-within:text-amber-200/80 transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'TR' ? "Sure adı, İniş Sırası veya Dönem ara..." : "Search Surah name, order or period..."}
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-amber-200/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-base outline-none transition-all placeholder:text-white/30 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {filteredData.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
            <Search size={48} className="text-white/20 mb-4" />
            <p className="text-xl text-white">Sonuç bulunamadı.</p>
            <p className="text-white/50 mt-2">Başka bir kelime ile tekrar deneyin.</p>
          </div>
        ) : (
          (['Mekke', 'Medine'] as const).map(period => {
            const surahs = filteredData.filter(n => n.period === period);
            if (surahs.length === 0) return null; // Don't show empty periods

            return (
              <div key={period} className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`h-px flex-1 ${period === 'Mekke' ? 'bg-orange-400/30' : 'bg-emerald-400/30'}`} />
                  <span className={`text-sm uppercase tracking-[0.3em] font-bold px-4 py-2 rounded-full border ${period === 'Mekke'
                    ? 'border-orange-400/35 text-orange-300 bg-orange-400/8'
                    : 'border-emerald-400/35 text-emerald-300 bg-emerald-400/8'
                    }`}>
                    {period === 'Mekke' ? t.mecca : t.medina} · {surahs.length} Sure
                  </span>
                  <div className={`h-px flex-1 ${period === 'Mekke' ? 'bg-orange-400/30' : 'bg-emerald-400/30'}`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                  {surahs.map((node, i) => (
                    <motion.div className="h-full" key={node.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.015, 0.8) }}>
                      <SurahCard node={node} language={language} t={t} onClick={() => setCurrentNode(node.id)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* Scroll to Top FAB */}
        {showFAB && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-50 w-12 h-12 rounded-full bg-amber-200/15 border border-amber-200/30 text-amber-200 flex items-center justify-center shadow-xl backdrop-blur-xl hover:bg-amber-200/25 transition-all"
            aria-label="Yukarı çık"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </div>
    </PageWrapper>
  );
};

// ─── MAP ─────────────────────────────────────────────────────────────────────
const MapView = () => {
  return (
    <div className="fixed inset-0 top-[80px] bottom-[70px] md:top-0 md:bottom-0 md:left-60 bg-[#05070a] z-0 pointer-events-auto">
      <AtlasScene />
    </div>
  );
};

// ─── SETTINGS ────────────────────────────────────────────────────────────────
const SettingsView = () => {
  const { language, toggleLanguage, largeText, toggleLargeText, resetUserData } = useAppStore();
  const t = T[language];
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleReset = () => {
    if (resetConfirm) {
      resetUserData();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  };

  return (
    <PageWrapper>
      <div className="px-4 md:px-0 py-4 flex flex-col gap-4">
        <h2 className="text-4xl font-light text-white mb-4">{t.settingsTitle}</h2>

        {/* Language */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-xl">Dil / Language</p>
            <p className="text-white/45 text-base mt-1">{language === 'TR' ? 'Türkçe' : 'English'}</p>
          </div>
          <button onClick={toggleLanguage}
            className="px-6 py-3 rounded-xl bg-amber-200/12 border border-amber-200/25 text-amber-200 text-base font-bold hover:bg-amber-200/20 transition-all">
            {language === 'TR' ? 'EN' : 'TR'}
          </button>
        </div>

        {/* Large Text */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-xl">{language === 'TR' ? 'Büyük Yazı' : 'Large Text'}</p>
            <p className="text-white/45 text-base mt-1">{language === 'TR' ? 'Metni büyütür' : 'Increases text size'}</p>
          </div>
          <button
            onClick={toggleLargeText}
            className={`relative w-14 h-7 rounded-full border transition-all ${largeText ? 'bg-amber-200/20 border-amber-200/40' : 'bg-white/5 border-white/15'}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 rounded-full transition-all ${largeText ? 'left-7 bg-amber-200' : 'left-0.5 bg-white/30'}`} />
          </button>
        </div>

        {/* Reset Data */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-xl">{language === 'TR' ? 'Veriyi Sıfırla' : 'Reset Data'}</p>
            <p className="text-white/45 text-base mt-1">{language === 'TR' ? 'İlerlemeyi temizler' : 'Clears your progress'}</p>
          </div>
          <button
            onClick={handleReset}
            className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${resetConfirm ? 'bg-red-500/20 border-red-400/40 text-red-400' : 'bg-white/5 border-white/10 text-white/50 hover:border-red-400/30 hover:text-red-300'}`}
          >
            {resetConfirm ? (language === 'TR' ? 'Emin misin?' : 'Are you sure?') : (language === 'TR' ? 'Sıfırla' : 'Reset')}
          </button>
        </div>

        {/* Version */}
        <div className="text-center text-white/20 text-sm pt-4">
          <p>Vahiy Yolculuğu · v1.0.0</p>
          <p className="text-xs mt-1">{language === 'TR' ? '114 Sure · Kronolojik Nüzul Sırası' : '114 Surahs · Chronological Revelation Order'}</p>
        </div>
      </div>
    </PageWrapper>
  );
};

// ─── APP ─────────────────────────────────────────────────────────────────────
const AppContent = () => {
  const { currentNode, setCurrentNode, largeText } = useAppStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-large-text', largeText ? 'true' : 'false');
  }, [largeText]);
  const selectedVerse = (quranData as any[]).find(v => v.id === currentNode) ?? null;

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </Layout>
      <BottomSheet data={selectedVerse} onClose={() => setCurrentNode(0)} />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <LoadingScreen />
      <AppContent />
    </Router>
  );
}
