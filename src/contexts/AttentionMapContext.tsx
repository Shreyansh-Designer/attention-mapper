
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

export interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
}

interface AttentionMapSettings {
  userType: string;
  device: string;
  accessibilityMode: boolean;
  contrastWeight: number;
  textHierarchyWeight: number;
  spacingWeight: number;
}

interface AttentionMapContextType {
  designImage: string | null;
  heatmapData: HeatmapPoint[] | null;
  updateDesignImage: (image: string) => void;
  generateHeatmap: (settings: AttentionMapSettings) => Promise<void>;
  exportHeatmap: () => Promise<void>;
}

const AttentionMapContext = createContext<AttentionMapContextType | undefined>(undefined);

export const useAttentionMap = () => {
  const context = useContext(AttentionMapContext);
  if (!context) {
    throw new Error('useAttentionMap must be used within an AttentionMapProvider');
  }
  return context;
};

export const AttentionMapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[] | null>(null);

  const updateDesignImage = (image: string) => {
    setDesignImage(image);
    // Reset heatmap data when a new image is uploaded
    setHeatmapData(null);
  };

  // In a real implementation, this would call an AI API to analyze the image
  // For demo purposes, we'll generate some random heatmap data
  const generateHeatmap = async (settings: AttentionMapSettings): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      console.log('Analyzing with settings:', settings);
      
      // Simulate AI-generated heatmap data
      // In a real implementation, this would be the result of an API call
      const generatedData: HeatmapPoint[] = generateMockHeatmapData(settings);
      
      setHeatmapData(generatedData);
    } catch (error) {
      console.error('Error generating heatmap:', error);
      toast.error('Failed to generate heatmap');
      throw error;
    }
  };

  const generateMockHeatmapData = (settings: AttentionMapSettings): HeatmapPoint[] => {
    const points: HeatmapPoint[] = [];
    
    // Generate different patterns based on device and user type
    let focusPoints = [];
    
    if (settings.device === 'mobile') {
      // Mobile users tend to focus on top and center
      focusPoints = [
        { x: 0.5, y: 0.2, baseIntensity: 0.9 },
        { x: 0.5, y: 0.4, baseIntensity: 0.8 },
        { x: 0.5, y: 0.6, baseIntensity: 0.7 },
        { x: 0.5, y: 0.8, baseIntensity: 0.5 },
      ];
    } else if (settings.device === 'desktop') {
      // Desktop users scan in F-pattern
      focusPoints = [
        { x: 0.2, y: 0.2, baseIntensity: 0.9 }, // Top left
        { x: 0.5, y: 0.2, baseIntensity: 0.8 }, // Top middle
        { x: 0.8, y: 0.2, baseIntensity: 0.7 }, // Top right
        { x: 0.2, y: 0.4, baseIntensity: 0.8 }, // Middle left
        { x: 0.5, y: 0.4, baseIntensity: 0.7 }, // Middle
        { x: 0.2, y: 0.6, baseIntensity: 0.7 }, // Bottom left
        { x: 0.5, y: 0.6, baseIntensity: 0.6 }, // Bottom middle
      ];
    } else {
      // Tablet users have more distributed attention
      focusPoints = [
        { x: 0.3, y: 0.3, baseIntensity: 0.8 },
        { x: 0.7, y: 0.3, baseIntensity: 0.8 },
        { x: 0.5, y: 0.5, baseIntensity: 0.7 },
        { x: 0.3, y: 0.7, baseIntensity: 0.7 },
        { x: 0.7, y: 0.7, baseIntensity: 0.6 },
      ];
    }
    
    // Apply user type modifications
    if (settings.userType === 'elderly') {
      // Elderly users tend to focus more on larger elements and have less distributed attention
      focusPoints = focusPoints.map(point => ({
        ...point,
        baseIntensity: point.baseIntensity * 1.2 > 1 ? 1 : point.baseIntensity * 1.2
      }));
    } else if (settings.userType === 'tech-savvy') {
      // Tech-savvy users scan more efficiently and have more distributed attention
      focusPoints = focusPoints.map(point => ({
        ...point,
        baseIntensity: point.baseIntensity * 0.9
      }));
      
      // Add more scanning points
      focusPoints.push(
        { x: 0.1, y: 0.5, baseIntensity: 0.6 },
        { x: 0.9, y: 0.5, baseIntensity: 0.6 }
      );
    }
    
    // Apply accessibility modifications
    if (settings.accessibilityMode) {
      // Users with accessibility needs focus more on specific areas
      focusPoints = focusPoints.map(point => ({
        ...point,
        baseIntensity: Math.min(point.baseIntensity * 1.3, 1)
      }));
    }
    
    // Create points from focus points
    focusPoints.forEach(focusPoint => {
      // Add the main focus point
      points.push({
        x: focusPoint.x,
        y: focusPoint.y,
        intensity: focusPoint.baseIntensity
      });
      
      // Add some random variation around main points
      const numVariations = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numVariations; i++) {
        const xOffset = (Math.random() - 0.5) * 0.2;
        const yOffset = (Math.random() - 0.5) * 0.2;
        const intensityDrop = Math.random() * 0.3;
        
        points.push({
          x: Math.max(0, Math.min(1, focusPoint.x + xOffset)),
          y: Math.max(0, Math.min(1, focusPoint.y + yOffset)),
          intensity: Math.max(0.1, focusPoint.baseIntensity - intensityDrop)
        });
      }
    });
    
    // Add some random low-intensity points across the design
    for (let i = 0; i < 15; i++) {
      points.push({
        x: Math.random(),
        y: Math.random(),
        intensity: Math.random() * 0.3
      });
    }
    
    // Apply weight factors based on settings
    return points.map(point => ({
      ...point,
      intensity: Math.min(
        point.intensity * 
        (1 + (settings.contrastWeight - 0.5) * 0.4) * 
        (1 + (settings.textHierarchyWeight - 0.5) * 0.3) * 
        (1 + (settings.spacingWeight - 0.5) * 0.2),
        1
      )
    }));
  };

  const exportHeatmap = async (): Promise<void> => {
    if (!designImage || !heatmapData) {
      toast.error('No heatmap data to export');
      return;
    }
    
    try {
      // In a real implementation, this would generate a report or download an image
      // For demo purposes, we'll just log the data and show a success message
      console.log('Exporting heatmap data:', heatmapData);
      
      // Create a simulated delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, here we would trigger a file download
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error exporting heatmap:', error);
      toast.error('Failed to export heatmap');
      throw error;
    }
  };

  return (
    <AttentionMapContext.Provider value={{
      designImage,
      heatmapData,
      updateDesignImage,
      generateHeatmap,
      exportHeatmap
    }}>
      {children}
    </AttentionMapContext.Provider>
  );
};
