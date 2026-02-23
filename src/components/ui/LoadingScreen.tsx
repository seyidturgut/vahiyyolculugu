import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

const LoadingScreen: React.FC = () => {
    const { isAppLoading, setAppLoading, language } = useAppStore();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Mükemmel bir yükleme hissi simülasyonu
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.random() * 15;
                return next >= 100 ? 100 : next;
            });
        }, 150);

        // Sistemin asıl yüklenmesi ve fontların hazır olmasını bekle
        const handleLoad = () => {
            setTimeout(() => {
                setProgress(100);
                setTimeout(() => setAppLoading(false), 800); // %100 olduktan sonra süper-smooth bekleyiş
            }, 1000); // Minimum ekranda kalma süresi (harika görünmesi için)
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => {
            clearInterval(interval);
            window.removeEventListener('load', handleLoad);
        };
    }, [setAppLoading]);

    return (
        <AnimatePresence>
            {isAppLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#05070a] overflow-hidden"
                >
                    {/* Arka Plan Glow Efektleri */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: [0, 0.4, 0.6, 0.4, 0.8], scale: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-amber-400/5 blur-[120px]"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-8">
                        {/* Logo Container */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                            {/* Logo Glow Arkada */}
                            <motion.div
                                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="absolute inset-0 bg-amber-200/20 rounded-full blur-[30px]"
                            />

                            {/* Ana Logo Resmi */}
                            <img
                                src="/vahiy_yolcugu_logo.png"
                                alt="Vahiy Yolculuğu Logo"
                                className="relative z-10 w-[120%] h-[120%] object-contain drop-shadow-[0_0_25px_rgba(251,191,36,0.3)]"
                            />
                        </div>

                        {/* Text and Loading Bar */}
                        <div className="flex flex-col items-center gap-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl md:text-3xl font-light text-white tracking-[0.2em] uppercase"
                            >
                                {language === 'TR' ? 'Sistem Başlatılıyor' : 'Initializing System'}
                            </motion.h1>

                            {/* İnce Yükleme Çizgisi */}
                            <div className="w-48 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                                <motion.div
                                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-transparent via-amber-200 to-amber-100"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.2, ease: "linear" }}
                                />
                                {/* Parlama sweeps üstünden geçen ince çizgi */}
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                />
                            </div>

                            {/* Yüzde Değeri */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-white/30 font-mono tracking-widest mt-1"
                            >
                                %{Math.round(progress).toString().padStart(3, '0')}
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
