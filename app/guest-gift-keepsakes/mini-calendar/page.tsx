'use client';

import React, { useState } from 'react';
import SizeSelector from '@/components/guest-gift-keepsakes/mini-calendar/SizeSelector';
import Editor from '@/components/guest-gift-keepsakes/mini-calendar/Editor';

export default function MiniCalendar() {
  const [selectedSize, setSelectedSize] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white">
      {!selectedSize ? (
        <SizeSelector onSelect={setSelectedSize} />
      ) : (
        <Editor
          size={selectedSize}
          onBack={() => setSelectedSize(null)}
        />
      )}
    </div>
  );
}
