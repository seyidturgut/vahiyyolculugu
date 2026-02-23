import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Low-poly desert terrain
const Terrain = () => {
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(120, 120, 48, 48);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i), y = pos.getY(i);
            pos.setZ(i, Math.sin(x * 0.08) * Math.cos(y * 0.08) * 2.5 + Math.sin(x * 0.2 + y * 0.1) * 0.8);
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} geometry={geometry}>
            <meshStandardMaterial color="#0c0f16" roughness={0.95} metalness={0.05} />
        </mesh>
    );
};

const Map3D = () => {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas gl={{ antialias: true, alpha: false }}>
                <PerspectiveCamera makeDefault position={[20, 18, 20]} fov={38} />
                <Stars radius={200} depth={60} count={8000} factor={4} saturation={0} fade speed={0.5} />
                <ambientLight intensity={0.06} />
                <pointLight position={[10, 15, 10]} intensity={1.5} color="#fde68a" />
                <Terrain />
            </Canvas>
        </div>
    );
};

export default Map3D;
