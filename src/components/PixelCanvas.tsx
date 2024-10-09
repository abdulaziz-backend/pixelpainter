import React, { useState, useEffect, useRef } from 'react';
import { Download, Eraser, PaintBucket, Upload, ZoomIn, ZoomOut } from 'lucide-react';

interface PixelCanvasProps {
  width: number;
  height: number;
}

const PixelCanvas: React.FC<PixelCanvasProps> = ({ width, height }) => {
  const [pixels, setPixels] = useState<string[][]>([]);
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [isErasing, setIsErasing] = useState(false);
  const [isPainting, setIsPainting] = useState(false);
  const [blockSize, setBlockSize] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setPixels(Array(height).fill(Array(width).fill('#000000')));
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width * blockSize;
      canvas.height = height * blockSize;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pixels.forEach((row, i) => {
          row.forEach((color, j) => {
            ctx.fillStyle = color;
            ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
          });
        });
        // Add grid lines
        ctx.strokeStyle = '#333333';
        for (let i = 0; i <= width; i++) {
          ctx.beginPath();
          ctx.moveTo(i * blockSize, 0);
          ctx.lineTo(i * blockSize, height * blockSize);
          ctx.stroke();
        }
        for (let i = 0; i <= height; i++) {
          ctx.beginPath();
          ctx.moveTo(0, i * blockSize);
          ctx.lineTo(width * blockSize, i * blockSize);
          ctx.stroke();
        }
      }
    }
  }, [pixels, blockSize, width, height]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPainting(true);
    handleCanvasMouseMove(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / blockSize);
      const y = Math.floor((e.clientY - rect.top) / blockSize);
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const newPixels = pixels.map((row, i) =>
          i === y ? row.map((c, j) => (j === x ? (isErasing ? '#000000' : currentColor) : c)) : row
        );
        setPixels(newPixels);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPainting(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'pixel-art.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleFill = () => {
    setPixels(pixels.map(row => row.map(() => currentColor)));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            const newPixels = [];
            for (let y = 0; y < height; y++) {
              const row = [];
              for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = imageData.data[index];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                row.push(`rgb(${r},${g},${b})`);
              }
              newPixels.push(row);
            }
            setPixels(newPixels);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex space-x-4">
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          className="w-10 h-10 border-2 border-green-500"
        />
        <button
          onClick={() => setIsErasing(!isErasing)}
          className={`p-2 ${isErasing ? 'bg-red-500' : 'bg-gray-700'} text-white rounded transition-colors duration-300`}
        >
          <Eraser size={24} />
        </button>
        <button
          onClick={handleFill}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          <PaintBucket size={24} />
        </button>
        <button
          onClick={handleDownload}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
        >
          <Download size={24} />
        </button>
        <label className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-300 cursor-pointer">
          <Upload size={24} />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          className="border-4 border-green-500 cursor-crosshair"
        />
        <div className="absolute -bottom-8 left-0 right-0 flex items-center">
          <ZoomOut size={20} className="text-green-500 mr-2" />
          <input
            type="range"
            min="5"
            max="50"
            value={blockSize}
            onChange={(e) => setBlockSize(Number(e.target.value))}
            className="w-full"
          />
          <ZoomIn size={20} className="text-green-500 ml-2" />
        </div>
      </div>
    </div>
  );
};

export default PixelCanvas;