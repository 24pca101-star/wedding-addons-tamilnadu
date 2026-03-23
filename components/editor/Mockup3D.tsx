"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, useTexture, Center, Float, Environment, ContactShadows } from "@react-three/drei";
import { X, Loader2 } from "lucide-react";
import * as THREE from "three";
import { MockupConfig } from "@/lib/mockup-config";

type Props = {
    config: MockupConfig;
    textureUrl: string;
    onClose: () => void;
};

function Model({ config, textureUrl }: { config: MockupConfig; textureUrl: string }) {
    // If we had the GLB models, we would use them here.
    // For now, let's implement the fallback system.
    
    // Attempt to load the GLTF, but catch errors to show fallbacks
    // In a real environment, we'd check if file exists.
    
    return <FallbackModel config={config} textureUrl={textureUrl} />;
}

function FallbackModel({ config, textureUrl }: { config: MockupConfig; textureUrl: string }) {
    const texture = useTexture(textureUrl);
    
    // Configure texture mapping
    // Three.js texture coordinate (0,0) is bottom-left, 
    // Fabric.js/Canvas is top-left.
    texture.flipY = true; 
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Most 3D models expect texture (0,0) at bottom-left.
    // However, if the design looks mirrored horizontally, we can flip it.
    if (config.textureSettings?.mirrored) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1;
        texture.offset.x = 1;
    }

    if (config.textureSettings) {
        if (config.textureSettings.repeat) texture.repeat.set(...config.textureSettings.repeat);
        if (config.textureSettings.offset) {
            texture.offset.x += config.textureSettings.offset[0];
            texture.offset.y += config.textureSettings.offset[1];
        }
        if (config.textureSettings.rotation) texture.rotation = config.textureSettings.rotation;
    }

    const material = (
        <meshStandardMaterial 
            map={texture} 
            roughness={0.4} 
            metalness={0.1} 
            color="#ffffff" // Ensure a white base for the design
            transparent={true}
        />
    );

    return (
        <Center top>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {config.fallbackGeometry === 'box' && (
                    <group>
                        {/* The Bag Body */}
                        <mesh castShadow receiveShadow>
                            <boxGeometry args={[3, 4, 0.5]} />
                            {material}
                        </mesh>
                        {/* Left Handle */}
                        <mesh position={[-0.8, 2.2, 0]}>
                            <torusGeometry args={[0.5, 0.05, 16, 32, Math.PI]} />
                            <meshStandardMaterial color="#d1d5db" />
                        </mesh>
                        {/* Right Handle */}
                        <mesh position={[0.8, 2.2, 0]}>
                            <torusGeometry args={[0.5, 0.05, 16, 32, Math.PI]} />
                            <meshStandardMaterial color="#d1d5db" />
                        </mesh>
                    </group>
                )}
                
                {config.fallbackGeometry === 'cylinder' && (
                    <group>
                        {/* The Bottle Body */}
                        <mesh castShadow receiveShadow>
                            <cylinderGeometry args={[1, 1, 4, 32]} />
                            <meshPhysicalMaterial 
                                color="#ffffff"
                                transmission={0.9}
                                thickness={0.5}
                                roughness={0.1}
                                metalness={0}
                                transparent
                                opacity={0.3}
                            />
                        </mesh>
                        {/* The Cap */}
                        <mesh position={[0, 2.1, 0]}>
                            <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
                            <meshStandardMaterial color="#3b82f6" roughness={0.5} />
                        </mesh>
                        {/* The Label (Sticker) */}
                        <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
                            <cylinderGeometry args={[1.01, 1.01, 2, 32]} />
                            {material}
                        </mesh>
                    </group>
                )}
                
                {config.fallbackGeometry === 'plane' && (
                    <group>
                        {/* Simple T-Shirt Shape Fallback */}
                        <mesh castShadow receiveShadow>
                            {/* Main Body */}
                            <boxGeometry args={[3.5, 4.5, 0.1]} />
                            {material}
                        </mesh>
                        {/* Left Sleeve */}
                        <mesh position={[-2.2, 1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
                            <boxGeometry args={[1.5, 0.8, 0.1]} />
                            <meshStandardMaterial color="#ffffff" />
                        </mesh>
                        {/* Right Sleeve */}
                        <mesh position={[2.2, 1.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
                            <boxGeometry args={[1.5, 0.8, 0.1]} />
                            <meshStandardMaterial color="#ffffff" />
                        </mesh>
                    </group>
                )}
            </Float>
        </Center>
    );
}

export default function Mockup3D({ config, textureUrl, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center backdrop-blur-sm p-4 md:p-10 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-white z-10">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                            3D Product View
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">Rotate and zoom to see your design in 3D</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900 group"
                    >
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Scene */}
                <div className="flex-1 bg-[#f8f9fa] relative">
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            <Loader2 className="animate-spin text-pink-500" size={48} />
                            <p className="text-gray-400 font-bold animate-pulse">Generating 3D Scene...</p>
                        </div>
                    }>
                        <Canvas shadows camera={{ position: config.initialCamera.position, fov: 45 }}>
                            <Stage 
                                intensity={0.5} 
                                environment="city" 
                                shadows={{ type: 'contact', opacity: 0.2 }}
                                adjustCamera={1.2}
                            >
                                <Model config={config} textureUrl={textureUrl} />
                            </Stage>
                            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                        </Canvas>
                    </Suspense>

                    {/* Instruction Hint */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-gray-500 text-xs font-bold pointer-events-none shadow-sm">
                        DRAG TO ROTATE • SCROLL TO ZOOM
                    </div>
                </div>
                
                {/* Footer / Meta */}
                <div className="p-4 bg-gray-50 border-t text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        Mockup System v1.0 • Using Standard {config.fallbackGeometry.toUpperCase()} Projection
                    </p>
                </div>
            </div>
        </div>
    );
}
