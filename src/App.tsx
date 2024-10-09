import React, { useState, useEffect } from 'react';
import PixelCanvas from './components/PixelCanvas';
import { Tv } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 32, height: 32 });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-4xl text-green-500 loading">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl mb-8 flex items-center animate-pulse">
        <Tv className="mr-2" /> Pixel Painter
      </h1>
      <div className="mb-4 flex space-x-4">
        <input
          type="number"
          value={canvasSize.width}
          onChange={(e) => setCanvasSize({ ...canvasSize, width: parseInt(e.target.value) || 1 })}
          className="w-16 bg-gray-800 text-green-500 border border-green-500 p-1"
        />
        <span>x</span>
        <input
          type="number"
          value={canvasSize.height}
          onChange={(e) => setCanvasSize({ ...canvasSize, height: parseInt(e.target.value) || 1 })}
          className="w-16 bg-gray-800 text-green-500 border border-green-500 p-1"
        />
      </div>
      <PixelCanvas width={canvasSize.width} height={canvasSize.height} />
      <footer className="mt-16 text-center text-sm">
        <p>&copy; 2024 Abdulaziz Hamidjonov (ablaze)</p>
        <a href="https://t.me/pythonnews_uzbekistan" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          @pythonnews_uzbekistan
        </a>
      </footer>
    </div>
  );
}

export default App;