
import React, { useEffect, useRef } from 'react';
import { useAttentionMap } from '@/contexts/AttentionMapContext';

const HeatmapOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { heatmapData } = useAttentionMap();
  
  useEffect(() => {
    if (!canvasRef.current || !heatmapData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get parent dimensions
    const parentElement = canvas.parentElement;
    if (!parentElement) return;
    
    const imgElement = parentElement.querySelector('img');
    if (!imgElement) return;
    
    // Set canvas size to match the image
    canvas.width = imgElement.clientWidth;
    canvas.height = imgElement.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create gradient from cool to warm
    const createHeatGradient = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)'); // Hot (red)
      gradient.addColorStop(0.25, 'rgba(255, 128, 0, 0.6)'); // Warm (orange)
      gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.5)'); // Medium (yellow)
      gradient.addColorStop(0.75, 'rgba(0, 255, 255, 0.4)'); // Cool (cyan)
      gradient.addColorStop(1, 'rgba(0, 0, 255, 0.3)'); // Cold (blue)
      return gradient;
    };
    
    // Draw heatmap data points
    heatmapData.forEach(point => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;
      const radius = point.intensity * 50;
      
      // Create radial gradient for each point
      const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      
      if (point.intensity > 0.7) {
        // High intensity (red)
        radialGradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
        radialGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      } else if (point.intensity > 0.4) {
        // Medium intensity (yellow/orange)
        radialGradient.addColorStop(0, 'rgba(255, 165, 0, 0.6)');
        radialGradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
      } else {
        // Low intensity (blue)
        radialGradient.addColorStop(0, 'rgba(0, 0, 255, 0.4)');
        radialGradient.addColorStop(1, 'rgba(0, 0, 255, 0)');
      }
      
      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Add blend mode for better visualization
    ctx.globalCompositeOperation = 'screen';
    
  }, [heatmapData]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

export default HeatmapOverlay;
