import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, Plus, Minus, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import quranData from '../../data/quranChronology.json';

const MECCA_POS: [number, number, number] = [0, 0, 15]; // South
const MEDINA_POS: [number, number, number] = [0, 0, -15]; // North (relative)

const MILESTONES: Record<number, { tr: string; en: string; sub_tr: string; sub_en: string }> = {
    610: {
        tr: '"Oku! Yaratan Rabbinin adıyla oku..."',
        en: '"Read! In the name of your Lord who created..."',
        sub_tr: 'İlk Vahiy — Hira Mağarası',
        sub_en: 'First Revelation — Cave of Hira',
    },
    622: {
        tr: 'Medine\'ye Hicret',
        en: 'The Hijra to Madinah',
        sub_tr: 'İki kutsal şehrin buluşması — 622 M.',
        sub_en: 'Two holy cities united — 622 CE',
    },
    632: {
        tr: 'Vahyin Tamamlanması',
        en: 'Completion of Revelation',
        sub_tr: '23 yıllık kutsal yolculuğun sonu',
        sub_en: 'The end of 23 years of divine revelation',
    },
};

// Surah doğum halkası — mount anında genişleyip solar
const SpawnRing = ({ color }: { color: string }) => {
    const ref = useRef<THREE.Mesh>(null);
    const startRef = useRef<number | null>(null);

    useFrame((state) => {
        if (!ref.current) return;
        if (startRef.current === null) startRef.current = state.clock.elapsedTime;
        const age = state.clock.elapsedTime - startRef.current;
        if (age > 1.6) { ref.current.visible = false; return; }
        ref.current.visible = true;
        const t = age / 1.6;
        ref.current.scale.setScalar(1 + t * 7);
        (ref.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.65;
    });

    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.18, 0.38, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.65} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
    );
};

