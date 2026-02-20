"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SIZES = [
  { label: "Small (2ft x 3ft)", width: 2, height: 3 },
  { label: "Standard (3ft x 4ft)", width: 3, height: 4, recommended: true },
  { label: "Large (4ft x 6ft)", width: 4, height: 6 },
  { label: "Wide (6ft x 3ft)", width: 6, height: 3 },
  { label: "Custom Size", width: null, height: null },
];

interface Size {
  label: string;
  width: number | null;
  height: number | null;
  recommended?: boolean;
}

export default function WelcomeBanner() {
  const router = useRouter();
  const [customSize, setCustomSize] = useState({ width: "", height: "" });

  const handleStart = (size: Size) => {
    if (size.width === null) return; // custom handled separately
    router.push(`/ceremony-decor/welcome-banner/${size.width}x${size.height}`);
  };

  const handleCustomStart = () => {
    if (!customSize.width || !customSize.height) return;
    router.push(
      `/ceremony-decor/welcome-banner/custom?width=${customSize.width}&height=${customSize.height}`
    );
  };

  return (
    <div className="min-h-screen p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-maroon mb-4">
        Welcome Banner - வரவேற்பு பேனர்
      </h1>
      <p className="mb-8">Design your traditional wedding welcome banner.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {SIZES.map((size, idx) => {
          // For preview: max 120px in either direction, keep aspect ratio
          let previewW = 120, previewH = 120;
          if (size.width && size.height) {
            if (size.width > size.height) {
              previewW = 120;
              previewH = 120 * (size.height / size.width);
            } else {
              previewH = 120;
              previewW = 120 * (size.width / size.height);
            }
          }
          return (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center relative min-w-45"
            >
              {size.recommended && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Recommended
                </span>
              )}

              {size.width && size.height && (
                <div className="flex items-center justify-center mb-2" style={{height: 130}}>
                  <div
                    style={{
                      width: `${previewW}px`,
                      height: `${previewH}px`,
                      border: '2px solid #f709a3',
                      background: '#fff',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      color: '#f709a3',
                      fontWeight: 600,
                    }}
                  >
                    {size.width}ft × {size.height}ft
                  </div>
                </div>
              )}
              <span className="text-lg font-semibold mb-2">{size.label}</span>

              {size.width ? (
                <button
                  className="mt-4 bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition"
                  onClick={() => handleStart(size)}
                >
                  Start Designing
                </button>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="number"
                    placeholder="Width (ft)"
                    className="border p-2 rounded"
                    value={customSize.width}
                    onChange={(e) =>
                      setCustomSize({ ...customSize, width: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Height (ft)"
                    className="border p-2 rounded"
                    value={customSize.height}
                    onChange={(e) =>
                      setCustomSize({ ...customSize, height: e.target.value })
                    }
                  />
                  <button
                    className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                    onClick={handleCustomStart}
                  >
                    Start Designing
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
