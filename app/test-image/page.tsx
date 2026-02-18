"use client";

export default function TestImage() {
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Image Loading Test</h1>
            
            <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4,5,6].map(n => (
                    <div key={n} className="bg-white p-4 rounded-lg shadow">
                        <h2 className="font-bold mb-2">design-{n}.jpg</h2>
                        {/* Direct image tag */}
                        <img 
                            src={`/templates/design-${n}.jpg`}
                            alt={`Design ${n}`}
                            className="w-full h-auto border-2 border-gray-300"
                            onLoad={() => console.log(`✓ Loaded design-${n}.jpg`)}
                            onError={() => console.error(`❌ Failed to load design-${n}.jpg`)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
