"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useFabricEditor } from "@/hooks/useFabricEditor";

type FabricContextType = ReturnType<typeof useFabricEditor>;

const FabricContext = createContext<FabricContextType | null>(null);

export const FabricProvider = ({ children }: { children: ReactNode }) => {
    const editor = useFabricEditor();
    return (
        <FabricContext.Provider value={editor}>
            {children}
        </FabricContext.Provider>
    );
};

export const useFabric = () => {
    const context = useContext(FabricContext);
    if (!context) {
        throw new Error("useFabric must be used within a FabricProvider");
    }
    return context;
};
