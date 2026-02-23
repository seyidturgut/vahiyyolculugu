import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Map, Settings } from 'lucide-react';
import Map3D from '../webgl/Map3D';
import Header from './Header';

const NAV_ITEMS = [
    { to: '/', icon: Home, label: 'Ana Sayfa', end: true },
    { to: '/timeline', icon: Compass, label: 'Nüzul Yolu', end: false },
    { to: '/map', icon: Map, label: 'Atlas', end: false },
    { to: '/settings', icon: Settings, label: 'Ayarlar', end: false },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isMapPage = location.pathname === '/map';

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#080B10]">
            {!isMapPage && <Map3D />}

            {/* Desktop */}
            <div className="hidden md:flex relative z-10 h-screen">
                <aside className="fixed left-0 top-0 h-full w-60 z-30 flex flex-col bg-black/40 backdrop-blur-2xl border-r border-white/8">
                    <div className="p-7 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center translate-y-[-2px]">
                                <img src="/vahiy_yolcugu_logo.png" alt="Logo" className="w-[120%] h-[120%] object-contain" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Vahiy</p>
                                <p className="text-white/30 text-[10px] uppercase tracking-widest">Yolculuğu</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 px-3 space-y-1">
                        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
                            <NavLink key={to} to={to} end={end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-amber-200/15 text-amber-200 border border-amber-200/20' : 'text-white/45 hover:text-white/75 hover:bg-white/6'
                                    }`
                                }
                            >
                                <Icon size={18} strokeWidth={1.5} />
                                <span className="text-sm font-medium">{label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main className="ml-60 flex-1 h-screen overflow-y-auto custom-scroll">
                    <Header />
                    <div className="max-w-5xl mx-auto px-8 pt-24 pb-16">{children}</div>
                </main>
            </div>

            {/* Mobile */}
            <div className="md:hidden relative z-10 h-screen flex flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto custom-scroll pt-20 pb-24">
                    {children}
                </main>
                <nav className="fixed bottom-0 left-0 right-0 z-30 h-[70px] bg-[#080B10]/85 backdrop-blur-2xl border-t border-white/8 flex items-center justify-around px-2">
                    {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
                        <NavLink key={to} to={to} end={end}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 ${isActive ? 'text-amber-200' : 'text-white/30'}`
                            }
                        >
                            <Icon size={20} strokeWidth={1.3} />
                            <span className="text-[9px] font-medium tracking-wide">{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Layout;
