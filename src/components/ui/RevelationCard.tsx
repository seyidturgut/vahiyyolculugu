import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Clock, MapPin } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const RevelationCard: React.FC<{ data: any; onClose: () => void }> = ({ data, onClose }) => {
    const { language } = useAppStore();

    if (!data) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-24 left-0 right-0 glass-card mx-4 p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto custom-scroll shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-200/60 font-medium">Revelation Order #{data.revelationOrder}</span>
                        <h2 className="text-2xl font-light text-white/90 tracking-tight">{data.surahName[language.toLowerCase() as 'en' | 'tr']}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <X size={18} className="text-white/40" />
                    </button>
                </div>

                {/* Arabic Verse */}
                <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 flex flex-col items-center gap-6">
                    <p className="text-4xl font-arabic text-white leading-loose text-center dir-rtl">
                        {data.surahName.ar}
                    </p>
                    <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-mono">
                        <BookOpen size={12} />
                        <span>Verses {data.verses}</span>
                    </div>
                </div>

                {/* Context Information */}
                <div className="grid gap-4">
                    <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="p-3 rounded-xl bg-amber-200/10 text-amber-200">
                            <Clock size={16} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">Historical Context</span>
                            <p className="text-sm text-white/60 leading-relaxed font-light">
                                {data.context[language.toLowerCase() as 'en' | 'tr']}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="p-3 rounded-xl bg-amber-200/10 text-amber-200">
                            <MapPin size={16} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">Geography</span>
                            <p className="text-sm text-white/60 leading-relaxed font-light">
                                Revelation site near the coordinates [{data.coordinates.join(', ')}].
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    className="sacred-btn mt-2 bg-amber-200/10 border-amber-200/20 text-amber-100/90"
                    onClick={onClose}
                >
                    Mark as Reflected
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default RevelationCard;
