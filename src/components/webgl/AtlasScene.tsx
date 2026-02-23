import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, Plus, Minus, Compass } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import quranData from '../../data/quranChronology.json';

const MECCA_POS: [number, number, number] = [0, 0, 15]; // South
const MEDINA_POS: [number, number, number] = [0, 0, -15]; // North (relative)

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

const SurahParticle = ({ index, isMekke, surah, language, hoveredSurahId, setHoveredSurah }: any) => {
    const isHovered = hoveredSurahId === surah.id;

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
            <mesh
                onPointerOver={(e) => { e.stopPropagation(); setHoveredSurah(surah.id); }}
                onPointerOut={(e) => { e.stopPropagation(); setHoveredSurah(null); }}
            >
                {/* Hitbox for easier hovering */}
                <sphereGeometry args={[isHovered ? 0.6 : 0.4, 8, 8]} />
                <meshBasicMaterial visible={false} />
            </mesh>

            <mesh scale={isHovered ? 1.5 : 1}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} />
            </mesh>

            {/* Small light beam per surah */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 4, 8, 1, true]} />
                <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
            </mesh>

            {isHovered && (
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

const CinematicRig = ({ isPlaying }: { isPlaying: boolean }) => {
    const { camera, controls, size } = useThree() as any;

    useFrame((_state, delta) => {
        if (!controls) return;

        // Always target the center [0,0,0] to keep both Mecca and Medina in frame
        const targetVec = new THREE.Vector3(0, 0, 0);
        controls.target.lerp(targetVec, delta * 2);

        if (isPlaying) {
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.8; // Majestic rotation speed

            // Mobile needs to stay further back due to narrow horizontal FOV
            const isMobile = size.width < 768;
            const desiredDist = isMobile ? 110 : 70;
            const dist = camera.position.distanceTo(controls.target);

            if (Math.abs(dist - desiredDist) > 1) {
                const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
                const step = (desiredDist - dist) * delta * 0.5;
                camera.position.addScaledVector(dir, step);
            }

            // Swoop to a majestic cinematic angle but high enough to see all
            const desiredY = isMobile ? 50 : 30;
            if (Math.abs(camera.position.y - desiredY) > 0.5) {
                camera.position.y += (desiredY - camera.position.y) * delta * 0.5;
            }
        } else {
            // Softly stop rotation
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
    const { language } = useAppStore();
    const [selectedYear, setSelectedYear] = useState(609);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hoveredSurahId, setHoveredSurah] = useState<number | null>(null);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            // Majestic pacing: 1.5 seconds per year
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

    const activeSurahs = useMemo(() => {
        return (quranData as any[]).filter(d => {
            const y = parseInt(d.year);
            return !isNaN(y) && y <= selectedYear;
        });
    }, [selectedYear]);

    const meccaActive = activeSurahs.some(s => s.period === 'Mekke');
    const medinaActive = activeSurahs.some(s => s.period === 'Medine');
    const hijraStarted = selectedYear >= 622;
    const hijraProgress = hijraStarted ? Math.min(1, (selectedYear - 621) / 2) : 0;

    return (
        <div className="relative w-full h-full bg-[#020305] flex items-center justify-center">

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
                <CinematicRig isPlaying={isPlaying} />

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

                {activeSurahs.map((surah, idx) => (
                    <SurahParticle
                        key={surah.id}
                        index={idx}
                        isMekke={surah.period === 'Mekke'}
                        surah={surah}
                        language={language}
                        hoveredSurahId={hoveredSurahId}
                        setHoveredSurah={setHoveredSurah}
                    />
                ))}
            </Canvas>

            {/* Bottom Controls Panel */}
            <div className="absolute bottom-6 md:bottom-12 inset-x-0 flex flex-col items-center px-6 md:px-10 z-30 pointer-events-none">
                <div className="glass-card max-w-4xl w-full p-8 md:p-10 pointer-events-auto border-white/10 bg-[#080B10]/80 backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.9)]">
                    <div className="flex justify-between items-center mb-10 w-full">
                        <div className="flex flex-col">
                            <h3 className="text-6xl md:text-7xl font-black text-white tabular-nums tracking-tighter drop-shadow-lg flex items-baseline">
                                {selectedYear} <span className="text-xl font-light text-white/30 tracking-[0.2em] ml-2">M.</span>
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'animate-ping bg-amber-400' : 'bg-white/20'}`} />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">
                                    {language === 'TR' ? 'Nüzul Süreci' : 'Revelation Timeline'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 text-right">
                            <div className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] border transition-all ${hijraStarted
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                }`}>
                                {hijraStarted
                                    ? (language === 'TR' ? 'MEDİNE DÖNEMİ' : 'MEDINAH PERIOD')
                                    : (language === 'TR' ? 'MEKKE DÖNEMİ' : 'MAKKAH PERIOD')}
                            </div>
                            <div className="flex gap-4">
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-white mr-1 text-base">{activeSurahs.length}</span> {language === 'TR' ? 'Sure' : 'Surahs'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full">
                        <button
                            onClick={() => {
                                if (selectedYear >= 632) setSelectedYear(609);
                                setIsPlaying(!isPlaying);
                            }}
                            className="w-12 h-12 shrink-0 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 text-white shadow-xl hover:shadow-white/5 hover:scale-105"
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                        </button>

                        <div className="relative w-full h-8 flex items-center group">
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
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-amber-200 transition-all outline-none"
                            />
                            <div className="absolute inset-x-0 -bottom-6 flex justify-between pointer-events-none">
                                {[609, 615, 622, 628, 632].map(year => (
                                    <span key={year} className={`text-[9px] font-black tracking-widest transition-all ${selectedYear === year ? 'text-white' : 'text-white/20'}`}>
                                        {year === 609 ? '610 Öncesi' : year}
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
