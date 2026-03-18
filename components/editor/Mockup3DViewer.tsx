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
        const dirMap: Record<string, string> = {
            'welcome-tote-bag': 'tote-bags',
            'printed-visiri-hand-fan': 'hand-fans',
            'tote-bag': 'tote-bags',
            'hand-fan': 'hand-fans'
        };

        const dir = dirMap[productType] || productType;
        const internalBagType = (productType === 'welcome-tote-bag' || dir === 'tote-bags') ? 'totebag1' : 'handfan1';
        
        const bagPath = `/assets/mockups/${dir}/${designUrl ? (designUrl.split('template=')[1]?.replace('.psd', '') || internalBagType) : internalBagType}.png`;
        
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
            const br = data[0], bg = data[1], bb = data[2];

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                const diff = Math.abs(r - br) + Math.abs(g - bg) + Math.abs(b - bb);
                if (diff < 30) {
                    data[i + 3] = 0;
                } else if (diff < 60) {
                    data[i + 3] = ((diff - 30) / 30) * 255;
                }
            }

            ctx.putImageData(imageData, 0, 0);
            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = 16;
            setBagTexture(tex);
        };
    }, [productType, designUrl]);

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
    const thickness = 0.2; // Add some depth for 3D feel

    if (!bagTexture) return null;

    return (
        <group>
            {/* The 3D Bag Body */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[width, height, thickness]} />
                {/* 
                  Materials array: [right, left, top, bottom, front, back]
                  We apply the bag texture to front and back, and a simple side color for edges.
                */}
                <meshPhysicalMaterial
                    attach="material-0" // right
                    color="#f5f5f5"
                    roughness={0.9}
                />
                <meshPhysicalMaterial
                    attach="material-1" // left
                    color="#f5f5f5"
                    roughness={0.9}
                />
                <meshPhysicalMaterial
                    attach="material-2" // top
                    color="#f5f5f5"
                    roughness={0.9}
                />
                <meshPhysicalMaterial
                    attach="material-3" // bottom
                    color="#f5f5f5"
                    roughness={0.9}
                />
                <meshPhysicalMaterial
                    attach="material-4" // front
                    map={bagTexture}
                    transparent
                    roughness={0.8}
                    metalness={0.0}
                    alphaTest={0.01}
                />
                <meshPhysicalMaterial
                    attach="material-5" // back
                    map={bagTexture}
                    transparent
                    roughness={0.8}
                    metalness={0.0}
                    alphaTest={0.01}
                />
            </mesh>

            {/* Front Design Layer */}
            {designTexture && (
                <group position={[0, -height * 0.05, thickness / 2 + 0.005]}>
                    <mesh>
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

                    {/* Simple overlay to inherit some subtle bag shadows */}
                    <mesh position={[0, 0, 0.001]}>
                        <planeGeometry args={[width * 0.85, height * 0.7]} />
                        <meshBasicMaterial
                            map={bagTexture}
                            transparent
                            opacity={0.12}
                            blending={THREE.MultiplyBlending}
                            premultipliedAlpha={true}
                        />
                    </mesh>
                </group>
            )}

            {/* Back Design Layer (Optional: Mirroring if user wants both sides, or just leave blank) */}
            {designTexture && (
                <group position={[0, -height * 0.05, -(thickness / 2 + 0.005)]} rotation={[0, Math.PI, 0]}>
                    <mesh>
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
                    <mesh position={[0, 0, 0.001]}>
                        <planeGeometry args={[width * 0.85, height * 0.7]} />
                        <meshBasicMaterial
                            map={bagTexture}
                            transparent
                            opacity={0.12}
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
