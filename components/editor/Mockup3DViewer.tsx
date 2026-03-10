"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useMemo, useState, useEffect } from "react";

interface Mockup3DViewerProps {
    designUrl: string | null;
    productType: string;
}

function BagModel({ designUrl, productType }: Mockup3DViewerProps) {
    const [bagTexture, setBagTexture] = useState<THREE.Texture | null>(null);
    const [aspect, setAspect] = useState(1);

    // 1. High-Quality Process and Cutout the Bag Image
    useEffect(() => {
        const bagPath = `/assets/mockups/${productType || 'tote-bag'}/white bag.png`;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = bagPath;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;
            setAspect(img.width / img.height);

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Sample corner for background color
            const br = data[0], bg = data[1], bb = data[2];

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                // Slightly tighter threshold for white backgrounds to avoid killing the bag itself
                const diff = Math.abs(r - br) + Math.abs(g - bg) + Math.abs(b - bb);

                if (diff < 30) { // Reduced from 50
                    data[i + 3] = 0;
                } else if (diff < 60) { // Reduced from 80
                    data[i + 3] = ((diff - 30) / 30) * 255;
                }
            }

            ctx.putImageData(imageData, 0, 0);
            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = 16;
            setBagTexture(tex);
        };
    }, [productType]);

    // 2. User Design Texture
    const designTexture = useMemo(() => {
        if (!designUrl) return null;
        const loader = new THREE.TextureLoader();
        const tex = loader.load(designUrl);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 16;
        return tex;
    }, [designUrl]);

    // 3. Dimensions Logic
    const height = 3.6;
    const width = height * aspect;

    if (!bagTexture) return null;

    return (
        <group rotation={[0, 0.15, 0]}> {/* Slight angle for 3D feel */}
            {/* The actual bag cutout */}
            <mesh castShadow receiveShadow>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                    map={bagTexture}
                    transparent
                    side={THREE.DoubleSide}
                    roughness={0.9}
                    metalness={0.0}
                    alphaTest={0.01}
                />
            </mesh>

            {/* Design Layer - Balanced & Clean */}
            {designTexture && (
                <group position={[0, -height * 0.05, 0.012]}>
                    <mesh>
                        {/* More natural size to fill the bag face */}
                        <planeGeometry args={[width * 0.85, height * 0.7]} />
                        <meshStandardMaterial
                            map={designTexture}
                            transparent
                            opacity={0.98}
                            roughness={0.8}
                            metalness={0.0}
                            polygonOffset
                            polygonOffsetFactor={-1}
                        />
                    </mesh>

                    {/* Simple overlay to inherit some subtle bag shadows without ghosting */}
                    <mesh position={[0, 0, 0.001]}>
                        <planeGeometry args={[width * 0.85, height * 0.7]} />
                        <meshBasicMaterial
                            map={bagTexture}
                            transparent
                            opacity={0.12} // Very subtle
                            blending={THREE.MultiplyBlending}
                            premultipliedAlpha={true}
                        />
                    </mesh>
                </group>
            )}
        </group>
    );
}

export default function Mockup3DViewer({ designUrl, productType }: Mockup3DViewerProps) {
    return (
        <div className="w-full h-full bg-white">
            <Canvas shadows gl={{ antialias: true, preserveDrawingBuffer: true }}>
                <PerspectiveCamera makeDefault position={[0, 0.2, 8.5]} fov={25} />
                <Suspense fallback={null}>
                    <Environment preset="studio" />
                    <ambientLight intensity={0.7} />
                    <spotLight position={[5, 10, 5]} intensity={1.5} angle={0.2} penumbra={1} castShadow />

                    <BagModel designUrl={designUrl} productType={productType} />

                    <ContactShadows
                        position={[0, -1.9, 0]}
                        opacity={0.4}
                        scale={12}
                        blur={3}
                        far={2}
                    />

                    <OrbitControls
                        enablePan={false}
                        enableZoom={true}
                        autoRotate={true}
                        autoRotateSpeed={0.3}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
