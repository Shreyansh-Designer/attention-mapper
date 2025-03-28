
import React, { useEffect, useRef, useState } from 'react';
import { useAttentionMap } from '@/contexts/AttentionMapContext';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import HeatmapOverlay from './HeatmapOverlay';
import { toast } from 'sonner';

interface DesignCanvasProps {
  isAnalyzing: boolean;
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({ isAnalyzing }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { heatmapData, updateDesignImage } = useAttentionMap();
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setDesignImage(result);
        updateDesignImage(result);
        setIsLoading(false);
        toast.success('Design uploaded successfully');
      };
      reader.onerror = () => {
        setIsLoading(false);
        toast.error('Failed to load image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        setIsLoading(true);
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setDesignImage(result);
          updateDesignImage(result);
          setIsLoading(false);
          toast.success('Design uploaded successfully');
        };
        reader.onerror = () => {
          setIsLoading(false);
          toast.error('Failed to load image');
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="flex-1 min-h-[400px] lg:min-h-0 flex flex-col overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-medium">Design Canvas</h2>
        <p className="text-sm text-gray-500">Upload or drag and drop your design</p>
      </div>

      <div
        ref={canvasRef}
        className="relative flex-1 flex flex-col items-center justify-center p-4 bg-white overflow-auto"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={!designImage ? triggerFileInput : undefined}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <Skeleton className="h-[300px] w-[400px]" />
          </div>
        )}

        {!designImage && !isLoading && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="mb-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p className="text-lg font-medium">Drop your design here</p>
            <p className="text-sm text-gray-500 mt-1">or click to upload</p>
            <p className="text-xs text-gray-400 mt-3">Supports PNG, JPG, JPEG, GIF</p>
          </div>
        )}

        {designImage && (
          <div className="relative max-w-full max-h-full">
            <img 
              src={designImage} 
              alt="Uploaded design" 
              className="max-w-full max-h-[calc(100vh-300px)] object-contain"
            />
            
            {isAnalyzing && heatmapData && (
              <HeatmapOverlay />
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DesignCanvas;
