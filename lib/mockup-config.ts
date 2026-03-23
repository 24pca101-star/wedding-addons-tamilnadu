export interface MockupConfig {
    modelPath: string;
    meshName: string; // The specific mesh name in the GLB to apply the design to
    fallbackGeometry: 'box' | 'cylinder' | 'plane';
    initialCamera: {
        position: [number, number, number];
        target: [number, number, number];
    };
    modelScale?: [number, number, number];
    modelRotation?: [number, number, number];
    textureSettings?: {
        repeat?: [number, number];
        offset?: [number, number];
        rotation?: number;
        mirrored?: boolean;
    };
}

export const MOCKUP_CONFIGS: Record<string, MockupConfig> = {
    "welcome-tote-bag": {
        modelPath: "/storage/models/tote-bag.glb",
        meshName: "ToteBag_Mesh",
        fallbackGeometry: 'box',
        initialCamera: {
            position: [0, 0, 5],
            target: [0, 0, 0]
        },
        modelScale: [1, 1, 1]
    },
    "team-bride-t-shirts": {
        modelPath: "/storage/models/tshirt-front.glb",
        meshName: "TShirt_Front_Mesh",
        fallbackGeometry: 'plane',
        initialCamera: {
            position: [0, 0, 4],
            target: [0, 0, 0]
        }
    },
    "team-groom-t-shirts": {
        modelPath: "/storage/models/tshirt-front.glb",
        meshName: "TShirt_Front_Mesh",
        fallbackGeometry: 'plane',
        initialCamera: {
            position: [0, 0, 4],
            target: [0, 0, 0]
        }
    },
    "bride-groom-t-shirts": {
        modelPath: "/storage/models/tshirt-front.glb",
        meshName: "TShirt_Front_Mesh",
        fallbackGeometry: 'plane',
        initialCamera: {
            position: [0, 0, 4],
            target: [0, 0, 0]
        }
    },
    "customized-shirts-kurtas": {
        modelPath: "/storage/models/tshirt-front.glb",
        meshName: "TShirt_Front_Mesh",
        fallbackGeometry: 'plane',
        initialCamera: {
            position: [0, 0, 4],
            target: [0, 0, 0]
        }
    },
    "water-bottle-label": {
        modelPath: "/storage/models/water-bottle.glb",
        meshName: "Label_Mesh",
        fallbackGeometry: 'cylinder',
        initialCamera: {
            position: [0, 0, 6],
            target: [0, 0, 0]
        }
    },
    "fridge-magnet": {
        modelPath: "/storage/models/fridge-magnet.glb",
        meshName: "Magnet_Mesh",
        fallbackGeometry: 'plane',
        initialCamera: {
            position: [0, 0, 3],
            target: [0, 0, 0]
        }
    }
};

export const getMockupConfig = (subcategory: string): MockupConfig | null => {
    return MOCKUP_CONFIGS[subcategory] || null;
};
