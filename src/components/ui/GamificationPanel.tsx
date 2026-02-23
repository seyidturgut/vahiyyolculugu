import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Flame, Zap } from 'lucide-react';

const GamificationPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
    const { xp, streak, badges, unlockedNodes, language } = useAppStore();
    const total = 114;
    const progress = Math.round((unlockedNodes.length / total) * 100);
    const earnedBadges = badges.filter(b => b.earned);

    if (compact) {
        return (
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/8">
                {/* XP + Streak Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-200">
                        <Zap size={14} />
                        <span className="text-sm font-bold">{xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-orange-400">
                        <Flame size={14} />
                        <span className="text-sm font-bold">{streak} {language === 'TR' ? 'gün' : 'days'}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-[10px] text-white/35 mb-1.5">
                        <span>{unlockedNodes.length}/{total} {language === 'TR' ? 'sure' : 'surahs'}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Badges */}
                {earnedBadges.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                        {earnedBadges.map(b => (
                            <span key={b.id} className="text-lg" title={language === 'TR' ? b.nameTr : b.name}>
                                {b.icon}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/10">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest">
                {language === 'TR' ? 'İlerlemen' : 'Your Progress'}
            </h3>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-amber-200/8 border border-amber-200/15">
                    <Zap size={18} className="text-amber-200" />
                    <span className="text-2xl font-bold text-white">{xp}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">XP</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-orange-400/8 border border-orange-400/15">
                    <Flame size={18} className="text-orange-400" />
                    <span className="text-2xl font-bold text-white">{streak}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">
                        {language === 'TR' ? 'Gün Serisi' : 'Day Streak'}
                    </span>
                </div>
            </div>

            {/* Progress */}
            <div>
                <div className="flex justify-between text-sm text-white/50 mb-2">
                    <span>{unlockedNodes.length}/{total} {language === 'TR' ? 'sure tamamlandı' : 'surahs completed'}</span>
                    <span className="text-amber-200 font-semibold">{progress}%</span>
                </div>
                <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* All Badges */}
            <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
                    {language === 'TR' ? 'Rozetler' : 'Badges'}
                </p>
                <div className="grid grid-cols-4 gap-2">
                    {badges.map(b => (
                        <div
                            key={b.id}
                            title={language === 'TR' ? b.nameTr : b.name}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${b.earned
                                ? 'bg-amber-200/10 border-amber-200/25 opacity-100'
                                : 'bg-white/3 border-white/8 opacity-30 grayscale'
                                }`}
                        >
                            <span className="text-xl">{b.icon}</span>
                            <span className="text-[8px] text-white/50 text-center leading-tight">
                                {language === 'TR' ? b.nameTr : b.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GamificationPanel;