// Doğum anı beyaz parlama efekti
const BirthGlow = () => {
    const ref = useRef<THREE.Mesh>(null);
    const startRef = useRef<number | null>(null);

    useFrame((state) => {
        if (!ref.current) return;
        if (startRef.current === null) startRef.current = state.clock.elapsedTime;
        const age = state.clock.elapsedTime - startRef.current;
        if (age > 0.9) { ref.current.visible = false; return; }
        ref.current.visible = true;
        const t = age / 0.9;
        ref.current.scale.setScalar((1 - t) * 2.8);
        (ref.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.75;
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
    );
};

const CityMarker = ({ position, color, label, isActive }: { position: [number, number, number], color: string, label: string, isActive: boolean }) => {
    const beamRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (beamRef.current && isActive) {
            beamRef.current.rotation.y += 0.01;
        }
        if (glowRef.current) {
            glowRef.current.scale.setScalar(isActive ? 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1 : 0.8);
        }
    });

    return (
        <group position={position}>
            {/* Ground Glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color={color} transparent opacity={isActive ? 0.4 : 0.1} blending={THREE.AdditiveBlending} />
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <ringGeometry args={[1.2, 1.3, 32]} />
                <meshBasicMaterial color={color} transparent opacity={isActive ? 0.3 : 0.1} />
            </mesh>

            {/* Vertical Beam */}
            {isActive && (
                <group position={[0, 15, 0]}>
                    <mesh ref={beamRef}>
                        <cylinderGeometry args={[0.05, 0.4, 30, 16, 1, true]} />
                        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
                    </mesh>
                    <mesh>
                        <cylinderGeometry args={[0.01, 0.05, 30, 8, 1, true]} />
                        <meshBasicMaterial color="#fff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
                    </mesh>
                </group>
            )}

            {/* Label */}
            <Html distanceFactor={25} position={[0, 4, 0]} center zIndexRange={[100, 0]}>
                <div className={`flex flex-col items-center gap-1 transition-all duration-700 pointer-events-none ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}>
                    <div className="w-[1px] h-6 bg-gradient-to-t from-white to-transparent opacity-50" />
                    <div className="px-4 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                        <p className="text-[12px] font-black text-white uppercase tracking-[0.4em] whitespace-nowrap">
                            {label}
                        </p>
                    </div>
                </div>
            </Html>
        </group>
    );
};

const SurahParticle = ({ index, isMekke, surah, language, hoveredSurahId, setHoveredSurah, setCurrentNode, selectedSurahId }: any) => {
    const isHovered = hoveredSurahId === surah.id;
    const isSelected = selectedSurahId === surah.id;

    // Distribute in a golden spiral pattern around the city
    const angle = index * 137.5 * (Math.PI / 180);
    const radius = 3 + (index * 0.15); // Spread out progressively

    const baseX = isMekke ? MECCA_POS[0] : MEDINA_POS[0];
    const baseZ = isMekke ? MECCA_POS[2] : MEDINA_POS[2];

    const x = baseX + Math.cos(angle) * radius;
    const z = baseZ + Math.sin(angle) * radius;

    const color = isMekke ? '#fb923c' : '#34d399';
    const surahName = surah.surahName[language.toLowerCase()] || surah.surahName.tr;

    return (
        <group position={[x, 0.5, z]}>
            {/* Doğum efektleri */}
            <SpawnRing color={color} />
            <BirthGlow />

            <mesh
                onPointerOver={(e) => { e.stopPropagation(); setHoveredSurah(surah.id); }}
                onPointerOut={(e) => { e.stopPropagation(); setHoveredSurah(null); }}
                onClick={(e) => { e.stopPropagation(); setCurrentNode(surah.id); }}
            >
                {/* Larger hitbox for mobile tap */}
                <sphereGeometry args={[(isHovered || isSelected) ? 0.7 : 0.5, 8, 8]} />
                <meshBasicMaterial visible={false} />
            </mesh>

            <mesh scale={isSelected ? 2.2 : isHovered ? 1.5 : 1}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color={isSelected ? '#ffffff' : color} transparent opacity={isSelected ? 1 : 0.8} />
            </mesh>

            {/* Selection ring */}
            {isSelected && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.55, 0.72, 32]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
                </mesh>
            )}

            {/* Small light beam per surah */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 4, 8, 1, true]} />
                <meshBasicMaterial color={isSelected ? '#ffffff' : color} transparent opacity={isSelected ? 0.5 : 0.2} blending={THREE.AdditiveBlending} />
            </mesh>

            {(isHovered || isSelected) && (
                <Html position={[0, 1, 0]} center zIndexRange={[120, 0]}>
                    <div className="mb-2 w-max bg-black/90 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg pointer-events-none shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                        <p className="text-white text-xs font-bold leading-tight flex items-center gap-2">
                            <span className="text-white/40">{surah.surahNumber}.</span> {surahName}
                        </p>
                        <p className="text-white/50 text-[9px] uppercase tracking-[0.2em] mt-1">{surah.year} • {surah.period}</p>
                    </div>
                </Html>
            )}
        </group>
    );
};

// Wireframe Topography (Çizgisel Harita)
const WireframeTerrain = () => {
    const geometry = useMemo(() => {
        const size = 200;
        const segments = 100;
        const geo = new THREE.PlaneGeometry(size, size, segments, segments);
        const pos = geo.attributes.position;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);

            // Generate some procedural mountains/valleys
            let z = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 5;
            z += Math.sin(x * 0.1 + y * 0.15) * 2;

            // Flatten the "cities" area so markers sit nicely
            const distMecca = Math.sqrt(Math.pow(x - MECCA_POS[0], 2) + Math.pow(y - MECCA_POS[2], 2));
            const distMedina = Math.sqrt(Math.pow(x - MEDINA_POS[0], 2) + Math.pow(y - MEDINA_POS[2], 2));

            const flatFactor = Math.min(1, Math.max(0, Math.min(distMecca, distMedina) / 20));

            pos.setZ(i, z * flatFactor);
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    return (
        <group rotation={[-Math.PI / 2, 0, 0]}>
            {/* Base dark plane so rays don't clip as much visually */}
            <mesh geometry={geometry} position={[0, 0, -0.1]}>
                <meshBasicMaterial color="#020305" />
            </mesh>
            {/* The actual wireframe */}
            <mesh geometry={geometry}>
                <meshBasicMaterial
                    color="#2dd4bf"
                    wireframe
                    transparent
                    opacity={0.08}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
};

// Hijra Path Line
const ConnectionPath = ({ progress }: { progress: number }) => {
    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= 50; i++) {
            const t = i / 50;
            if (t > progress) continue; // Only draw up to progress

            const x = MECCA_POS[0] + (MEDINA_POS[0] - MECCA_POS[0]) * t;
            const z = MECCA_POS[2] + (MEDINA_POS[2] - MECCA_POS[2]) * t;
            // Arch upwards in the middle
            const y = Math.sin(t * Math.PI) * 5;
            pts.push(new THREE.Vector3(x, y, z));
        }
        return pts;
    }, [progress]);

    if (points.length < 2) return null;

    const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

    return (
        <group>
            <primitive object={new THREE.Line(geo, new THREE.LineBasicMaterial({
                color: '#fb923c',
                transparent: true,
                opacity: 0.6,
                linewidth: 2,
                blending: THREE.AdditiveBlending
            }))} />
            {progress >= 1 && (
                <Html position={MEDINA_POS} center zIndexRange={[50, 0]}>
                    <div className="absolute w-12 h-12 -ml-6 -mt-6 border border-emerald-500/50 rounded-full animate-ping pointer-events-none" />
                </Html>
            )}
        </group>
    );
};

const CinematicRig = ({ isPlaying, selectedYear }: { isPlaying: boolean; selectedYear: number }) => {
    const { camera, controls, size } = useThree() as any;

    useFrame((_state, delta) => {
        if (!controls) return;

        if (isPlaying) {
            controls.autoRotate = true;
            const isMobile = size.width < 768;
            let targetX = 0, targetZ = 0;
            let desiredDist: number, desiredY: number, rotSpeed: number;

            if (selectedYear <= 615) {
                // Erken Mekke: Mekke üzerinde alçak yörünge
                targetX = MECCA_POS[0];
                targetZ = MECCA_POS[2] * 0.55;
                desiredDist = isMobile ? 62 : 40;
                desiredY = isMobile ? 26 : 17;
                rotSpeed = 0.55;
            } else if (selectedYear <= 621) {
                // Geç Mekke: yükseliyor, genişliyor
                const t = (selectedYear - 615) / 6;
                targetX = 0;
                targetZ = MECCA_POS[2] * (1 - t) * 0.4;
                desiredDist = isMobile ? 62 + t * 28 : 40 + t * 20;
                desiredY = isMobile ? 26 + t * 22 : 17 + t * 16;
                rotSpeed = 0.62;
            } else if (selectedYear === 622) {
                // HİCRET: dramatik an — yavaş, yüksek, merkez
                targetX = 0;
                targetZ = 0;
                desiredDist = isMobile ? 112 : 72;
                desiredY = isMobile ? 62 : 42;
                rotSpeed = 0.25; // çok yavaş, dramatik
            } else if (selectedYear <= 630) {
                // Medine dönemi: Medine'ye odaklanma
                const t = Math.min(1, (selectedYear - 622) / 5);
                targetX = MEDINA_POS[0];
                targetZ = MEDINA_POS[2] * t * 0.55;
                desiredDist = isMobile ? 78 : 50;
                desiredY = isMobile ? 36 : 23;
                rotSpeed = 0.72;
            } else {
                // Son yıllar: tüm tabloyu gösteren geniş çekim
                const t = (selectedYear - 630) / 2;
                targetX = 0;
                targetZ = 0;
                desiredDist = isMobile ? 100 + t * 22 : 65 + t * 16;
                desiredY = isMobile ? 52 + t * 16 : 34 + t * 12;
                rotSpeed = 0.38;
            }

            const targetVec = new THREE.Vector3(targetX, 0, targetZ);
            controls.target.lerp(targetVec, delta * 1.3);
            controls.autoRotateSpeed = THREE.MathUtils.lerp(controls.autoRotateSpeed, rotSpeed, delta * 3);

            const dist = camera.position.distanceTo(controls.target);
            if (Math.abs(dist - desiredDist) > 1) {
                const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
                camera.position.addScaledVector(dir, (desiredDist - dist) * delta * 0.65);
            }
            if (Math.abs(camera.position.y - desiredY) > 0.5) {
                camera.position.y += (desiredY - camera.position.y) * delta * 0.65;
            }
        } else {
            // Yavaşça dur
            const targetVec = new THREE.Vector3(0, 0, 0);
            controls.target.lerp(targetVec, delta * 2);
            controls.autoRotateSpeed = THREE.MathUtils.lerp(controls.autoRotateSpeed, 0, delta * 2);
            if (controls.autoRotateSpeed < 0.01) controls.autoRotate = false;
        }
    });

    return null;
};

const CameraControllerEvent = () => {
    const { camera, controls } = useThree() as any;

    useEffect(() => {
        const handleZoomIn = () => {
            if (controls) {
                const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
                camera.position.addScaledVector(dir, 15);
            }
        };
        const handleZoomOut = () => {
            if (controls) {
                const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
                camera.position.addScaledVector(dir, -15);
            }
        };
        const handleReset = () => {
            if (controls) {
                controls.target.set(0, 0, 0);
                camera.position.set(60, 50, 0);
            }
        };

        window.addEventListener('map-zoom-in', handleZoomIn);
        window.addEventListener('map-zoom-out', handleZoomOut);
        window.addEventListener('map-reset', handleReset);

        return () => {
            window.removeEventListener('map-zoom-in', handleZoomIn);
            window.removeEventListener('map-zoom-out', handleZoomOut);
            window.removeEventListener('map-reset', handleReset);
        }
    }, [camera, controls]);
    return null;
};

export const AtlasScene = () => {
    const { language, setCurrentNode, currentNode } = useAppStore();
    const [selectedYear, setSelectedYear] = useState(609);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hoveredSurahId, setHoveredSurah] = useState<number | null>(null);
    const [periodFilter, setPeriodFilter] = useState<'all' | 'Mekke' | 'Medine'>('all');
    const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
    const shownMilestonesRef = useRef<Set<number>>(new Set());
    const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('atlas-intro-seen'));
    const [showHelp, setShowHelp] = useState(false);
    const showIntroModal = showIntro || showHelp;

    const dismissIntro = (startPlay: boolean) => {
        localStorage.setItem('atlas-intro-seen', '1');
        setShowIntro(false);
        setShowHelp(false);
        if (startPlay) {
            setSelectedYear(609);
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setSelectedYear(y => {
                    if (y >= 632) {
                        setIsPlaying(false);
                        return 632;
                    }
                    return y + 1;
                });
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    // Yıl 609'a döndüğünde gösterilen milestone'ları sıfırla
    useEffect(() => {
        if (selectedYear === 609) shownMilestonesRef.current.clear();
    }, [selectedYear]);

    // Anahtar yıllar için overlay tetikle
    useEffect(() => {
        const milestone = [610, 622, 632].find(y => y === selectedYear);
        if (milestone && !shownMilestonesRef.current.has(milestone)) {
            shownMilestonesRef.current.add(milestone);
            setActiveMilestone(milestone);
            const t = setTimeout(() => setActiveMilestone(null), 4500);
            return () => clearTimeout(t);
        }
    }, [selectedYear]);

    const activeSurahs = useMemo(() => {
        return (quranData as any[]).filter(d => {
            const y = parseInt(d.year);
            return !isNaN(y) && y <= selectedYear;
        });
    }, [selectedYear]);

    const visibleSurahs = useMemo(() => {
        if (periodFilter === 'all') return activeSurahs;
        return activeSurahs.filter(s => s.period === periodFilter);
    }, [activeSurahs, periodFilter]);

    const meccaActive = activeSurahs.some(s => s.period === 'Mekke');
    const medinaActive = activeSurahs.some(s => s.period === 'Medine');
    const hijraStarted = selectedYear >= 622;
    const hijraProgress = hijraStarted ? Math.min(1, (selectedYear - 621) / 2) : 0;

    return (
        <div className="relative w-full h-full bg-[#020305] flex items-center justify-center">

            {/* Intro / Help Modal */}
            <AnimatePresence>
                {showIntroModal && (
                    <motion.div
                        key="intro-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center p-5"
                        style={{ backdropFilter: 'blur(18px)', backgroundColor: 'rgba(2,3,5,0.88)' }}
                    >
                        <motion.div
                            key="intro-card"
                            initial={{ opacity: 0, scale: 0.94, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 8 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            className="max-w-sm w-full bg-[#080B10] border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-6 text-center shadow-2xl"
                        >
                            <img src="/vahiy_yolcugu_logo.png" alt="Logo" className="w-14 h-14 object-contain" />

                            <div className="flex flex-col gap-1">
                                <p className="text-amber-200/60 text-[10px] uppercase tracking-[0.5em] font-bold">
                                    {language === 'TR' ? 'Coğrafi Atlas' : 'Geographic Atlas'}
                                </p>
                                <h2 className="text-white text-2xl font-bold">
                                    {language === 'TR' ? 'Vahiy Coğrafyası' : 'Geography of Revelation'}
                                </h2>
                            </div>

                            <p className="text-white/55 text-sm leading-relaxed">
                                {language === 'TR'
                                    ? "Kur'an'ın 23 yıllık nüzul sürecini coğrafi ve kronolojik olarak keşfet. Her nokta bir sure."
                                    : "Explore 23 years of Quranic revelation geographically and chronologically. Each dot is a surah."}
                            </p>

                            {/* Renk efsanesi */}
                            <div className="w-full flex flex-col gap-2.5 p-4 rounded-2xl bg-white/[0.04] border border-white/8">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-orange-400 shrink-0" />
                                    <span className="text-white/75 text-sm text-left">
                                        {language === 'TR' ? 'Turuncu — Mekke dönemi suresi' : 'Orange — Makkah period surah'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
                                    <span className="text-white/75 text-sm text-left">
                                        {language === 'TR' ? 'Yeşil — Medine dönemi suresi' : 'Green — Madinah period surah'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-white/30 text-base">☝</span>
                                    <span className="text-white/45 text-sm text-left">
                                        {language === 'TR' ? 'Noktaya dokun — sure detayını gör' : 'Tap a dot — view surah details'}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-3">
                                <button
                                    onClick={() => dismissIntro(true)}
                                    className="sacred-btn w-full py-4 text-base"
                                >
                                    {language === 'TR' ? 'Keşfe Başla →' : 'Begin Exploration →'}
                                </button>
                                <button
                                    onClick={() => dismissIntro(false)}
                                    className="text-white/35 text-sm hover:text-white/60 transition-colors py-2"
                                >
                                    {language === 'TR' ? 'Sadece bak' : 'Just browse'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Milestone Overlay */}
            <AnimatePresence>
                {activeMilestone && MILESTONES[activeMilestone] && (
                    <motion.div
                        key={activeMilestone}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16, transition: { duration: 1 } }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-center px-8 max-w-xl">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-amber-200/70 text-[10px] uppercase tracking-[0.6em] font-bold mb-5"
                            >
                                {activeMilestone} {language === 'TR' ? 'M.' : 'CE'}
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-white text-2xl md:text-4xl font-bold leading-relaxed italic mb-5 drop-shadow-2xl"
                                style={{ textShadow: '0 0 60px rgba(251,191,36,0.3)' }}
                            >
                                {language === 'TR' ? MILESTONES[activeMilestone].tr : MILESTONES[activeMilestone].en}
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-white/40 text-sm tracking-[0.25em] uppercase"
                            >
                                {language === 'TR' ? MILESTONES[activeMilestone].sub_tr : MILESTONES[activeMilestone].sub_en}
                            </motion.p>
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="mt-8 flex items-center justify-center gap-4"
                            >
                                <div className="h-px w-16 bg-amber-200/25" />
                                <div className="w-1 h-1 rounded-full bg-amber-200/40" />
                                <div className="h-px w-16 bg-amber-200/25" />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top UI Label */}
            <div className="absolute top-10 left-10 z-30 pointer-events-none hidden md:block">
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black text-amber-200 tracking-[0.6em] uppercase">
                        {language === 'TR' ? 'HİCAZ HARİTASI' : 'HIJAZ MAP'}
                    </p>
                    <h2 className="text-white/40 text-4xl font-black uppercase tracking-tighter drop-shadow-xl">
                        {language === 'TR' ? 'VAHİY COĞRAFYASI' : 'GEOGRAPHY OF REVELATION'}
                    </h2>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute top-10 right-10 z-30 flex flex-col gap-2">
                <button
                    onClick={() => setShowHelp(true)}
                    className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all shadow-xl pointer-events-auto font-bold text-sm"
                    title={language === 'TR' ? 'Nasıl Kullanılır?' : 'How to use?'}
                >
                    ?
                </button>
                <button
                    onClick={() => window.dispatchEvent(new Event('map-reset'))}
                    className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all shadow-xl pointer-events-auto"
                    title={language === 'TR' ? 'Merkeze Dön' : 'Reset View'}
                >
                    <Compass size={18} />
                </button>
                <button
                    onClick={() => window.dispatchEvent(new Event('map-zoom-in'))}
                    className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all shadow-xl pointer-events-auto"
                    title={language === 'TR' ? 'Yakınlaş' : 'Zoom In'}
                >
                    <Plus size={20} />
                </button>
                <button
                    onClick={() => window.dispatchEvent(new Event('map-zoom-out'))}
                    className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all shadow-xl pointer-events-auto"
                    title={language === 'TR' ? 'Uzaklaş' : 'Zoom Out'}
                >
                    <Minus size={20} />
                </button>
            </div>

            <Canvas
                gl={{ antialias: true }}
                dpr={[1, 2]}
                camera={{
                    position: typeof window !== 'undefined' && window.innerWidth < 768 ? [100, 100, 0] : [60, 50, 0],
                    fov: 35
                }}
            >
                <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.05}
                    maxPolarAngle={Math.PI / 2.2}
                    minDistance={5}
                    maxDistance={120}
                />

                <CameraControllerEvent />
                <CinematicRig isPlaying={isPlaying} selectedYear={selectedYear} />

                <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
                <ambientLight intensity={0.5} />
                <pointLight position={[0, 50, 0]} intensity={2} color="#fff" />

                <WireframeTerrain />

                <CityMarker
                    position={MECCA_POS}
                    color="#fb923c"
                    label={language === 'TR' ? 'MEKKE-İ MÜKERREME' : 'MAKKAH'}
                    isActive={meccaActive}
                />

                <CityMarker
                    position={MEDINA_POS}
                    color="#34d399"
                    label={language === 'TR' ? 'MEDİNE-İ MÜNEVVERE' : 'MADINAH'}
                    isActive={medinaActive}
                />

                {hijraStarted && <ConnectionPath progress={hijraProgress} />}

                {visibleSurahs.map((surah, idx) => (
                    <SurahParticle
                        key={surah.id}
                        index={idx}
                        isMekke={surah.period === 'Mekke'}
                        surah={surah}
                        language={language}
                        hoveredSurahId={hoveredSurahId}
                        setHoveredSurah={setHoveredSurah}
                        setCurrentNode={setCurrentNode}
                        selectedSurahId={currentNode}
                    />
                ))}
            </Canvas>

            {/* Legend Badge */}
            <div className="absolute bottom-[220px] md:bottom-[260px] left-3 md:left-10 z-30 pointer-events-none">
                <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-black/55 backdrop-blur-xl border border-white/10 shadow-lg">
                    <span className="flex items-center gap-1.5 text-[11px] text-white/65 font-medium">
                        <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                        {language === 'TR' ? 'Mekke' : 'Makkah'}
                    </span>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-white/65 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        {language === 'TR' ? 'Medine' : 'Madinah'}
                    </span>
                    <span className="hidden md:block text-white/15 text-xs">·</span>
                    <span className="hidden md:block text-[10px] text-white/30">
                        {language === 'TR' ? 'Noktaya dokun' : 'Tap to explore'}
                    </span>
                </div>
            </div>

            {/* Bottom Controls Panel */}
            <div className="absolute bottom-6 md:bottom-12 inset-x-0 flex flex-col items-center px-3 md:px-10 z-30 pointer-events-none">
                <div className="glass-card max-w-4xl w-full p-4 md:p-10 pointer-events-auto border-white/10 bg-[#080B10]/80 backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.9)]">
                    <div className="flex justify-between items-center mb-4 md:mb-10 w-full">
                        <div className="flex flex-col">
                            <h3 className="text-4xl md:text-7xl font-black text-white tabular-nums tracking-tighter drop-shadow-lg flex items-baseline">
                                {selectedYear} <span className="text-base md:text-xl font-light text-white/30 tracking-[0.2em] ml-2">M.</span>
                            </h3>
                            <div className="hidden md:flex items-center gap-3 mt-2">
                                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'animate-ping bg-amber-400' : 'bg-white/20'}`} />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">
                                    {language === 'TR' ? 'Nüzul Süreci' : 'Revelation Timeline'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 md:gap-3 text-right">
                            <div className={`px-3 md:px-6 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border transition-all ${hijraStarted
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                }`}>
                                {hijraStarted
                                    ? (language === 'TR' ? 'MEDİNE DÖNEMİ' : 'MADINAH')
                                    : (language === 'TR' ? 'MEKKE DÖNEMİ' : 'MAKKAH')}
                            </div>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-white mr-1 text-base">{visibleSurahs.length}</span>
                                {periodFilter !== 'all' && <span className="text-white/20 mr-1">/ {activeSurahs.length}</span>}
                                {language === 'TR' ? 'Sure' : 'Surahs'}
                            </p>
                        </div>
                    </div>

                    {/* Period Filter Chips */}
                    <div className="flex gap-2 mb-4">
                        {(['all', 'Mekke', 'Medine'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriodFilter(p)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                    periodFilter === p
                                        ? p === 'all' ? 'bg-white text-black shadow-lg' : p === 'Mekke' ? 'bg-orange-400 text-black shadow-[0_0_12px_rgba(251,146,60,0.4)]' : 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                                        : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70'
                                }`}
                            >
                                {p === 'all'
                                    ? (language === 'TR' ? 'Tümü' : 'All')
                                    : p === 'Mekke'
                                        ? (language === 'TR' ? 'Mekke' : 'Makkah')
                                        : (language === 'TR' ? 'Medine' : 'Madinah')}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 w-full">
                        <div className="relative shrink-0">
                            {/* Empty State Hint */}
                            <AnimatePresence>
                                {selectedYear === 609 && !isPlaying && !showIntroModal && (
                                    <motion.div
                                        key="empty-hint"
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: [0.6, 1, 0.6], y: [4, 0, 4] }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                                        className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                                    >
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200/10 border border-amber-200/20 text-amber-200/80 text-[10px] font-bold uppercase tracking-wider">
                                            <Play size={9} fill="currentColor" />
                                            {language === 'TR' ? 'Oynat' : 'Play'}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <button
                                onClick={() => {
                                    if (selectedYear >= 632) setSelectedYear(609);
                                    setIsPlaying(!isPlaying);
                                }}
                                className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 text-white shadow-xl hover:shadow-white/5 hover:scale-105"
                            >
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                            </button>
                        </div>

                        <div className="relative w-full flex items-center group">
                            <input
                                type="range"
                                min={609}
                                max={632}
                                step={1}
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(parseInt(e.target.value));
                                    setIsPlaying(false);
                                }}
                                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-amber-200 transition-all outline-none"
                                style={{ WebkitAppearance: 'none' }}
                            />
                            <div className="absolute inset-x-0 -bottom-5 flex justify-between pointer-events-none">
                                {[609, 615, 622, 628, 632].map(year => (
                                    <span key={year} className={`text-[8px] md:text-[9px] font-black tracking-widest transition-all ${selectedYear === year ? 'text-white' : 'text-white/20'}`}>
                                        {year === 609 ? (language === 'TR' ? '610↑' : '610+') : year}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtlasScene;
