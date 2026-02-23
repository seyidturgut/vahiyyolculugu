import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const Header: React.FC = () => {
    const { language, toggleLanguage } = useAppStore();

    return (
        <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-end pointer-events-none">            <button
            onClick={toggleLanguage}
            className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-white/5 hover:border-amber-200/20 transition-all duration-300 group"
        >
            <Globe size={14} className="text-white/40 group-hover:text-amber-200/60 transition-colors" />
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-white/60">
                <span className={language === 'TR' ? 'text-amber-200' : ''}>TR</span>
                <span className="text-white/10">|</span>
                <span className={language === 'EN' ? 'text-amber-200' : ''}>EN</span>
            </div>
        </button>
        </header>
    );
};

export default Header;
