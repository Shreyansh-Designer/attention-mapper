
import React, { useState } from 'react';
import Header from '@/components/Header';
import DesignCanvas from '@/components/DesignCanvas';
import ControlPanel from '@/components/ControlPanel';
import { AttentionMapProvider } from '@/contexts/AttentionMapContext';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  return (
    <AttentionMapProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Toaster position="top-right" />
        <Header />
        
        <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-6 max-w-screen-2xl mx-auto w-full">
          <DesignCanvas isAnalyzing={isAnalyzing} />
          <ControlPanel 
            isAnalyzing={isAnalyzing} 
            setIsAnalyzing={setIsAnalyzing} 
          />
        </main>
        
        <footer className="px-6 py-4 text-center text-sm text-gray-500">
          AttentionMapper © {new Date().getFullYear()} • AI-Powered Attention Prediction for Figma
        </footer>
      </div>
    </AttentionMapProvider>
  );
};

export default Index;
