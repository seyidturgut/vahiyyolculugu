import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, BookOpen, Zap, ScrollText, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import LaserFlow from './LaserFlow';

const Section = ({ icon: Icon, label, children, color = 'text-amber-200/70' }: any) => (
    <div className="flex flex-col gap-2">
        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${color}`}>
            <Icon size={13} />
            <span>{label}</span>
        </div>
        <div className="pl-5">{children}</div>
    </div>
);

const BottomSheet: React.FC<{ data: any; onClose: () => void }> = ({ data, onClose }) => {
    const { language } = useAppStore();
    const lang = language.toLowerCase() as 'en' | 'tr';

    const locationName = data?.location?.name?.[lang] || data?.period || '';
    const period = data?.period || 'Mekke';
    const laserColor = period === 'Mekke' ? '#fb923c' : '#34d399';

    return (
        <AnimatePresence>
            {data && (
                <>
                    {/* Backdrop (Only visible on desktop/tablet) */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm hidden md:block"
                    />

                    {/* Modal Container */}
                    <motion.div
                        key="sheet"
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center md:p-8 pointer-events-none"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#080B10] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-xl flex flex-col gap-0 md:rounded-3xl shadow-2xl pointer-events-auto overflow-y-auto custom-scroll border-white/5 md:border"
                        >
                            {/* ── Top Navigation Bar ── */}
                            <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-4 z-[80] md:hidden">
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Desktop Close/Back (Absolute) */}
                            <div className="hidden md:flex absolute top-4 right-4 z-[80] gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all text-sm font-bold"
                                >
                                    <ArrowLeft size={16} />
                                    {language === 'TR' ? 'Geri' : 'Back'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-amber-200/20 border border-white/10 text-white transition-all"
                                >
                                    <X size={22} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* ── LaserFlow Revelation Animation ── */}
                            <div className="relative h-64 md:h-52 w-full overflow-hidden shrink-0 bg-[#060010]">
                                <Suspense fallback={
                                    <div className="w-full h-full flex items-center justify-center bg-black/40">
                                        <div className="w-8 h-8 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
                                    </div>
                                }>
                                    <LaserFlow
                                        color={laserColor}
                                        horizontalBeamOffset={0.1}
                                        verticalBeamOffset={0}
                                        wispDensity={1.5}
                                        wispSpeed={12}
                                        fogIntensity={0.6}
                                        flowSpeed={0.4}
                                    />
                                </Suspense>
                                {/* Location label overlay */}
                                <div className="absolute bottom-0 inset-x-0 p-6 flex items-center justify-center pointer-events-none"
                                    style={{ background: 'linear-gradient(to top, rgba(8,11,16,1), transparent)' }}>
                                    <p className="text-base font-bold text-white/90 tracking-widest uppercase flex items-center gap-2">
                                        <MapPin size={16} className="text-amber-200" />
                                        {locationName}
                                    </p>
                                </div>
                            </div>

                            {/* ── Content Body ── */}
                            <div className="px-7 py-8 md:py-6 flex flex-col gap-8">
                                {/* Header Info */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="text-sm font-bold uppercase tracking-widest text-amber-200/80">
                                            #{data.revelationOrder}. İniş
                                        </span>
                                        {data.period && (
                                            <span className={`text-xs px-3 py-1 rounded-full border font-bold ${data.period === 'Mekke'
                                                ? 'border-orange-400/40 text-orange-300 bg-orange-400/10'
                                                : 'border-emerald-400/40 text-emerald-300 bg-emerald-400/12'
                                                }`}>{data.period}</span>
                                        )}
                                    </div>
                                    <h2 className="text-5xl font-bold text-white leading-tight">
                                        {data.surahName[lang]}
                                    </h2>
                                    <p className="text-6xl font-arabic text-amber-200 mt-2 leading-tight" dir="rtl">
                                        {data.surahName.ar}
                                    </p>
                                </div>

                                <div className="h-px bg-white/10" />

                                {/* 1. İniş Yılı */}
                                <Section icon={Calendar} label={language === 'TR' ? '1. İniş Yılı' : '1. Year of Revelation'} color="text-amber-200/80">
                                    <p className="text-2xl font-bold text-white">
                                        {data.year || (language === 'TR' ? 'Bilinmiyor' : 'Unknown')}
                                    </p>
                                </Section>

                                {/* 2. İniş Yeri */}
                                <Section icon={MapPin} label={language === 'TR' ? '2. İndiği Yer' : '2. Place of Revelation'} color="text-orange-300/80">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-2xl font-bold text-white">{locationName}</p>
                                        {data.verses && (
                                            <span className="flex items-center gap-1.5 text-base font-medium text-white/50">
                                                <BookOpen size={14} />
                                                {data.verses} {language === 'TR' ? 'ayet' : 'verses'}
                                            </span>
                                        )}
                                    </div>
                                </Section>

                                {/* 3. Özet Tefsir */}
                                <Section icon={ScrollText} label={language === 'TR' ? '3. Sureyi Anlat (Tefsir)' : '3. Summary (Tafsir)'} color="text-blue-300/80">
                                    <p className="text-lg text-white/85 leading-relaxed">
                                        {data.tafsir?.[lang] || data.context?.[lang] || '—'}
                                    </p>
                                </Section>

                                {/* 4. Hangi Olay */}
                                <Section icon={Zap} label={language === 'TR' ? '4. İniş Sebebi' : '4. Occasion of Revelation'} color="text-emerald-300/80">
                                    <p className="text-lg text-white/85 leading-relaxed">
                                        {data.event?.[lang] || '—'}
                                    </p>
                                </Section>

                                {/* Extra padding for mobile bottom */}
                                <div className="h-12 md:hidden" />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BottomSheet;
